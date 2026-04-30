'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  signInWithPassword,
  signUpWithPassword,
  startOAuth,
  supabaseConfigured,
} from '@/lib/supabase-auth'

type AuthMode = 'sign-in' | 'sign-up'

const trustItems = [
  'Save matched opportunities',
  'Track earning goals',
  'Return to your weekly plan',
]

const pageCopy = {
  'sign-in': {
    eyebrow: 'Welcome back',
    title: 'Sign in to Sonke.',
    description: 'Return to saved jobs, earning goals, and the next steps you were working through.',
    action: 'Sign in',
    switchPrompt: "Don't have an account?",
    switchLabel: 'Create one',
    navSwitchLabel: 'Create account',
    switchHref: '/sign-up',
    success: 'Signed in. Taking you back to the homepage.',
  },
  'sign-up': {
    eyebrow: 'Start planning',
    title: 'Create your Sonke account.',
    description: 'Save opportunities, compare earning paths, and keep a practical weekly plan close.',
    action: 'Create account',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Sign in',
    navSwitchLabel: 'Sign in',
    switchHref: '/sign-in',
    success: 'Account created. Check your email if confirmation is required.',
  },
} satisfies Record<AuthMode, {
  eyebrow: string
  title: string
  description: string
  action: string
  switchPrompt: string
  switchLabel: string
  navSwitchLabel: string
  switchHref: string
  success: string
}>

const planItems = [
  {
    label: 'Target',
    value: 'R5k/month',
  },
  {
    label: 'Focus',
    value: 'Remote work',
  },
  {
    label: 'Next step',
    value: 'Apply today',
  },
]

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isSignUp = mode === 'sign-up'
  const copy = pageCopy[mode]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitted(false)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')
    const name = String(formData.get('name') || '').trim()

    try {
      if (isSignUp) {
        await signUpWithPassword(email, password, name)
        window.setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      } else {
        await signInWithPassword(email, password)
        window.setTimeout(() => {
          window.location.href = '/'
        }, 700)
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  function handleSocialAuth(provider: 'google' | 'linkedin_oidc') {
    setError('')

    try {
      startOAuth(provider)
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Could not start social sign-in.')
    }
  }

  return (
    <main className="auth-page relative min-h-screen overflow-hidden px-4 py-6 text-foreground lg:px-8">
      <div className="hero-noise absolute inset-0 -z-10" />

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <nav className="flex items-center justify-between">
          <Link href="/" className="auth-brand-link">
            <BrandMark size="md" />
          </Link>
          <Button asChild variant="outline" className="h-11 rounded-full border-border bg-white/60 px-5">
            <Link href={copy.switchHref}>
              {copy.navSwitchLabel}
            </Link>
          </Button>
        </nav>

        <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(390px,0.76fr)] lg:items-center lg:gap-10 lg:py-10">
          <div className="auth-story dark-panel">
            <div className="auth-story-media">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=82"
                alt="Focused remote work setup"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.08),rgba(12,27,39,0.72))]" />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
              <div className="max-w-2xl text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">Sonke account</p>
                <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                  Keep your online income search organised from the first step.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/72">
                  Build a shortlist, compare realistic options, and come back to a plan that still makes sense tomorrow.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {planItems.map((item) => (
                  <div key={item.label} className="auth-metric">
                    <p>{item.label}</p>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                {trustItems.map((item) => (
                  <div key={item} className="auth-trust-row">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[31rem]">
            <div className="auth-card soft-panel p-5 sm:p-7">
              <div className="mb-7">
                <div className="mb-6 flex items-center">
                  <Link href="/" className="auth-card-logo" aria-label="Sonke home">
                    <BrandMark size="md" />
                  </Link>
                </div>
                <p className="section-label inline-flex px-4 py-2">
                  {copy.eyebrow}
                </p>
                <h2 className="mt-5 font-display text-4xl font-semibold leading-tight">
                  {copy.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {copy.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="auth-social-button"
                  disabled={loading}
                  onClick={() => handleSocialAuth('google')}
                >
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="auth-social-button"
                  disabled={loading}
                  onClick={() => handleSocialAuth('linkedin_oidc')}
                >
                  LinkedIn
                </Button>
              </div>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border/80" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border/80" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp ? (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="name" name="name" autoComplete="name" placeholder="Your name" className="auth-input pl-11" required />
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="auth-input pl-11" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password">Password</Label>
                    {!isSignUp ? (
                      <Link href="#" className="text-sm font-medium text-primary hover:text-primary/75">
                        Forgot password?
                      </Link>
                    ) : null}
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                      className="auth-input pl-11 pr-12"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isSignUp ? (
                  <div className="flex items-start gap-3 rounded-[1rem] bg-secondary/55 p-4">
                    <Checkbox id="terms" required className="mt-0.5" />
                    <Label htmlFor="terms" className="block text-sm leading-6 text-muted-foreground">
                      I agree to receive useful Sonke planning updates and understand I can unsubscribe anytime.
                    </Label>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-muted-foreground">Keep me signed in</Label>
                  </div>
                )}

                <Button type="submit" className="hero-button h-12 w-full text-base" disabled={loading || !supabaseConfigured}>
                  {loading ? 'Working...' : copy.action}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                {!supabaseConfigured ? (
                  <div className="rounded-[1rem] border border-destructive/20 bg-destructive/10 p-4 text-sm leading-6 text-destructive">
                    Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-[1rem] border border-destructive/20 bg-destructive/10 p-4 text-sm leading-6 text-destructive">
                    {error}
                  </div>
                ) : null}

                {submitted ? (
                  <div className="rounded-[1rem] border border-primary/20 bg-primary/10 p-4 text-sm leading-6 text-primary">
                    {copy.success}
                  </div>
                ) : null}
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {copy.switchPrompt}{' '}
                <Link href={copy.switchHref} className="font-semibold text-primary hover:text-primary/75">
                  {copy.switchLabel}
                </Link>
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Designed for practical remote income planning.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
