'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Radar,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion'
import { CompanyMark } from '@/components/company-mark'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import type { Job } from '@/lib/data'

type JobsResponse = {
  jobs?: Job[]
  count?: number
  totalPages?: number
  source?: string
  notice?: string
  error?: string
}

const jobsPerPage = 6
const JOB_CACHE_KEY = 'sonke-jobs-cache'

function getJobTone(index: number) {
  const tones = [
    'from-primary/18 via-primary/6 to-transparent',
    'from-amber-400/18 via-orange-300/8 to-transparent',
    'from-sky-500/16 via-cyan-400/8 to-transparent',
    'from-emerald-500/16 via-lime-400/8 to-transparent',
  ]

  return tones[index % tones.length]
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

function toSentenceCase(tag: string) {
  return tag.replace(/\b\w/g, (char) => char.toUpperCase())
}

function descriptionPreview(job: Job) {
  if (!job.description) return 'Open the role brief for the fuller picture, application route, and quick-fit signals.'
  const cleaned = job.description.replace(/\s+/g, ' ').trim()
  return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned
}

function cacheJobs(jobs: Job[]) {
  if (typeof window === 'undefined') return

  try {
    const existingRaw = window.localStorage.getItem(JOB_CACHE_KEY)
    const existing = existingRaw ? (JSON.parse(existingRaw) as Record<string, Job>) : {}
    const next = { ...existing }

    jobs.forEach((job) => {
      next[job.id] = job
    })

    window.localStorage.setItem(JOB_CACHE_KEY, JSON.stringify(next))
  } catch {
    // Ignore cache write issues and keep browsing live data.
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [beginnerOnly, setBeginnerOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [page, setPage] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [source, setSource] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('query', searchQuery)
    if (remoteOnly) params.set('remote', 'true')
    if (beginnerOnly) params.set('beginner', 'true')
    params.set('page', String(page))
    params.set('pageSize', String(jobsPerPage))

    setIsLoading(true)
    setErrorMessage('')

    fetch(`/api/jobs?${params.toString()}`)
      .then(async (response) => {
        const data = (await response.json()) as JobsResponse
        if (!response.ok) {
          throw new Error(data.error || data.notice || 'Failed to load jobs')
        }

        return data
      })
      .then((data) => {
        setJobs(data.jobs || [])
        setNotice(data.notice || '')
        setTotalJobs(data.count || 0)
        setTotalPages(data.totalPages || 1)
        setSource(data.source || '')
        cacheJobs(data.jobs || [])
      })
      .catch((error) => {
        setJobs([])
        setTotalJobs(0)
        setTotalPages(0)
        setSource('error')
        setNotice('Live Adzuna jobs are currently unavailable.')
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load jobs')
      })
      .finally(() => setIsLoading(false))
  }, [beginnerOnly, page, remoteOnly, searchQuery])

  useEffect(() => {
    setPage(1)
  }, [beginnerOnly, remoteOnly, searchQuery])

  const activeFilterCount = useMemo(() => {
    return [remoteOnly, beginnerOnly, Boolean(searchQuery)].filter(Boolean).length
  }, [beginnerOnly, remoteOnly, searchQuery])

  const heroStats = useMemo(
    () => [
      { label: 'Live market volume', value: totalJobs ? `${Math.round(totalJobs / 1000)}k+` : '--', icon: TrendingUp },
      { label: 'Shown per page', value: String(jobsPerPage), icon: Radar },
      { label: 'Current source', value: source || 'waiting', icon: Sparkles },
    ],
    [source, totalJobs],
  )

  const highlightTags = useMemo(() => {
    const counts = new Map<string, number>()
    jobs.forEach((job) => {
      job.tags.slice(0, 4).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      })
    })

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([tag]) => tag)
  }, [jobs])

  return (
    <div className="jobs-page flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        <section className="px-4 py-12 sm:py-14 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="jobs-hero hero-shell hero-noise relative overflow-hidden rounded-[1.35rem] px-5 py-7 sm:rounded-[2rem] sm:px-8 lg:px-10">
                <div className="jobs-hero-glow" />
                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_320px] lg:items-end">
                  <div>
                    <Badge className="eyebrow-chip mb-5 gap-2 rounded-full border-0 px-4 py-2 text-primary">
                      <Sparkles className="h-4 w-4" />
                      Live South Africa opportunity board
                    </Badge>
                    <h1 className="max-w-3xl text-[2.65rem] font-semibold leading-[1.03] tracking-tight sm:text-6xl sm:leading-tight lg:text-7xl">
                      Find work that feels <span className="gradient-text">worth opening</span>
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-xl sm:leading-8">
                      Live Adzuna roles, clearer fit signals, and a job brief that actually helps you decide whether to
                      apply.
                    </p>
                    {notice ? (
                      <p className={`mt-4 text-sm ${source === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {notice}
                      </p>
                    ) : null}
                    {errorMessage ? <p className="mt-2 text-sm text-destructive">{errorMessage}</p> : null}
                    <div className="mt-7 flex flex-wrap gap-3">
                      {highlightTags.length > 0 ? (
                        highlightTags.map((tag) => (
                          <Badge key={tag} className="jobs-chip border-0 px-4 py-2 text-sm">
                            {toSentenceCase(tag)}
                          </Badge>
                        ))
                      ) : (
                        <Badge className="jobs-chip border-0 px-4 py-2 text-sm">Live market scan</Badge>
                      )}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="jobs-hero-panel"
                  >
                    <div className="jobs-hero-panel-header">
                      <span className="section-label px-3 py-1">Market pulse</span>
                      <span className="text-sm text-muted-foreground">Page {page}</span>
                    </div>
                    <div className="mt-5 space-y-4">
                      {heroStats.map(({ label, value, icon: Icon }) => (
                        <div key={label} className="jobs-stat-row">
                          <div className="jobs-stat-icon">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                            <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="sticky top-[72px] z-40 border-y border-border/70 bg-background/80 px-4 py-4 backdrop-blur-2xl lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="jobs-toolbar section-shell rounded-[1.5rem] px-4 py-4 lg:px-5">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search titles, companies, tech stacks, or signals..."
                  className="h-12 rounded-full border-0 bg-white/80 pl-11 shadow-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="jobs-filter-pill">
                  <Checkbox checked={remoteOnly} onCheckedChange={(checked) => setRemoteOnly(Boolean(checked))} />
                  <span>Remote only</span>
                </label>
                <label className="jobs-filter-pill">
                  <Checkbox checked={beginnerOnly} onCheckedChange={(checked) => setBeginnerOnly(Boolean(checked))} />
                  <span>Beginner friendly</span>
                </label>
                <Badge variant="secondary" className="rounded-full px-3 py-2">
                  {activeFilterCount} active
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            {isLoading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: jobsPerPage }).map((_, index) => (
                  <div key={index} className="jobs-skeleton-card animate-pulse rounded-[1.75rem]" />
                ))}
              </div>
            ) : source === 'error' ? (
              <div className="section-shell rounded-[2rem] px-6 py-16 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-destructive" />
                <h2 className="mt-4 text-2xl font-semibold">Live jobs failed to load</h2>
                <p className="mt-3 text-muted-foreground">
                  The Adzuna request did not succeed, so this page is not showing live results yet.
                </p>
                {errorMessage ? <p className="mt-3 text-sm text-destructive">{errorMessage}</p> : null}
              </div>
            ) : jobs.length === 0 ? (
              <div className="section-shell rounded-[2rem] px-6 py-16 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-semibold">No jobs found</h2>
                <p className="mt-3 text-muted-foreground">Try a broader search or remove one of the filters.</p>
              </div>
            ) : (
              <>
                <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Current window</p>
                    <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">A more curated feeling job stream</h2>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="rounded-full px-4 py-2">
                      {totalJobs.toLocaleString()} jobs found
                    </Badge>
                    <Badge variant="secondary" className="rounded-full px-4 py-2">
                      Page {page} of {totalPages.toLocaleString()}
                    </Badge>
                  </div>
                </div>

                <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {jobs.map((job, index) => (
                    <StaggerItem key={job.id}>
                      <motion.div
                        whileHover={{ y: -6, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                      >
                        <Link href={`/jobs/${job.id}`} className="block" onClick={() => cacheJobs([job])}>
                          <Card className="jobs-card group relative h-full overflow-hidden rounded-[1.75rem] border-0 p-0">
                            <div className={`jobs-card-aura bg-gradient-to-br ${getJobTone(index)}`} />
                            <div className="relative flex h-full flex-col p-5 sm:p-6">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <Badge className="jobs-chip mb-4 border-0 px-3 py-1.5 text-xs">
                                    {getJobSignal(job)}
                                  </Badge>
                                  <h3 className="max-w-[18ch] text-xl font-semibold leading-tight text-foreground transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                                    {job.title}
                                  </h3>
                                </div>
                                <div className="jobs-card-arrow">
                                  <ArrowRight className="h-4 w-4" />
                                </div>
                              </div>

                              <div className="mt-5 flex flex-wrap items-center gap-3">
                                <CompanyMark company={job.company} size="sm" />
                                <div className="inline-flex min-w-0 items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 shrink-0" />
                                  <span className="truncate">{job.location}</span>
                                </div>
                              </div>

                              <p className="mt-5 min-h-[72px] text-sm leading-6 text-muted-foreground">
                                {descriptionPreview(job)}
                              </p>

                              <div className="mt-5 flex flex-wrap gap-2">
                                {job.tags.slice(0, 4).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="rounded-full border-0 bg-white/70 px-3 py-1.5 text-xs"
                                  >
                                    {toSentenceCase(tag)}
                                  </Badge>
                                ))}
                              </div>

                              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <div className="jobs-metric-panel">
                                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Compensation</p>
                                  <p className="mt-2 text-sm font-semibold text-foreground">{job.salary || 'Not listed'}</p>
                                </div>
                                <div className="jobs-metric-panel">
                                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Signal</p>
                                  <p className="mt-2 text-sm font-semibold text-foreground">{getEnergyLabel(job)}</p>
                                </div>
                              </div>

                              <div className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm font-medium text-foreground">Open role brief</span>
                                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Full page</span>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col gap-4 rounded-[1.5rem] border border-border/70 bg-white/55 px-5 py-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Keep browsing the live feed</p>
                      <p className="text-sm text-muted-foreground">Each page brings another six roles from the current search.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        className="rounded-full px-4"
                        disabled={page === 1}
                        onClick={() => setPage((value) => Math.max(1, value - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="min-w-[110px] text-center text-sm font-medium">
                        {page} / {totalPages.toLocaleString()}
                      </div>
                      <Button
                        variant="default"
                        className="rounded-full px-4 shadow-[0_14px_28px_rgba(217,98,31,0.18)]"
                        disabled={page === totalPages}
                        onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
