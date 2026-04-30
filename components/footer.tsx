'use client'

import Link from 'next/link'
import { ArrowRight, Instagram, Linkedin, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { BrandMark } from '@/components/brand-mark'

const footerGroups = {
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Paths', href: '/paths' },
    { name: 'Calculator', href: '/calculator' },
    { name: 'Guides', href: '/guides' },
  ],
  support: [
    { name: 'Payment Methods', href: '/guides' },
    { name: 'Beginner Paths', href: '/guides' },
    { name: 'Remote Setup', href: '/guides' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-secondary/70 px-4 pb-10 pt-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="dark-panel overflow-hidden rounded-[2.2rem] px-6 py-10 sm:px-10 lg:px-12 lg:py-12"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/55">Ready when you are</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Find a path, check the numbers, and take the next step.
              </h2>
            </div>
            <Button asChild className="hero-button h-12 px-6 text-sm">
              <Link href="/jobs">
                Browse Opportunities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <div className="flex items-center">
              <BrandMark size="lg" />
            </div>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              A curated platform for South Africans exploring remote jobs, side income ideas, payment options, and clearer next steps.
            </p>
            <div className="mt-6 flex items-center gap-3 text-muted-foreground">
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-background">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-background">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-background">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Navigation</p>
            <div className="mt-5 flex flex-col gap-3">
              {footerGroups.navigation.map((item) => (
                <Link key={item.name} href={item.href} className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Focus areas</p>
            <div className="mt-5 flex flex-col gap-3">
              {footerGroups.support.map((item) => (
                <Link key={item.name} href={item.href} className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/70 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Sonke</p>
          <p>Built for practical remote income planning in South Africa.</p>
        </div>
      </div>
    </footer>
  )
}
