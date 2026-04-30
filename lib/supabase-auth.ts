type SupabaseSession = {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  user?: unknown
}

type SupabaseError = {
  error?: string
  error_description?: string
  msg?: string
  message?: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabaseOAuthCallbackUrl =
  'https://jyldnscklerwqhekuvwk.supabase.co/auth/v1/callback'

function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.')
  }

  return {
    anonKey: supabaseAnonKey,
    url: supabaseUrl.replace(/\/$/, ''),
  }
}

async function readAuthResponse(response: Response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = payload as SupabaseError
    throw new Error(
      error.error_description ||
        error.message ||
        error.msg ||
        error.error ||
        'Supabase could not complete the auth request.',
    )
  }

  return payload
}

export function persistSupabaseSession(session: SupabaseSession) {
  if (typeof window === 'undefined' || !session.access_token) return

  window.localStorage.setItem('sonke.supabase.session', JSON.stringify(session))
}

export function getSupabaseSession(): SupabaseSession | null {
  if (typeof window === 'undefined') return null

  const stored = window.localStorage.getItem('sonke.supabase.session')
  if (!stored) return null

  try {
    return JSON.parse(stored) as SupabaseSession
  } catch {
    return null
  }
}

export function clearSupabaseSession() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem('sonke.supabase.session')
}

export async function signInWithPassword(email: string, password: string) {
  const config = getSupabaseConfig()
  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const session = (await readAuthResponse(response)) as SupabaseSession
  persistSupabaseSession(session)
  return session
}

export async function signUpWithPassword(email: string, password: string, name: string) {
  const config = getSupabaseConfig()
  const response = await fetch(`${config.url}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        full_name: name,
      },
    }),
  })

  const session = (await readAuthResponse(response)) as SupabaseSession
  if (session.access_token) persistSupabaseSession(session)
  return session
}

export function startOAuth(provider: 'google' | 'linkedin_oidc') {
  const config = getSupabaseConfig()
  const redirectTo = new URL('/auth/callback', window.location.origin).toString()
  const authorizeUrl = new URL(`${config.url}/auth/v1/authorize`)

  authorizeUrl.searchParams.set('provider', provider)
  authorizeUrl.searchParams.set('redirect_to', redirectTo)

  window.location.href = authorizeUrl.toString()
}
