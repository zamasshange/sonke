'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  Calculator,
  CheckCircle2,
  CreditCard,
  Globe,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { AiMoneyCoach } from '@/components/ai-money-coach'
import { OpportunityCard } from '@/components/opportunity-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/motion'
import { earningMethods, guides, jobs, saAvailability } from '@/lib/data'

const showcaseImages = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
]

const capabilityCards = [
  {
    title: 'Remote role scouting',
    description: 'Fresh listings, payment realities, and beginner filters without the clutter.',
    image: showcaseImages[0],
  },
  {
    title: 'Practical earning paths',
    description: 'Structured guides for freelancing, content, e-commerce, and service work.',
    image: showcaseImages[1],
  },
  {
    title: 'AI planning layer',
    description: 'A built-in coach that turns your time, skills, and constraints into a next-step plan.',
    image: showcaseImages[2],
  },
]

const heroQuickSteps = [
  'Browse live jobs',
  'Estimate realistic income',
  'Turn it into a weekly plan',
]

const tickerItems = [
  'Remote jobs',
  'AI planning',
  'Freelance paths',
  'Payment setup',
  'Earning calculator',
  'South Africa focused',
]

const opportunityCategoryByMethodId = {
  fiverr: 'fiverr',
  upwork: 'upwork',
  'affiliate-marketing': 'affiliate',
  'content-services': 'content',
} as const

export default function HomePage() {
  const latestJobs = jobs.slice(0, 3)
  const featuredGuides = guides.slice(0, 3)
  const paymentMethods = Array.from(new Set(guides.flatMap((guide) => guide.paymentMethods)))
  const beginnerFriendlyJobs = jobs.filter((job) =>
    job.tags.some((tag) => ['Beginner Friendly', 'No Experience'].includes(tag))
  ).length
  const supportSignals = Object.entries(saAvailability).slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 pt-24">
        <section className="relative overflow-hidden px-4 pb-20 pt-6 lg:px-8 lg:pb-28">
          <div className="hero-noise absolute inset-0 -z-10" />
          <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.16),transparent_60%)]" />

          <div className="mx-auto max-w-7xl">
            <div className="homepage-hero agency-grid overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_440px] lg:items-stretch">
                <div className="flex flex-col justify-between gap-10">
                  <FadeInView>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="section-label border-0 px-4 py-2">
                        South African remote income tools
                      </Badge>
                      <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground">
                        Clearer paths. Fewer dead ends.
                      </span>
                    </div>
                  </FadeInView>

                  <FadeInView delay={0.08}>
                    <div className="max-w-3xl space-y-6">
                      <h1 className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-[4.8rem]">
                        Build a cleaner path into remote work.
                      </h1>
                      <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                        Find realistic jobs, compare online earning paths, estimate income, and get practical guidance for working from South Africa without the usual clutter.
                      </p>
                    </div>
                  </FadeInView>

                  <FadeInView delay={0.14}>
                    <div className="hero-actions-wrap flex flex-col gap-5">
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <Button asChild size="lg" className="hero-button h-14 px-7 text-base">
                          <Link href="/jobs">
                            Explore Jobs
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="h-14 rounded-full border-border bg-transparent px-7 text-base text-foreground hover:bg-foreground hover:text-background"
                        >
                          <Link href="/calculator">
                            <Play className="h-4 w-4" />
                            Try Calculator
                          </Link>
                        </Button>
                      </div>
                      <div className="hero-step-strip">
                        {heroQuickSteps.map((step, index) => (
                          <div key={step} className="hero-step-pill">
                            <span className="hero-step-index">0{index + 1}</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeInView>

                  <FadeInView delay={0.2}>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="soft-panel p-5">
                        <p className="text-4xl font-semibold">{jobs.length}</p>
                        <p className="mt-2 text-sm uppercase tracking-[0.24em] text-muted-foreground">Live opportunities</p>
                      </div>
                      <div className="soft-panel p-5">
                        <p className="text-4xl font-semibold">{guides.length}</p>
                        <p className="mt-2 text-sm uppercase tracking-[0.24em] text-muted-foreground">Detailed guides</p>
                      </div>
                      <div className="soft-panel p-5">
                        <p className="text-4xl font-semibold">{paymentMethods.length}</p>
                        <p className="mt-2 text-sm uppercase tracking-[0.24em] text-muted-foreground">Payment rails</p>
                      </div>
                    </div>
                  </FadeInView>
                </div>

                <FadeInView delay={0.18} direction="left">
                  <div className="hero-aside h-full">
                    <div className="hero-visual-card">
                      <div className="hero-visual-image-wrap">
                        <img
                          src={showcaseImages[0]}
                          alt="Remote team collaborating"
                          className="hero-visual-image"
                        />
                        <div className="hero-visual-overlay" />
                        <div className="hero-visual-copy">
                          <p className="text-xs uppercase tracking-[0.26em] text-white/72">Remote work focus</p>
                          <p className="mt-3 max-w-sm text-2xl font-semibold text-white">
                            Jobs, payment readiness, and planning brought into one clearer starting point.
                          </p>
                        </div>
                      </div>

                      <div className="hero-aside-footer">
                        <div className="hero-signal-panel dark-panel rounded-[1.5rem] p-5">
                          <p className="text-sm uppercase tracking-[0.28em] text-white/55">Current market signal</p>
                          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="rounded-[1.15rem] bg-white/8 p-4">
                              <p className="text-xs uppercase tracking-[0.24em] text-white/55">Beginner friendly</p>
                              <p className="mt-2 text-3xl font-semibold text-white">{beginnerFriendlyJobs}</p>
                            </div>
                            <div className="rounded-[1.15rem] bg-white/8 p-4">
                              <p className="text-xs uppercase tracking-[0.24em] text-white/55">South Africa ready</p>
                              <p className="mt-2 text-3xl font-semibold text-white">{Object.keys(saAvailability).length}</p>
                            </div>
                          </div>
                        </div>

                        <div className="soft-panel flex min-h-[14rem] flex-col justify-between p-5">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Guided workflow
                          </div>
                          <p className="text-2xl font-semibold leading-tight">
                            Start with jobs, check earning potential, then build a practical plan.
                          </p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            A steadier entry point for people who want order before action.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInView>
              </div>
            </div>
          </div>
        </section>

        <section className="ticker-band border-y border-border/70 bg-secondary/70 py-5">
          <div className="ticker-window" aria-label="Platform focus areas">
            <div className="ticker-track">
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span key={`${item}-${index}`} className="ticker-item" aria-hidden={index >= tickerItems.length}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <FadeInView>
              <div className="grid gap-4 sm:grid-cols-[1fr_0.8fr]">
                <div className="overflow-hidden rounded-[2rem]">
                  <img src={showcaseImages[2]} alt="Person working from a laptop" className="h-full min-h-[29rem] w-full object-cover" />
                </div>
                <div className="grid gap-4">
                  <div className="soft-panel p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Pathway</p>
                    <p className="mt-4 text-3xl font-semibold">Clear steps for choosing a path and taking action.</p>
                  </div>
                  <div className="dark-panel rounded-[1.75rem] p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-white/55">Start here</p>
                    <ul className="mt-5 space-y-3 text-sm text-white/80">
                      <li className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        Compare beginner-friendly jobs, platforms, and payout options.
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        Use AI prompts to turn your time and skills into a next-step plan.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.08} direction="left">
              <div className="space-y-8">
                <Badge className="section-label border-0 px-4 py-2">How it works</Badge>
                <div className="space-y-5">
                  <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                    A practical dashboard for starting remote income.
                  </h2>
                  <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                    The homepage brings the important parts forward: available jobs, earning methods, guides, payment readiness, and a calculator that shows a more realistic monthly picture.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="soft-panel p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-2xl font-semibold">Choose a path</p>
                    <p className="mt-2 text-muted-foreground">Compare work types by difficulty, earning range, and payment options.</p>
                  </div>
                  <div className="soft-panel p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-2xl font-semibold">Plan the first week</p>
                    <p className="mt-2 text-muted-foreground">Use the assistant to narrow your options and avoid vague advice.</p>
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        </section>

        <section className="bg-secondary/70 px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <FadeInView>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-4">
                  <Badge className="section-label border-0 px-4 py-2">Capabilities</Badge>
                  <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                    The core tools are grouped by what you need next.
                  </h2>
                </div>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Move from discovery to planning without jumping between random advice, job boards, and spreadsheets.
                </p>
              </div>
            </FadeInView>

            <StaggerContainer className="mt-12 grid gap-6 lg:grid-cols-3">
              {capabilityCards.map((card) => (
                <StaggerItem key={card.title}>
                  <article className="soft-panel overflow-hidden p-0">
                    <img src={card.image} alt={card.title} className="h-72 w-full object-cover" />
                    <div className="p-6">
                      <p className="text-2xl font-semibold">{card.title}</p>
                      <p className="mt-3 leading-7 text-muted-foreground">{card.description}</p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <StaggerContainer className="mt-6 grid gap-6 lg:grid-cols-4">
              {earningMethods.map((method) => {
                const category = opportunityCategoryByMethodId[method.id as keyof typeof opportunityCategoryByMethodId]
                return (
                  <StaggerItem key={method.id}>
                    <OpportunityCard
                      title={method.name}
                      description={method.description}
                      category={category}
                    />
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        <section className="px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <FadeInView>
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div className="space-y-4">
                  <Badge className="section-label border-0 px-4 py-2">Featured opportunities</Badge>
                  <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                    A structured showcase for the roles people can act on.
                  </h2>
                </div>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Each role keeps the details that matter visible: company, category, skills, payment context, and a quick path to the full listing.
                </p>
              </div>
            </FadeInView>

            <StaggerContainer className="mt-12 grid gap-6 lg:grid-cols-3">
              {latestJobs.map((job, index) => (
                <StaggerItem key={job.id}>
                  <article className={`${index === 1 ? 'dark-panel text-white' : 'soft-panel'} h-full p-6`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`text-sm uppercase tracking-[0.24em] ${index === 1 ? 'text-white/60' : 'text-muted-foreground'}`}>{job.company}</p>
                        <h3 className="mt-3 text-3xl font-semibold leading-tight">{job.title}</h3>
                      </div>
                      <Briefcase className={`h-5 w-5 ${index === 1 ? 'text-accent' : 'text-primary'}`} />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${
                            index === 1 ? 'bg-white/10 text-white/80' : 'bg-secondary text-foreground'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className={`mt-6 text-sm leading-7 ${index === 1 ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {job.location} / {job.isRemote ? 'Remote available' : 'On-site or hybrid'}
                    </p>

                    <div className={`mt-8 flex items-center justify-between border-t pt-5 ${index === 1 ? 'border-white/10' : 'border-border/60'}`}>
                      <div>
                        <p className={`text-xs uppercase tracking-[0.22em] ${index === 1 ? 'text-white/55' : 'text-muted-foreground'}`}>Type</p>
                        <p className="mt-2 font-medium">{job.isRemote ? 'Remote' : 'Hybrid'}</p>
                      </div>
                      <p className="text-right font-semibold">{job.salary}</p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="bg-secondary/70 px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <FadeInView>
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div className="space-y-5">
                  <Badge className="section-label border-0 px-4 py-2">AI assistant</Badge>
                  <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                    Ask for a plan when the options start to blur.
                  </h2>
                  <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                        Share your skills, available hours, and target. Sonke will recommend methods, guides, expected income, and first steps.
                  </p>
                </div>
                <div className="soft-panel p-2">
                  <AiMoneyCoach />
                </div>
              </div>
            </FadeInView>
          </div>
        </section>

        <section className="px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <FadeInView>
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div className="space-y-4">
                  <Badge className="section-label border-0 px-4 py-2">South Africa signals</Badge>
                  <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                    Check platform and payment readiness before you commit.
                  </h2>
                </div>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  See common payout methods and setup requirements so you can spot friction before you spend time applying or building a profile.
                </p>
              </div>
            </FadeInView>

            <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {supportSignals.map(([name, details]) => (
                <StaggerItem key={name}>
                  <div className="soft-panel h-full p-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-2xl font-semibold">{name}</p>
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="mt-5 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Payout options</p>
                        <p className="mt-2 text-sm leading-7">{details.paymentMethods.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Requirements</p>
                        <p className="mt-2 text-sm leading-7">{details.requirements.join(' / ')}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="bg-secondary/70 px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <FadeInView>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-4">
                  <Badge className="section-label border-0 px-4 py-2">Guides and reads</Badge>
                  <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                    Guides for the details people usually miss.
                  </h2>
                </div>
                <Button asChild variant="outline" className="h-12 rounded-full border-border bg-transparent px-6">
                  <Link href="/guides">
                    View all guides
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeInView>

            <StaggerContainer className="mt-12 grid gap-6 lg:grid-cols-3">
              {featuredGuides.map((guide, index) => (
                <StaggerItem key={guide.slug}>
                  <article className={`${index === 0 ? 'dark-panel text-white' : 'soft-panel'} h-full p-6`}>
                    <div className="flex items-center justify-between gap-4">
                      <span className={`text-xs uppercase tracking-[0.22em] ${index === 0 ? 'text-white/60' : 'text-muted-foreground'}`}>{guide.timeToFirstEarning}</span>
                      <Star className={`h-4 w-4 ${index === 0 ? 'text-accent' : 'text-primary'}`} />
                    </div>
                    <h3 className="mt-6 text-3xl font-semibold leading-tight">{guide.title}</h3>
                    <p className={`mt-4 leading-7 ${index === 0 ? 'text-white/75' : 'text-muted-foreground'}`}>{guide.overview}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {[guide.difficulty, ...guide.paymentMethods.slice(0, 2)].map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${
                            index === 0 ? 'bg-white/10 text-white/80' : 'bg-secondary text-foreground'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="px-4 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="mx-auto max-w-7xl">
            <FadeInView>
              <div className="dark-panel overflow-hidden rounded-[2.2rem] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                  <div className="space-y-6">
                    <Badge className="border border-white/12 bg-white/8 px-4 py-2 text-white">Ready to start</Badge>
                    <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
                      Start with the clearest next step, not every option at once.
                    </h2>
                    <p className="max-w-xl text-lg leading-8 text-white/72">
                      Browse live opportunities, estimate the numbers, then use the guides and AI coach to decide what to do this week.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-white/8 p-5 text-white">
                      <Calculator className="h-5 w-5 text-accent" />
                      <p className="mt-5 text-2xl font-semibold">Estimate your target</p>
                      <p className="mt-2 text-sm leading-7 text-white/70">Use time, skill level, and platform fees to see a realistic monthly range.</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/8 p-5 text-white">
                      <CreditCard className="h-5 w-5 text-accent" />
                      <p className="mt-5 text-2xl font-semibold">Set up payments</p>
                      <p className="mt-2 text-sm leading-7 text-white/70">Check which platforms work with PayPal, Payoneer, Wise, or local transfers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
