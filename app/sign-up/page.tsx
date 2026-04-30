import type { Metadata } from 'next'

import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Create account - Sonke',
  description: 'Create a Sonke account to save opportunities, compare online income paths, and plan your next steps.',
}

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />
}
