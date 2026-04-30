'use client'

import { useState, useEffect, useCallback } from 'react'

export interface GeoLocationData {
  city: string | null
  region: string | null
  country: string | null
  countryCode: string | null
  isInSouthAfrica: boolean
  isInJohannesburg: boolean
  suggestedLocation: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

interface UseGeolocationReturn {
  location: GeoLocationData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  requestPreciseLocation: () => Promise<void>
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeoLocationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch IP-based location (less precise but doesn't require permission)
  const fetchIPLocation = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/geolocation')
      if (!response.ok) {
        throw new Error('Failed to fetch location')
      }
      const data: GeoLocationData = await response.json()
      setLocation(data)
    } catch (err) {
      console.error('[v0] IP geolocation error:', err)
      setError('Could not determine your location')
      // Set default to South Africa
      setLocation({
        city: null,
        region: null,
        country: 'South Africa',
        countryCode: 'ZA',
        isInSouthAfrica: true,
        isInJohannesburg: false,
        suggestedLocation: '',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Request precise browser geolocation (requires user permission)
  const requestPreciseLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        })
      })

      const { latitude, longitude } = position.coords

      // Send coordinates to our API for processing
      const response = await fetch('/api/geolocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude }),
      })

      if (!response.ok) {
        throw new Error('Failed to process coordinates')
      }

      const data: GeoLocationData = await response.json()
      setLocation(data)
    } catch (err) {
      console.error('[v0] Precise geolocation error:', err)
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable')
            break
          case err.TIMEOUT:
            setError('Location request timed out')
            break
        }
      } else {
        setError('Failed to get precise location')
      }
      // Fall back to IP-based location
      await fetchIPLocation()
    } finally {
      setIsLoading(false)
    }
  }, [fetchIPLocation])

  // Initial fetch using IP-based location
  useEffect(() => {
    fetchIPLocation()
  }, [fetchIPLocation])

  return {
    location,
    isLoading,
    error,
    refetch: fetchIPLocation,
    requestPreciseLocation,
  }
}
