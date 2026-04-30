import type { Metadata } from 'next'

import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Sign in - Sonke',
  description: 'Sign in to your Sonke account to return to saved jobs, earning paths, and planning tools.',
}

export default function SignInPage() {
  return <AuthForm mode="sign-in" />
}
