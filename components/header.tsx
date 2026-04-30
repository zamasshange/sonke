'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { BrandMark } from '@/components/brand-mark'
import { useAuthSession } from '@/hooks/use-auth-session'
import { clearSupabaseSession } from '@/lib/supabase-auth'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Paths', href: '/paths' },
  { name: 'Calculator', href: '/calculator' },
  { name: 'Guides', href: '/guides' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, isLoading, fullName, email } = useAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = () => {
    clearSupabaseSession()
    setMobileMenuOpen(false)
    window.location.href = '/'
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 py-4 lg:px-8"
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 lg:px-6 ${
          scrolled
            ? 'border-border/80 bg-background/92 shadow-[0_20px_50px_rgba(32,27,21,0.08)] backdrop-blur-xl'
            : 'border-border/60 bg-background/78 backdrop-blur-lg'
        }`}
      >
        <Link href="/" className="flex items-center">
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">{fullName}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-full px-4 text-sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="h-11 rounded-full px-4 text-sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild className="hero-button h-11 px-5 text-sm">
                <Link href="/sign-up">Start Planning</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/25 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-4 top-4 rounded-[1.75rem] border border-border bg-background p-5 shadow-[0_20px_50px_rgba(32,27,21,0.14)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-semibold">Navigation</p>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="rounded-[1rem] px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-6 grid gap-3">
                {isAuthenticated ? (
                  <>
                    <div className="rounded-[1rem] bg-secondary/55 p-4">
                      <p className="text-sm font-medium text-foreground">{fullName}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 w-full rounded-full border-border bg-transparent text-sm"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="h-12 w-full rounded-full border-border bg-transparent text-sm">
                      <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild className="hero-button h-12 w-full text-sm">
                      <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                        Start Planning
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
