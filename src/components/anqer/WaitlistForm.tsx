import { useState } from 'react'
import { Brain } from 'lucide-react'

interface WaitlistFormProps {
  onSubmit: (email: string) => void
  isLoading?: boolean
}

export function WaitlistForm({ onSubmit, isLoading = false }: WaitlistFormProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim() && !isLoading) {
      onSubmit(email)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8 flex justify-center">
        <div className="p-4 rounded-full bg-[var(--color-primary)] bg-opacity-10">
          <Brain size={48} className="text-[var(--color-primary)]" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
        Memory is limited. Anqer is not.
      </h1>
      
      <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
        Snapshots give you a moment. Memory gives you continuity. 
        Join the waitlist to unlock Anqer's full potential.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isLoading}
            className="w-full px-6 py-4 text-lg rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={!email.trim() || isLoading}
          className="w-full px-6 py-4 text-lg font-semibold rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Submitting...' : 'Request Access'}
        </button>
      </form>
    </div>
  )
}
