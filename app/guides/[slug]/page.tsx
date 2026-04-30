import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Briefcase, CheckCircle2, CreditCard, Sparkles, TriangleAlert } from 'lucide-react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatZar, getGuideBySlug, getRelatedJobsForGuide, guides } from '@/lib/data'

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }))
}

type GuidePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) return {}

  return {
    title: `${guide.title} | Sonke`,
    description: guide.overview,
  }
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  const relatedJobs = getRelatedJobsForGuide(guide)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        <section className="px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="hero-shell rounded-[2rem] px-6 py-10 sm:px-8 lg:px-12">
              <Badge className="eyebrow-chip border-0 px-4 py-2">{guide.difficulty}</Badge>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
                {guide.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                {guide.overview}
              </p>
            </div>

            <Card className="section-shell border-border/60">
              <CardHeader>
                <CardTitle>Reality Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Earnings</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">
                    {formatZar(guide.earnings.min)} - {formatZar(guide.earnings.max)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Time to first earning</p>
                  <p className="mt-1 font-semibold">{guide.timeToFirstEarning}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Difficulty</p>
                  <p className="mt-1 font-semibold">{guide.difficulty}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="px-4 pb-10 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <Card className="section-shell border-border/60">
                <CardHeader>
                  <CardTitle>Step-by-step checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {guide.steps.map((step, index) => (
                      <li key={step} className="flex gap-4 rounded-xl border border-border/60 bg-background/70 p-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {index + 1}
                        </span>
                        <span className="leading-7">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card className="section-shell border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TriangleAlert className="h-5 w-5 text-primary" />
                    Mistakes to avoid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {guide.mistakes.map((mistake) => (
                      <li key={mistake} className="flex gap-3 text-muted-foreground">
                        <TriangleAlert className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-6">
              <Card className="section-shell border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {guide.paymentMethods.map((method) => (
                    <Badge key={method} variant="secondary">{method}</Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="dark-panel border-0 text-white">
                <CardHeader>
                  <CardTitle>Next action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/jobs?remote=true&beginner=true">
                      Find related jobs
                      <Briefcase className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="hero-button w-full">
                    <Link href="/guides#coach">
                      Ask AI about this
                      <Sparkles className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {relatedJobs.length > 0 ? (
                <Card className="section-shell border-border/60">
                  <CardHeader>
                    <CardTitle>Related jobs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedJobs.map((job) => (
                      <div key={job.id} className="rounded-xl border border-border/60 bg-background/70 p-4">
                        <p className="font-semibold">{job.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {job.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button asChild variant="ghost" className="w-full">
                      <Link href="/jobs">
                        View jobs
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
