'use client'

import { KeyboardEvent, useState } from 'react'
import { AlertCircle, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type Props = {
  feature: 'home' | 'calculator' | 'guides' | 'jobs'
  title: string
  description: string
  placeholder: string
  buttonLabel: string
  emptyMessage: string
  buildPayload?: (input: string) => Record<string, unknown>
}

export function AiAssistantPanel({
  feature,
  title,
  description,
  placeholder,
  buttonLabel,
  emptyMessage,
  buildPayload,
}: Props) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit() {
    if (!input.trim()) {
      setError(emptyMessage)
      return
    }

    const trimmedInput = input.trim()
    setIsLoading(true)
    setError('')
    setInput('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feature,
          prompt: trimmedInput,
          history: messages,
          ...(buildPayload ? buildPayload(trimmedInput) : {}),
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to generate AI response.')
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'user', content: trimmedInput },
        { role: 'assistant', content: data.text || '' },
      ])
    } catch (submissionError: any) {
      setError(submissionError?.message || 'Unable to generate AI response.')
      setInput(trimmedInput)
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSubmit()
    }
  }

  return (
    <Card className="section-shell border-border/50 bg-card/80 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          {title}
        </CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Start a real conversation. Ask a question, say hey, or describe what you need help with.</span>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground'
                    : 'mr-auto max-w-[85%] rounded-2xl border border-border/60 bg-secondary/50 px-4 py-3 text-sm text-foreground'
                }
              >
                <p className="whitespace-pre-wrap leading-7">{message.content}</p>
              </div>
            ))
          )}
          {isLoading ? (
            <div className="mr-auto max-w-[85%] rounded-2xl border border-border/60 bg-secondary/50 px-4 py-3 text-sm text-foreground">
              <div className="flex items-center gap-2">
                <Spinner />
                <span>Thinking...</span>
              </div>
            </div>
          ) : null}
        </div>

        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-24 resize-none bg-secondary/40"
        />

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <Spinner className="mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {buttonLabel}
          </Button>
          {messages.length > 0 ? (
            <Button variant="outline" onClick={() => setMessages([])} disabled={isLoading}>
              New Chat
            </Button>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
