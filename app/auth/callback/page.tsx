'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { BrandMark } from '@/components/brand-mark'
import { Button } from '@/components/ui/button'
import { persistSupabaseSession } from '@/lib/supabase-auth'

export default function AuthCallbackPage() {
  const [message, setMessage] = useState('Finishing sign-in...')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const queryParams = new URLSearchParams(window.location.search)
    const error = hashParams.get('error_description') || queryParams.get('error_description')
    const accessToken = hashParams.get('access_token')

    if (error) {
      setFailed(true)
      setMessage(error)
      return
    }

    if (!accessToken) {
      setFailed(true)
      setMessage('No Supabase session was returned. Check your OAuth redirect settings.')
      return
    }

    persistSupabaseSession({
      access_token: accessToken,
      refresh_token: hashParams.get('refresh_token') || undefined,
      expires_in: Number(hashParams.get('expires_in')) || undefined,
      token_type: hashParams.get('token_type') || undefined,
    })

    setMessage('Signed in. Taking you home...')
    window.setTimeout(() => {
      window.location.href = '/'
    }, 700)
  }, [])

  return (
    <main className="auth-page flex min-h-screen items-center justify-center px-4 py-10">
      <div className="auth-card soft-panel w-full max-w-md p-7 text-center">
        <Link href="/" className="auth-card-logo mx-auto justify-center" aria-label="Sonke home">
          <BrandMark size="md" />
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold">
          {failed ? 'Sign-in needs attention' : 'Almost there'}
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">{message}</p>

        {failed ? (
          <Button asChild className="hero-button mt-6 h-12 px-6">
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        ) : null}
      </div>
    </main>
  )
}
