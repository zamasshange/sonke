'use client'

import { Building2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const companyDomains: Record<string, string> = {
  OfferZen: 'offerzen.com',
}

function getInitials(name: string) {
  const words = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (words.length === 0) return 'CO'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()

  return words.map((word) => word[0]?.toUpperCase() ?? '').join('')
}

function getBrandTone(name: string) {
  const palette = [
    'from-orange-500 via-amber-400 to-yellow-300',
    'from-rose-500 via-orange-400 to-amber-300',
    'from-cyan-500 via-sky-400 to-indigo-300',
    'from-emerald-500 via-lime-400 to-yellow-300',
  ]

  const hash = Array.from(name).reduce((total, char) => total + char.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

function getLogoUrl(name: string) {
  const domain = companyDomains[name]
  const identifier = domain ?? name.trim().toLowerCase().replace(/\s+/g, '')
  if (!identifier) return null
  return `https://img.logo.dev/${encodeURIComponent(identifier)}?size=128&format=png&retina=true&fallback=404`
}

export function CompanyMark({
  company,
  className,
  labelClassName,
  size = 'md',
}: {
  company: string
  className?: string
  labelClassName?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const initials = getInitials(company)
  const logoUrl = useMemo(() => getLogoUrl(company), [company])
  const tone = getBrandTone(company)

  const sizeClasses = {
    sm: {
      shell: 'h-10 min-w-0 gap-2 rounded-full px-2.5',
      avatar: 'size-8',
      text: 'text-sm',
      fallback: 'text-[11px]',
    },
    md: {
      shell: 'h-12 min-w-0 gap-3 rounded-full px-3',
      avatar: 'size-9',
      text: 'text-sm',
      fallback: 'text-xs',
    },
    lg: {
      shell: 'h-14 min-w-0 gap-3 rounded-full px-3.5',
      avatar: 'size-10',
      text: 'text-base',
      fallback: 'text-sm',
    },
  }[size]

  return (
    <div
      className={cn(
        'inline-flex items-center border border-border/70 bg-white/76 text-foreground shadow-[0_14px_30px_rgba(83,48,26,0.08)] backdrop-blur-xl',
        sizeClasses.shell,
        className,
      )}
    >
      <Avatar className={cn('ring-1 ring-border/60', sizeClasses.avatar)}>
        {logoUrl && !imageFailed ? (
          <AvatarImage
            src={logoUrl}
            alt={`${company} logo`}
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : null}
        <AvatarFallback
          className={cn(
            'bg-gradient-to-br text-white',
            tone,
            sizeClasses.fallback,
          )}
        >
          {imageFailed ? initials : <Building2 className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <span className={cn('truncate font-medium', sizeClasses.text, labelClassName)}>{company}</span>
    </div>
  )
}
