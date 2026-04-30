const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

export type AiChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
    finish_reason?: string
  }>
  error?: {
    message?: string
  }
}

function normalizeAiText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^[*-]\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function generateAiText({
  messages,
  systemInstruction,
}: {
  messages: AiChatMessage[]
  systemInstruction: string
}) {
  const apiKey = process.env.GROQ_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing from the server environment.')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: systemInstruction,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_completion_tokens: 900,
    }),
    signal: AbortSignal.timeout(20000),
    cache: 'no-store',
  })

  const data = (await response.json()) as GroqResponse

  if (!response.ok) {
    throw new Error(data.error?.message || `Groq API error: ${response.status}`)
  }

  const text = data.choices?.[0]?.message?.content?.trim()

  if (!text) {
    const finishReason = data.choices?.[0]?.finish_reason
    throw new Error(finishReason ? `Groq returned no text (${finishReason}).` : 'Groq returned no text.')
  }

  return normalizeAiText(text)
}
