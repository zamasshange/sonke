'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { ArrowLeft, Briefcase, ExternalLink, MapPin, Sparkles, Timer, TrendingUp } from 'lucide-react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { CompanyMark } from '@/components/company-mark'
import { FadeIn } from '@/components/motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { Job } from '@/lib/data'

const JOB_CACHE_KEY = 'sonke-jobs-cache'

function toSentenceCase(tag: string) {
  return tag.replace(/\b\w/g, (char) => char.toUpperCase())
}

function getJobSignal(job: Job) {
  const title = `${job.title} ${job.description ?? ''}`.toLowerCase()

  if (job.isRemote) return 'Remote-ready'
  if (title.includes('junior') || title.includes('entry')) return 'Early-career'
  if (title.includes('senior')) return 'High-growth'
  return 'Fresh listing'
}

function getEnergyLabel(job: Job) {
  if (job.tags.some((tag) => tag.toLowerCase().includes('beginner'))) return 'Best first step'
  if (job.isRemote) return 'Flexible setup'
  if (job.salary) return 'Clear pay signal'
  return 'Worth a look'
}

function getRequirements(job: Job) {
  return job.requirements?.filter(Boolean).slice(0, 6) ?? []
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)

  useEffect(() => {
    if (!params?.id) return

    try {
      const raw = window.localStorage.getItem(JOB_CACHE_KEY)
      if (!raw) return

      const cache = JSON.parse(raw) as Record<string, Job>
      setJob(cache[params.id] ?? null)
    } catch {
      setJob(null)
    }
  }, [params?.id])

  const stats = useMemo(() => {
    if (!job) return []

    return [
      { label: 'Compensation', value: job.salary || 'Not listed' },
      { label: 'Work style', value: job.isRemote ? 'Remote leaning' : 'Location-based' },
      { label: 'Quick read', value: getEnergyLabel(job) },
    ]
  }, [job])

  const requirements = useMemo(() => (job ? getRequirements(job) : []), [job])

  return (
    <div className="jobs-page flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        <section className="px-4 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Button variant="secondary" className="rounded-full px-4" asChild>
                  <Link href="/jobs">
                    <ArrowLeft className="h-4 w-4" />
                    Back to jobs
                  </Link>
                </Button>
                <Badge className="jobs-chip border-0 px-4 py-2 text-sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Full role brief
                </Badge>
              </div>
            </FadeIn>

            {!job ? (
              <Card className="section-shell rounded-[2rem] border-0 px-6 py-16 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
                <h1 className="mt-4 text-3xl font-semibold">This job brief is not in local cache yet</h1>
                <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                  Open this role from the jobs listing first so the live details can be saved and expanded on a dedicated page.
                </p>
                <div className="mt-6">
                  <Button asChild className="rounded-full px-5">
                    <Link href="/jobs">Return to job listings</Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:items-start">
                <section className="space-y-6">
                  <FadeIn>
                    <div className="jobs-hero hero-shell hero-noise relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8">
                      <div className="jobs-hero-glow" />
                      <div className="relative">
                        <Badge className="jobs-chip mb-4 border-0 px-3 py-1.5 text-xs">{getJobSignal(job)}</Badge>
                        <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                          {job.title}
                        </h1>
                        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                          <CompanyMark company={job.company} size="lg" />
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            {job.location}
                          </span>
                        </div>
                        <div className="mt-7 grid gap-4 sm:grid-cols-3">
                          {stats.map((stat) => (
                            <div key={stat.label} className="jobs-dialog-stat">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                              <p className="mt-3 text-lg font-semibold text-foreground">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FadeIn>

                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="grid gap-6"
                  >
                    <Card className="section-shell rounded-[1.75rem] border-0 px-6 py-6">
                      <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Role story
                      </Label>
                      <p className="mt-4 whitespace-pre-line text-base leading-8 text-foreground/84">
                        {job.description || 'No description provided for this role.'}
                      </p>
                    </Card>

                    <Card className="section-shell rounded-[1.75rem] border-0 px-6 py-6">
                      <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Requirements snapshot
                      </Label>
                      <div className="mt-4 space-y-3">
                        {requirements.length > 0 ? (
                          requirements.map((requirement, index) => (
                            <motion.div
                              key={`${requirement}-${index}`}
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.04 }}
                              className="jobs-requirement-row"
                            >
                              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                              <p className="text-sm leading-7 text-foreground/82">{requirement}</p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="rounded-[1.25rem] border border-dashed border-border/80 bg-white/55 px-4 py-4 text-sm text-muted-foreground">
                            No specific requirements were broken out for this role.
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </section>

                <aside className="lg:sticky lg:top-28">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.06 }}
                    className="space-y-5"
                  >
                    <Card className="section-shell rounded-[1.75rem] border-0 px-5 py-5">
                      <div className="jobs-side-panel">
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4 text-primary" />
                          <p className="text-sm font-semibold text-foreground">Best next move</p>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          Open the source listing, compare the brief with your current proof, then apply while the role still feels warm.
                        </p>
                      </div>

                      <div className="mt-5">
                        <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Fit signals
                        </Label>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <Badge key={tag} className="jobs-chip border-0 px-3 py-2 text-xs">
                              {toSentenceCase(tag)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>

                    <Card className="section-shell rounded-[1.75rem] border-0 px-5 py-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Application action
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Use the live source listing for the freshest details, application workflow, and any updates since this page was opened.
                      </p>
                      <div className="mt-5 grid gap-3">
                        {job.applyUrl ? (
                          <Button className="h-12 rounded-full shadow-[0_16px_34px_rgba(217,98,31,0.18)]" asChild>
                            <a href={job.applyUrl} target="_blank" rel="noreferrer">
                              Apply on Adzuna
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <Button className="h-12 rounded-full" disabled>
                            Apply link unavailable
                          </Button>
                        )}
                        <Button variant="secondary" className="h-11 rounded-full" asChild>
                          <Link href="/jobs">Keep browsing jobs</Link>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
