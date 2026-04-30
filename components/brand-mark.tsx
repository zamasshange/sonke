'use client'

import { useState } from 'react'

const logoSrc = '/logos/logo.png'

export function BrandMark({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const [hasLogoError, setHasLogoError] = useState(false)
  const sizeClass = size === 'lg' ? 'h-24 w-auto' : 'h-20 w-auto'

  return (
    <div className={`flex ${sizeClass} shrink-0 items-center justify-center text-base font-semibold text-foreground`}>
      {hasLogoError ? (
        'S'
      ) : (
        <img
          src={logoSrc}
          alt="Sonke logo"
          className="h-full w-auto object-contain"
          onError={() => setHasLogoError(true)}
        />
      )}
    </div>
  )
}
