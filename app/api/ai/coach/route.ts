import { NextRequest, NextResponse } from 'next/server'
import { formatZar, guides } from '@/lib/data'

export const runtime = 'nodejs'

type CoachInput = {
  skills?: string
  timeAvailable?: string
  goal?: string
}

type Recommendation = {
  method: string
  guideSlug: string
  whyItFits: string
  expectedIncome: string
  nextSteps: string[]
}

function scoreGuide(input: Required<CoachInput>, guide: (typeof guides)[number]) {
  const haystack = `${guide.title} ${guide.overview} ${guide.steps.join(' ')}`.toLowerCase()
  const userText = `${input.skills} ${input.goal}`.toLowerCase()
  let score = 0

  for (const word of userText.split(/\W+/).filter(Boolean)) {
    if (word.length > 3 && haystack.includes(word)) score += 2
  }

  if (/design|canva|edit|writing|admin|transcription|cv/i.test(input.skills) && guide.slug.includes('fiverr')) score += 4
  if (/client|freelance|admin|support|writing|developer|assistant/i.test(input.skills) && guide.slug.includes('upwork')) score += 4
  if (/content|social|youtube|tiktok|blog|audience|marketing/i.test(input.skills) && guide.slug.includes('affiliate')) score += 5
  if (/fast|quick|first|1000|urgent/i.test(input.goal) && guide.difficulty === 'Easy') score += 3
  if (/long|scale|passive|content/i.test(input.goal) && guide.slug.includes('affiliate')) score += 3
  if (/1 hour|weekend|little/i.test(input.timeAvailable) && guide.difficulty === 'Easy') score += 2

  return score
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CoachInput
    const skills = body.skills?.trim()
    const timeAvailable = body.timeAvailable?.trim()
    const goal = body.goal?.trim()

    if (!skills || !timeAvailable || !goal) {
      return NextResponse.json(
        { error: 'Please provide skills, time available, and goal.' },
        { status: 400 }
      )
    }

    const input = { skills, timeAvailable, goal }
    const recommendations: Recommendation[] = guides
      .map((guide) => ({ guide, score: scoreGuide(input, guide) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ guide }) => ({
        method: guide.title,
        guideSlug: guide.slug,
        whyItFits: `This matches your skills (${skills}) and goal (${goal}) because it has a ${guide.difficulty.toLowerCase()} to ${guide.difficulty === 'Hard' ? 'advanced' : 'practical'} starting curve and a realistic first-earning window of ${guide.timeToFirstEarning}.`,
        expectedIncome: `${formatZar(guide.earnings.min)} - ${formatZar(guide.earnings.max)}/month`,
        nextSteps: guide.steps.slice(0, 4),
      }))

    return NextResponse.json({ recommendations })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to build money coach recommendations.' },
      { status: 500 }
    )
  }
}
