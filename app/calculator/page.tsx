'use client'

import { useState, useMemo } from 'react'
import { Calculator, Clock, TrendingUp, Zap, DollarSign, Target, Info, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AiAssistantPanel } from '@/components/ai-assistant-panel'
import { platforms } from '@/lib/data'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FadeIn, FadeInView, StaggerContainer, StaggerItem, TiltCard, SlideIn, MorphingBlob } from '@/components/motion'

type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export default function CalculatorPage() {
  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [daysPerWeek, setDaysPerWeek] = useState(5)
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Beginner')
  const [platform, setPlatform] = useState(platforms[0].name)

  const selectedPlatform = platforms.find(p => p.name === platform) || platforms[0]

  const calculations = useMemo(() => {
    const hoursPerMonth = hoursPerDay * daysPerWeek * 4
    const multiplier = selectedPlatform.multipliers[skillLevel]
    const hourlyRate = selectedPlatform.baseRate * multiplier
    const monthlyIncome = Math.round(hoursPerMonth * hourlyRate)
    const platformFees = Math.round(monthlyIncome * selectedPlatform.feeRate)
    const netAfterFees = monthlyIncome - platformFees
    const suggestedTaxReserve = Math.round(netAfterFees * 0.15)
    const netAfterReserve = netAfterFees - suggestedTaxReserve

    const payoutTimeWeeks = skillLevel === 'Beginner' ? 4 : skillLevel === 'Intermediate' ? 2 : 1
    const difficulty = skillLevel === 'Beginner' ? 'Low' : skillLevel === 'Intermediate' ? 'Medium' : 'High'

    return {
      hoursPerMonth,
      hourlyRate,
      monthlyIncome,
      platformFees,
      netAfterFees,
      suggestedTaxReserve,
      netAfterReserve,
      payoutTimeWeeks,
      difficulty,
    }
  }, [hoursPerDay, daysPerWeek, skillLevel, selectedPlatform])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Page Header */}
        <section className="relative overflow-hidden px-4 py-14 sm:py-20 lg:px-8 lg:py-28">
          <div className="absolute inset-0 -z-10">
            <MorphingBlob className="left-1/4 top-1/4 h-[400px] w-[400px]" color="primary" />
            <MorphingBlob className="right-1/4 bottom-1/4 h-[500px] w-[500px]" color="accent" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="hero-shell max-w-5xl rounded-[2rem] px-6 py-10 sm:px-8 lg:px-12">
                <Badge className="eyebrow-chip mb-6 gap-2 rounded-full px-4 py-2 text-primary border-0">
                  <Sparkles className="h-4 w-4" />
                  Income Calculator
                </Badge>
                <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                  Estimate Your <span className="gradient-text">Income</span>
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Calculate how much you could earn working online from South Africa based on your available time, skill level, and chosen platform.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="px-4 py-10 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Input Controls */}
              <SlideIn direction="right">
                <div className="space-y-6">
                  <Card className="section-shell border-border/50 bg-card/80 backdrop-blur-xl shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Calculator className="h-5 w-5 text-primary" />
                        </div>
                        Your Details
                      </CardTitle>
                      <CardDescription className="text-base">
                        Adjust the sliders and options to calculate your potential income
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Hours per day */}
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <label className="text-sm font-medium text-foreground">
                            Hours per day
                          </label>
                          <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {hoursPerDay} hours
                          </span>
                        </div>
                        <Slider
                          value={[hoursPerDay]}
                          onValueChange={([value]) => setHoursPerDay(value)}
                          min={1}
                          max={12}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 hour</span>
                          <span>12 hours</span>
                        </div>
                      </div>

                      {/* Days per week */}
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <label className="text-sm font-medium text-foreground">
                            Days per week
                          </label>
                          <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {daysPerWeek} days
                          </span>
                        </div>
                        <Slider
                          value={[daysPerWeek]}
                          onValueChange={([value]) => setDaysPerWeek(value)}
                          min={1}
                          max={7}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 day</span>
                          <span>7 days</span>
                        </div>
                      </div>

                      {/* Skill Level */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-foreground">
                            Skill Level
                          </label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  Your skill level affects your potential hourly rate. 
                                  Beginners typically charge less but gain experience quickly.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select value={skillLevel} onValueChange={(value) => setSkillLevel(value as SkillLevel)}>
                          <SelectTrigger className="h-11 bg-secondary/50 border-border/50">
                            <SelectValue placeholder="Select skill level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner (0-1 years)</SelectItem>
                            <SelectItem value="Intermediate">Intermediate (1-3 years)</SelectItem>
                            <SelectItem value="Advanced">Advanced (3+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Platform */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-foreground">
                          Platform
                        </label>
                        <Select value={platform} onValueChange={setPlatform}>
                          <SelectTrigger className="h-11 bg-secondary/50 border-border/50">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {platforms.map((p) => (
                              <SelectItem key={p.name} value={p.name}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </SlideIn>

              {/* Results */}
              <FadeInView delay={0.2}>
                <div className="space-y-6">
                  {/* Main Result Card */}
                  <Card className="section-shell overflow-hidden border-0 shadow-2xl">
                    <div className="relative overflow-hidden bg-gradient-to-br from-foreground to-foreground/90 p-5 text-background sm:p-8 lg:p-10">
                      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-primary/30 to-transparent" />
                      <div className="absolute right-0 bottom-0 h-full w-1/3 bg-gradient-to-l from-accent/30 to-transparent" />
                      <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
                      <div className="absolute right-10 bottom-10 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
                      <div className="relative">
                        <p className="text-sm font-medium text-background/70">Estimated Monthly Gross</p>
                        <p className="calculator-result-value mt-2 text-5xl font-bold sm:text-6xl">
                          {formatCurrency(calculations.monthlyIncome)}
                        </p>
                        <p className="mt-3 text-sm text-background/60">
                          Based on {calculations.hoursPerMonth} hours/month on {platform}
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-5 sm:p-6">
                      <div className="grid gap-6 sm:grid-cols-3">
                        {[
                          { icon: DollarSign, value: formatCurrency(calculations.hourlyRate), label: 'Est. Hourly Rate' },
                          { icon: Clock, value: `${calculations.payoutTimeWeeks} weeks`, label: 'Time to First Payout' },
                          { icon: Target, value: calculations.difficulty, label: 'Difficulty Level' },
                        ].map((stat) => (
                          <div key={stat.label} className="text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                              <stat.icon className="h-6 w-6 text-primary" />
                            </div>
                            <p className="mt-3 text-xl font-bold text-foreground sm:text-2xl">
                              {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="section-shell border-border/50 bg-card/80 backdrop-blur-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Reality Check</CardTitle>
                        <CardDescription>More realistic cash-flow view after fees and a tax buffer.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-muted-foreground">Platform fees</span>
                          <span className="font-semibold text-foreground">{formatCurrency(calculations.platformFees)}</span>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-muted-foreground">After platform fees</span>
                          <span className="font-semibold text-foreground">{formatCurrency(calculations.netAfterFees)}</span>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-muted-foreground">Suggested tax reserve</span>
                          <span className="font-semibold text-foreground">{formatCurrency(calculations.suggestedTaxReserve)}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                          <span className="font-medium text-foreground">Estimated spendable amount</span>
                          <span className="font-bold text-primary">{formatCurrency(calculations.netAfterReserve)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="section-shell border-border/50 bg-card/80 backdrop-blur-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Platform Notes</CardTitle>
                        <CardDescription>Grounded assumptions for {selectedPlatform.name}.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>{selectedPlatform.notes}</p>
                        <p>
                          Payout methods: <span className="text-foreground">{selectedPlatform.payoutMethods.join(', ')}</span>
                        </p>
                        <p>
                          Estimated fee rate: <span className="text-foreground">{Math.round(selectedPlatform.feeRate * 100)}%</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Info Cards */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TiltCard tiltStrength={5}>
                      <Card className="section-shell border-border/50 bg-card/80 backdrop-blur-xl h-full">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-3 text-base">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                              <TrendingUp className="h-4 w-4 text-primary" />
                            </div>
                            Growth Potential
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {skillLevel === 'Beginner' 
                              ? 'With consistent effort, you could double your income within 6-12 months as you build experience and ratings.'
                              : skillLevel === 'Intermediate'
                              ? 'Focus on specialization and premium clients to increase your rates by 50-100% over the next year.'
                              : 'At your level, building a personal brand and long-term client relationships can significantly boost earnings.'
                            }
                          </p>
                        </CardContent>
                      </Card>
                    </TiltCard>

                    <TiltCard tiltStrength={5}>
                      <Card className="section-shell border-border/50 bg-card/80 backdrop-blur-xl h-full">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-3 text-base">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                              <Zap className="h-4 w-4 text-primary" />
                            </div>
                            Quick Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {[
                              'Set up PayPal or Payoneer for payments',
                              'Start with competitive pricing to build reviews',
                              'Track your earnings for SARS tax purposes'
                            ].map((tip, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    * These estimates are based on average market rates and may vary based on your specific skills, 
                    niche, and market conditions. Actual earnings depend on multiple factors including demand, 
                    competition, and quality of work.
                  </p>

                  <AiAssistantPanel
                    feature="calculator"
                    title="AI Earnings Strategist"
                    description="Turn these calculator numbers into a practical 30-day plan."
                    placeholder="I want a plan that gets me to my first payout as fast as possible."
                    buttonLabel="Build My 30-Day Plan"
                    emptyMessage="Add a goal or concern so the AI can tailor the plan."
                    buildPayload={() => ({
                      platform,
                      skillLevel,
                      hoursPerDay,
                      daysPerWeek,
                      monthlyIncome: formatCurrency(calculations.monthlyIncome),
                      hourlyRate: formatCurrency(calculations.hourlyRate),
                      platformFees: formatCurrency(calculations.platformFees),
                      netAfterFees: formatCurrency(calculations.netAfterFees),
                      taxReserve: formatCurrency(calculations.suggestedTaxReserve),
                      netAfterReserve: formatCurrency(calculations.netAfterReserve),
                      platformNotes: selectedPlatform.notes,
                      platformPayoutMethods: selectedPlatform.payoutMethods.join(', '),
                    })}
                  />
                </div>
              </FadeInView>
            </div>
          </div>
        </section>

        {/* SA Availability Checker */}
        <section className="relative overflow-hidden px-4 py-14 sm:py-20 lg:px-8 lg:py-24">
          <div className="absolute inset-0 mesh-gradient -z-10" />
          <div className="mx-auto max-w-7xl">
            <FadeInView>
              <div className="text-center mb-12">
                <Badge variant="outline" className="eyebrow-chip mb-4">Compatibility</Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Can I Do This in South Africa?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Quick reference for popular online earning methods available to South Africans
                </p>
              </div>
            </FadeInView>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.05}>
              {[
                { method: 'YouTube', available: true, payments: ['AdSense', 'Western Union'] },
                { method: 'Freelancing', available: true, payments: ['PayPal', 'Payoneer', 'Wise'] },
                { method: 'Dropshipping', available: true, payments: ['PayFast', 'PayPal'] },
                { method: 'Affiliate Marketing', available: true, payments: ['PayPal', 'Bank Transfer'] },
                { method: 'Online Tutoring', available: true, payments: ['PayPal', 'Bank Transfer'] },
                { method: 'Stock Photography', available: true, payments: ['PayPal', 'Payoneer'] },
              ].map((item) => (
                <StaggerItem key={item.method}>
                  <TiltCard tiltStrength={5}>
                    <Card className="section-shell border-border/50 bg-card/80 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:border-primary/30">
                      <CardContent className="flex items-center justify-between p-5">
                        <div>
                          <p className="font-semibold text-foreground">{item.method}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.payments.join(' / ')}
                          </p>
                        </div>
                        <Badge 
                          variant={item.available ? 'default' : 'destructive'}
                          className={item.available ? 'shadow-sm shadow-primary/20' : ''}
                        >
                          {item.available ? 'Available' : 'Limited'}
                        </Badge>
                      </CardContent>
                    </Card>
                  </TiltCard>
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
