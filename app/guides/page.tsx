'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

import { AiMoneyCoach } from '@/components/ai-money-coach'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { FadeIn, FadeInView, StaggerContainer, StaggerItem } from '@/components/motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatZar, guides } from '@/lib/data'

const filters = ['All', 'Easy', 'Medium', 'Hard']

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [difficulty, setDifficulty] = useState('All')

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesSearch = [guide.title, guide.overview, ...guide.paymentMethods]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesDifficulty = difficulty === 'All' || guide.difficulty === difficulty

      return matchesSearch && matchesDifficulty
    })
  }, [difficulty, searchQuery])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="hero-shell max-w-5xl rounded-[2rem] px-6 py-10 sm:px-8 lg:px-12">
                <Badge className="eyebrow-chip mb-6 gap-2 rounded-full border-0 px-4 py-2 text-primary">
                  <BookOpen className="h-4 w-4" />
                  {guides.length} structured guides
                </Badge>
                <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                  Real <span className="gradient-text">money guides</span>
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
                  Practical South African guides with realistic earnings, payout methods, mistakes to avoid, and step-by-step action plans.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="coach" className="px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <AiMoneyCoach />
          </div>
        </section>

        <section className="sticky top-[72px] z-40 border-y border-border bg-background/85 px-4 py-5 shadow-sm backdrop-blur-2xl lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="section-shell flex flex-col gap-4 rounded-[1.5rem] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search Fiverr, Upwork, payments..."
                  className="h-11 bg-secondary/50 pl-11"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <Button
                    key={filter}
                    variant={difficulty === filter ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setDifficulty(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FadeInView>
              <p className="mb-8 text-sm text-muted-foreground">
                Showing {filteredGuides.length} of {guides.length} guides
              </p>
            </FadeInView>
            <StaggerContainer className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredGuides.map((guide) => (
                <StaggerItem key={guide.slug}>
                  <Card className="section-shell flex h-full flex-col border-border/50 bg-card/80">
                    <CardHeader className="flex-1">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <Badge>{guide.difficulty}</Badge>
                        <Badge variant="secondary">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          {guide.timeToFirstEarning}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl">{guide.title}</CardTitle>
                      <CardDescription className="mt-3 text-base leading-7">
                        {guide.overview}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="rounded-xl bg-primary/10 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Expected monthly range</p>
                        <p className="mt-2 text-xl font-semibold text-primary">
                          {formatZar(guide.earnings.min)} - {formatZar(guide.earnings.max)}
                        </p>
                      </div>
                      <Button asChild className="w-full">
                        <Link href={`/guides/${guide.slug}`}>
                          Read Guide
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {filteredGuides.length === 0 ? (
              <div className="py-20 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">No matching guides</h2>
                <p className="mt-2 text-muted-foreground">Try a different search term or difficulty filter.</p>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
