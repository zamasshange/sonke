import Link from 'next/link'
import { ArrowRight, CheckCircle2, Compass } from 'lucide-react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { paths } from '@/lib/data'

export const metadata = {
  title: 'Paths | Sonke',
  description: 'Step-by-step online earning journeys for South Africans.',
}

export default function PathsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        <section className="px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="hero-shell max-w-5xl rounded-[2rem] px-6 py-10 sm:px-8 lg:px-12">
                <Badge className="eyebrow-chip mb-6 gap-2 rounded-full border-0 px-4 py-2 text-primary">
                  <Compass className="h-4 w-4" />
                  Step-by-step journeys
                </Badge>
                <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                  Choose a <span className="gradient-text">path</span>
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
                  Paths connect guides, tools, and jobs into ordered journeys so you know what to do first, second, and next.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="px-4 pb-20 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <StaggerContainer className="grid gap-8 lg:grid-cols-2">
              {paths.map((path) => (
                <StaggerItem key={path.title}>
                  <Card className="section-shell h-full border-border/60 bg-card/80">
                    <CardHeader>
                      <CardTitle className="text-3xl">{path.title}</CardTitle>
                      <CardDescription className="text-base leading-7">{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-4">
                        {path.steps.map((step, index) => (
                          <li key={step.title} className="flex gap-4 rounded-xl border border-border/60 bg-background/70 p-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                              {index + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <p className="font-semibold">{step.title}</p>
                              </div>
                              <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.description}</p>
                              {step.link ? (
                                <Button asChild variant="ghost" size="sm" className="mt-3 px-0 text-primary hover:bg-transparent">
                                  <Link href={step.link}>
                                    Open step
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </Button>
                              ) : null}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
