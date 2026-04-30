import { NextRequest, NextResponse } from 'next/server'

interface GeoLocation {
  city: string | null
  region: string | null
  country: string | null
  countryCode: string | null
  isInSouthAfrica: boolean
  isInJohannesburg: boolean
  suggestedLocation: string
}

export async function GET(request: NextRequest) {
  // Get IP-based location from headers (Vercel provides these)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const vercelCity = request.headers.get('x-vercel-ip-city')
  const vercelCountry = request.headers.get('x-vercel-ip-country')
  const vercelRegion = request.headers.get('x-vercel-ip-country-region')
  
  // Decode URL-encoded city names
  const city = vercelCity ? decodeURIComponent(vercelCity) : null
  const region = vercelRegion ? decodeURIComponent(vercelRegion) : null
  const country = vercelCountry
  
  // Check if user is in South Africa
  const isInSouthAfrica = country === 'ZA'
  
  // Check if user is in Johannesburg area
  // Johannesburg and surrounding areas (Gauteng province)
  const johannesburgAreas = [
    'johannesburg', 'joburg', 'jozi', 'sandton', 'randburg', 
    'roodepoort', 'soweto', 'midrand', 'centurion', 'pretoria',
    'kempton park', 'boksburg', 'benoni', 'germiston', 'alberton'
  ]
  
  const isInJohannesburg = isInSouthAfrica && city 
    ? johannesburgAreas.some(area => 
        city.toLowerCase().includes(area) || 
        (region && region.toLowerCase() === 'gp') // GP = Gauteng Province
      )
    : false
  
  // Determine the suggested location for job filtering
  let suggestedLocation = ''
  
  if (isInJohannesburg) {
    suggestedLocation = 'johannesburg'
  } else if (isInSouthAfrica && city) {
    // Use the actual city for other SA locations
    suggestedLocation = city.toLowerCase()
  } else if (isInSouthAfrica) {
    suggestedLocation = '' // Empty means all SA jobs
  } else {
    // For users outside SA, still show SA jobs but no location filter
    suggestedLocation = ''
  }
  
  const geoData: GeoLocation = {
    city,
    region,
    country,
    countryCode: country,
    isInSouthAfrica,
    isInJohannesburg,
    suggestedLocation,
  }
  
  return NextResponse.json(geoData)
}

// Also support POST for browser geolocation coordinates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latitude, longitude } = body
    
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }
    
    // Johannesburg coordinates: approximately -26.2041, 28.0473
    // Gauteng province bounding box (approximate)
    const gautengBounds = {
      north: -25.2,
      south: -26.9,
      west: 27.0,
      east: 29.2,
    }
    
    // South Africa bounding box (approximate)
    const saBounds = {
      north: -22.0,
      south: -35.0,
      west: 16.0,
      east: 33.0,
    }
    
    const isInSouthAfrica = 
      latitude >= saBounds.south &&
      latitude <= saBounds.north &&
      longitude >= saBounds.west &&
      longitude <= saBounds.east
    
    const isInJohannesburg = 
      isInSouthAfrica &&
      latitude >= gautengBounds.south &&
      latitude <= gautengBounds.north &&
      longitude >= gautengBounds.west &&
      longitude <= gautengBounds.east
    
    let suggestedLocation = ''
    
    if (isInJohannesburg) {
      suggestedLocation = 'johannesburg'
    } else if (isInSouthAfrica) {
      // Could add more city detection based on coordinates
      // For now, just don't filter by location for other SA areas
      suggestedLocation = ''
    }
    
    return NextResponse.json({
      city: isInJohannesburg ? 'Johannesburg Area' : (isInSouthAfrica ? 'South Africa' : 'International'),
      region: isInJohannesburg ? 'Gauteng' : null,
      country: isInSouthAfrica ? 'South Africa' : null,
      countryCode: isInSouthAfrica ? 'ZA' : null,
      isInSouthAfrica,
      isInJohannesburg,
      suggestedLocation,
      coordinates: { latitude, longitude },
    })
  } catch (error) {
    console.error('[v0] Geolocation POST error:', error)
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
