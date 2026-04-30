import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Manrope, Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const bodySans = Manrope({ 
  subsets: ["latin"],
  variable: "--font-body-sans"
});

const displaySans = Sora({ 
  subsets: ["latin"],
  variable: "--font-display-sans"
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  title: 'Sonke - Make Money Online in South Africa',
  description: 'Discover real side hustles, remote jobs, and tools that actually work in South Africa. Calculate your potential income and find opportunities.',
  keywords: ['make money online', 'South Africa', 'remote jobs', 'side hustle', 'freelancing', 'income calculator'],
  icons: {
    icon: '/logos/favicon.png',
    shortcut: '/logos/favicon.png',
    apple: '/logos/favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#c2410c',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className={`${bodySans.variable} ${displaySans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
