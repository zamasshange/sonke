'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Bot, Briefcase, CheckCircle2, Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type OpportunityCategory = 'fiverr' | 'upwork' | 'affiliate' | 'content'

export type OpportunityCardProps = {
  title: string
  description: string
  category: OpportunityCategory
}

type Job = {
  id: string
  title: string
  company: string
  tags: string[]
  isRemote: boolean
}

type AiRecommendation = {
  method: string
  guideSlug: string
  whyItFits: string
  expectedIncome: string
  nextSteps: string[]
}

const categoryConfig: Record<OpportunityCategory, {
  checklist: string[]
  jobTags: string[]
  guideSlug: string
  promptName: string
}> = {
  fiverr: {
    checklist: [
      'Create a Fiverr account',
      'Choose one service: design, writing, admin, or editing',
      'Create your first focused gig',
      'Share your profile with three warm contacts',
    ],
    jobTags: ['design', 'writing', 'admin'],
    guideSlug: 'fiverr-south-africa',
    promptName: 'Fiverr',
  },
  upwork: {
    checklist: [
      'Create a focused Upwork profile',
      'Prepare two simple portfolio samples',
      'Find 5 beginner-friendly jobs with verified payment',
      'Send one tailored proposal today',
    ],
    jobTags: ['freelance', 'assistant', 'editing'],
    guideSlug: 'upwork-beginners-sa',
    promptName: 'Upwork',
  },
  affiliate: {
    checklist: [
      'Choose one niche with buying intent',
      'Pick 2 affiliate programs available in South Africa',
      'Create a simple content plan',
      'Publish your first helpful post or video',
    ],
    jobTags: ['marketing', 'content'],
    guideSlug: 'affiliate-marketing-sa',
    promptName: 'affiliate marketing',
  },
  content: {
    checklist: [
      'Choose one content service to offer',
      'Create three sample posts, scripts, or edits',
      'Make a simple portfolio page',
      'Pitch 5 small businesses or creators',
    ],
    jobTags: ['writing', 'video', 'social'],
    guideSlug: 'content-services-sa',
    promptName: 'content services',
  },
}

const mockJobs: Job[] = [
  { id: 'opp-001', title: 'Canva Social Post Designer', company: 'Creator Desk', tags: ['Remote', 'Beginner Friendly', 'design'], isRemote: true },
  { id: 'opp-002', title: 'Product Description Writer', company: 'Shop Copy Studio', tags: ['Remote', 'writing', 'Beginner Friendly'], isRemote: true },
  { id: 'opp-003', title: 'Admin Gig Setup Assistant', company: 'Remote Admin Studio', tags: ['admin', 'Remote'], isRemote: true },
  { id: 'opp-004', title: 'Virtual Assistant Trial Project', company: 'OpsFlow', tags: ['assistant', 'freelance', 'Remote'], isRemote: true },
  { id: 'opp-005', title: 'Proposal Editing Assistant', company: 'ClientReady', tags: ['editing', 'freelance'], isRemote: true },
  { id: 'opp-006', title: 'Inbox Cleanup Freelancer', company: 'Support Desk Africa', tags: ['assistant', 'Beginner Friendly'], isRemote: true },
  { id: 'opp-007', title: 'Affiliate Content Researcher', company: 'DealSignal SA', tags: ['marketing', 'content', 'Remote'], isRemote: true },
  { id: 'opp-008', title: 'Comparison Article Writer', company: 'Smart Buyer Media', tags: ['content', 'writing'], isRemote: true },
  { id: 'opp-009', title: 'TikTok Product Script Assistant', company: 'Creator Commerce', tags: ['marketing', 'social'], isRemote: true },
  { id: 'opp-010', title: 'Short-Form Video Caption Writer', company: 'ClipLab', tags: ['video', 'writing', 'Remote'], isRemote: true },
  { id: 'opp-011', title: 'Social Media Scheduler', company: 'Local Brand Studio', tags: ['social', 'Beginner Friendly'], isRemote: true },
  { id: 'opp-012', title: 'YouTube Shorts Cleanup Editor', company: 'Video Sprint', tags: ['video', 'content'], isRemote: true },
  { id: 'opp-013', title: 'Blog Post Formatter', company: 'Content Crew', tags: ['writing', 'content'], isRemote: true },
  { id: 'opp-014', title: 'Freelance Profile Reviewer', company: 'Launch Lane', tags: ['freelance', 'editing'], isRemote: true },
  { id: 'opp-015', title: 'Starter Logo Gig Assistant', company: 'Micro Studio', tags: ['design', 'Beginner Friendly'], isRemote: true },
]

export function getJobsByCategory(category: string): Job[] {
  const config = categoryConfig[category as OpportunityCategory]
  if (!config) return []

  return mockJobs
    .filter((job) =>
      job.tags.some((tag) =>
        config.jobTags.some((categoryTag) => tag.toLowerCase().includes(categoryTag.toLowerCase())),
      ),
    )
    .slice(0, 5)
}

export function OpportunityCard({ title, description, category }: OpportunityCardProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})
  const [aiResponse, setAiResponse] = useState<AiRecommendation[] | null>(null)
  const [aiError, setAiError] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const config = categoryConfig[category]
  const jobs = useMemo(() => getJobsByCategory(category), [category])
  const completedCount = Object.values(checkedItems).filter(Boolean).length

  function toggleChecklistItem(index: number, checked: boolean | 'indeterminate') {
    setCheckedItems((current) => ({
      ...current,
      [index]: checked === true,
    }))
  }

  async function handleAskAi() {
    setIsAiLoading(true)
    setAiError('')

    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: config.promptName,
          timeAvailable: '2-3 hours per day',
          goal: `For a beginner in South Africa, explain how to start with ${config.promptName} this week and make first money.`,
        }),
      })
      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to ask AI right now.')
      }

      setAiResponse(data.recommendations || [])
    } catch (error: any) {
      setAiError(error?.message || 'Unable to ask AI right now.')
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="opportunity-card soft-panel group h-full p-6 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">{config.promptName}</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight">{title}</h3>
            </div>
            <span className="jobs-card-arrow">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {config.jobTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 capitalize">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5 text-sm">
            <span>{jobs.length} matching leads</span>
            <span className="font-semibold text-primary">Open hub</span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[1.5rem] border-border bg-background p-0 sm:max-w-5xl">
        <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
          <aside className="dark-panel p-6 text-white sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-display text-3xl font-semibold leading-tight text-white">
                {title} action hub
              </DialogTitle>
              <DialogDescription className="text-base leading-7 text-white/70">
                Start with the checklist, scan live-style opportunities, then ask AI for a South Africa-specific plan.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 rounded-[1.2rem] bg-white/8 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold">Quick start checklist</p>
                <Badge className="border-0 bg-white/10 text-white">
                  {completedCount}/{config.checklist.length}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3">
                {config.checklist.map((item, index) => (
                  <label key={item} className="flex cursor-pointer items-start gap-3 rounded-[0.9rem] bg-white/8 p-3 text-sm leading-6 text-white/82">
                    <Checkbox
                      checked={checkedItems[index] === true}
                      onCheckedChange={(checked) => toggleChecklistItem(index, checked)}
                      className="mt-1 border-white/35 data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button asChild className="mt-6 h-12 w-full rounded-full bg-white text-foreground hover:bg-white/90">
              <Link href={`/guides/${config.guideSlug}`}>
                View full guide
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </aside>

          <div className="space-y-6 p-6 sm:p-8">
            <section>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Live opportunities</p>
                  <h4 className="mt-2 text-2xl font-semibold">Matches to act on</h4>
                </div>
                <Briefcase className="h-5 w-5 text-primary" />
              </div>

              <div className="mt-5 grid gap-3">
                {jobs.map((job) => (
                  <article key={job.id} className="rounded-[1rem] border border-border/70 bg-white/70 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold">{job.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      <Button asChild size="sm" className="rounded-full">
                        <Link href="/jobs">Apply</Link>
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(job.isRemote ? ['Remote', ...job.tags] : job.tags).slice(0, 4).map((tag) => (
                        <Badge key={`${job.id}-${tag}`} variant="secondary" className="rounded-full px-2.5 py-1 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[1.2rem] border border-border/70 bg-secondary/45 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">AI helper</p>
                  <h4 className="mt-2 text-2xl font-semibold">Ask about this path</h4>
                </div>
                <Button onClick={handleAskAi} disabled={isAiLoading} className="hero-button h-11 rounded-full">
                  {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                  Ask AI about this
                </Button>
              </div>

              {aiError ? <p className="mt-4 text-sm text-destructive">{aiError}</p> : null}

              {aiResponse ? (
                <div className="mt-5 grid gap-3">
                  {aiResponse.slice(0, 2).map((recommendation) => (
                    <article key={recommendation.guideSlug} className="rounded-[1rem] bg-white/78 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold">{recommendation.method}</p>
                          <p className="mt-1 text-sm text-primary">{recommendation.expectedIncome}</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{recommendation.whyItFits}</p>
                      <ol className="mt-4 grid gap-2 text-sm">
                        {recommendation.nextSteps.slice(0, 3).map((step, index) => (
                          <li key={step} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {index + 1}
                            </span>
                            <span className="leading-6">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Get a short plan with steps, tips, and realistic earning expectations for this category.
                </p>
              )}
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
