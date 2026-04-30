'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

type CoachRecommendation = {
  method: string
  guideSlug: string
  whyItFits: string
  expectedIncome: string
  nextSteps: string[]
}

export function AiMoneyCoach() {
  const [skills, setSkills] = useState('')
  const [timeAvailable, setTimeAvailable] = useState('')
  const [goal, setGoal] = useState('')
  const [recommendations, setRecommendations] = useState<CoachRecommendation[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit() {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, timeAvailable, goal }),
      })
      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to build recommendations.')
      }

      setRecommendations(data.recommendations || [])
    } catch (submissionError: any) {
      setError(submissionError?.message || 'Unable to build recommendations.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="section-shell border-border/50 bg-card/80 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </span>
          AI Money Coach
        </CardTitle>
        <CardDescription className="text-base">
          Tell Sonke what you can do, how much time you have, and what you want to earn. Get practical methods with realistic ZAR ranges.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_1fr]">
          <div className="space-y-2">
            <Label htmlFor="coach-skills">Skills</Label>
            <Input
              id="coach-skills"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
              placeholder="Admin, Canva, writing, customer support..."
              className="bg-secondary/40"
            />
          </div>
          <div className="space-y-2">
            <Label>Time available</Label>
            <Select value={timeAvailable} onValueChange={setTimeAvailable}>
              <SelectTrigger className="bg-secondary/40">
                <SelectValue placeholder="Choose time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 hour per day">1 hour per day</SelectItem>
                <SelectItem value="2-3 hours per day">2-3 hours per day</SelectItem>
                <SelectItem value="Weekends only">Weekends only</SelectItem>
                <SelectItem value="Full-time focus">Full-time focus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coach-goal">Goal</Label>
            <Input
              id="coach-goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Earn first R1000, find remote work..."
              className="bg-secondary/40"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? <Spinner className="mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Get Recommendations
        </Button>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {recommendations.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.guideSlug} className="border-border/60 bg-background/70">
                <CardHeader>
                  <CardTitle className="text-lg">{recommendation.method}</CardTitle>
                  <CardDescription>{recommendation.expectedIncome}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-7 text-muted-foreground">{recommendation.whyItFits}</p>
                  <div>
                    <p className="text-sm font-semibold">Next steps</p>
                    <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {recommendation.nextSteps.map((step, index) => (
                        <li key={step} className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/guides/${recommendation.guideSlug}`}>
                      Open Guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
