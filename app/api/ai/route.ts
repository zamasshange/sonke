import { NextRequest, NextResponse } from 'next/server'
import { AiChatMessage, generateAiText } from '@/lib/ai'
import { earningMethods, guides, jobs, platforms, saAvailability } from '@/lib/data'

export const runtime = 'nodejs'

type AiFeature = 'home' | 'calculator' | 'guides' | 'jobs'

const guideContext = guides
  .map((guide) => `${guide.title}: ${guide.overview} Earnings: R${guide.earnings.min} - R${guide.earnings.max}. Difficulty: ${guide.difficulty}. Payments: ${guide.paymentMethods.join(', ')}.`)
  .join('\n')

const earningMethodContext = earningMethods
  .map((method) => `${method.name}: ${method.description}. Difficulty: ${method.difficulty}. Potential: ${method.potentialEarning}.`)
  .join('\n')

const availabilityContext = Object.entries(saAvailability)
  .map(([name, details]) => {
    return `${name}: available=${details.available}. Payments=${details.paymentMethods.join(', ')}. Requirements=${details.requirements.join(', ')}.`
  })
  .join('\n')

const curatedJobsContext = jobs
  .map((job) => `${job.title} at ${job.company}. ${job.location}. Remote=${job.isRemote}. Salary=${job.salary || 'Not listed'}. Tags: ${job.tags.join(', ')}.`)
  .join('\n')

function buildAiConfig(feature: AiFeature, payload: Record<string, unknown>) {
  const formattingRule =
    'Return plain text only. No markdown symbols. Keep it clear, natural, easy to scan, and directly helpful.'

  switch (feature) {
    case 'home':
      return {
        systemInstruction: `You are a practical AI income coach for South Africans.
Give concrete, realistic advice. Avoid hype, scams, and vague promises.
If the user sends a greeting, a very short message, or not enough detail, reply naturally and ask up to 2 useful follow-up questions instead of forcing a template.
If the user gives enough detail, recommend the best-fit path, explain why it fits, and suggest useful next steps.
Ground your answer in the platform, guide, payment, and opportunity context provided to you.
${formattingRule}`,
        context: `Site knowledge:
Income methods:
${earningMethodContext}

Guide library:
${guideContext}

South Africa availability:
${availabilityContext}

Curated opportunities:
${curatedJobsContext}`,
      }
    case 'calculator':
      return {
        systemInstruction: `You are an AI earnings strategist for South Africans building remote income.
Use the calculator values exactly as given. Do not change the arithmetic or invent different totals.
If the user greets you or asks something vague, respond conversationally and ask what kind of help they want with the calculator.
If they ask for advice, explain the numbers, highlight tradeoffs, and suggest realistic next steps grounded in the exact calculator snapshot.
Take platform fees, payment methods, and South African payout realities seriously.
${formattingRule}`,
        context: `Calculator snapshot:
Platform: ${String(payload.platform || '')}
Skill level: ${String(payload.skillLevel || '')}
Hours per day: ${String(payload.hoursPerDay || '')}
Days per week: ${String(payload.daysPerWeek || '')}
Estimated monthly income: ${String(payload.monthlyIncome || '')}
Estimated hourly rate: ${String(payload.hourlyRate || '')}
Estimated platform fees: ${String(payload.platformFees || '')}
Estimated after platform fees: ${String(payload.netAfterFees || '')}
Suggested tax reserve: ${String(payload.taxReserve || '')}
Estimated after fees and reserve: ${String(payload.netAfterReserve || '')}
Platform notes: ${String(payload.platformNotes || '')}
Payout methods: ${String(payload.platformPayoutMethods || '')}

Relevant South Africa availability:
${availabilityContext}`,
      }
    case 'guides':
      return {
        systemInstruction: `You are a grounded guide for South Africans making money online.
Answer clearly and practically. Avoid legal certainty. Focus on useful steps, payment setup, platform choices, and beginner-friendly advice.
If the user greets you or asks a short question, respond naturally first instead of forcing a rigid structure.
Ground your answer in the guide library and South African payment realities provided to you.
${formattingRule}`,
        context: `Guide library:
${guideContext}

Income methods:
${earningMethodContext}

South Africa availability:
${availabilityContext}`,
      }
    case 'jobs':
      return {
        systemInstruction: `You are an AI career coach for South African job seekers.
Analyze job fit honestly. Explain strengths, likely gaps, and how to tailor an application without inventing qualifications.
If the user greets you or asks something brief, respond naturally and ask what kind of help they want with the role.
${formattingRule}`,
        context: `Job context:
Job title: ${String(payload.title || '')}
Company: ${String(payload.company || '')}
Location: ${String(payload.location || '')}
Category: ${String(payload.category || '')}
Contract type: ${String(payload.contractType || 'Not specified')}
Description:
${String(payload.description || '')}`,
      }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      feature?: AiFeature
      prompt?: string
      history?: AiChatMessage[]
      [key: string]: unknown
    }

    if (!body.feature || !body.prompt) {
      return NextResponse.json({ error: 'Missing AI feature or prompt.' }, { status: 400 })
    }

    const { context, systemInstruction } = buildAiConfig(body.feature, body)
    const history = Array.isArray(body.history)
      ? body.history
          .filter((message): message is AiChatMessage => {
            if (!message || typeof message !== 'object') return false
            const role = (message as AiChatMessage).role
            const content = (message as AiChatMessage).content
            return (
              (role === 'user' || role === 'assistant') &&
              typeof content === 'string' &&
              content.trim().length > 0
            )
          })
          .slice(-10)
      : []

    const messages: AiChatMessage[] = []

    if (context) {
      messages.push({
        role: 'assistant',
        content: `Context for this conversation:\n${context}`,
      })
    }

    messages.push(...history)
    messages.push({
      role: 'user',
      content: String(body.prompt),
    })

    const text = await generateAiText({ messages, systemInstruction })

    return NextResponse.json({ text })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate AI response.' },
      { status: 500 }
    )
  }
}
