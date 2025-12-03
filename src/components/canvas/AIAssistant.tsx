import { useState } from 'react'
import { Send, MessageCircle, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'

interface AIAssistantProps {
  suggestions: string[]
  onPrompt: (prompt: string) => void
}

export function AIAssistant({ suggestions, onPrompt }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!prompt.trim()) return
    onPrompt(prompt)
    setPrompt('')
  }

  return (
    <aside className="h-full flex flex-col bg-[var(--bg-primary)] border-r border-[var(--border-color)]">
      <header className="px-4 py-3 border-b border-[var(--border-color)] flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
        AI Assistant
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <p className="text-[var(--text-primary)]">{suggestion}</p>
          </div>
        ))}
        <p className="text-xs text-[var(--text-secondary)]">
          Assistant stitches Pronote, Google, and your habits to keep context relevant.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="border-t border-[var(--border-color)] p-3 space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)]">
          Ask the assistant anything
        </label>
        <div className="flex gap-2">
          <input
            value={prompt}
            onChange={event => setPrompt(event.target.value)}
            placeholder="Summarize last section..."
            className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <Button type="submit" size="sm" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>
        <div className="flex gap-2 text-xs text-[var(--text-secondary)]">
          <MessageCircle className="w-3.5 h-3.5" />
          Live responses stream in real-time when integrated.
        </div>
      </form>
    </aside>
  )
}
