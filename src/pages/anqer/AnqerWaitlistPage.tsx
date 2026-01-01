import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Brain, CheckCircle2 } from 'lucide-react'
import { useAnqerStore } from '../../store/useAnqerStore'
import { mockSubmitWaitlist } from '../../api/mockAnqerApi'
import { Button } from '../../components/ui/Button'

export function AnqerWaitlistPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()
  const { joinWaitlist, waitlist } = useAnqerStore()

  // Handle already joined state
  React.useEffect(() => {
    if (waitlist.isJoined && !isSubmitted) {
      setIsSubmitted(true)
      setEmail(waitlist.email || '')
    }
  }, [waitlist.isJoined, waitlist.email, isSubmitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || isLoading) return

    setIsLoading(true)
    try {
      await mockSubmitWaitlist(email)
      joinWaitlist(email)
      setIsSubmitted(true)
      // Redirect to confirmation after a short delay to show success state
      setTimeout(() => {
        navigate('/confirmation')
      }, 1500)
    } catch (error) {
      console.error('Waitlist submission failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted && !isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
          You're in.
        </h1>
        <p className="text-xl text-[var(--text-secondary)] mb-8">
          We'll notify you at <span className="font-semibold text-[var(--text-primary)]">{email}</span> when memory unlocks.
        </p>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Search
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <div className="flex justify-center mb-8">
        <Brain className="w-16 h-16 text-[var(--color-primary)]" />
      </div>
      
      <h1 className="text-4xl font-extrabold mb-6 text-[var(--text-primary)]">
        Memory is limited. Anqer is not.
      </h1>
      
      <p className="text-xl text-[var(--text-secondary)] mb-12">
        Stop taking snapshots. Start building a permanent memory of the people and entities that matter to you.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--color-primary)] outline-none transition-all shadow-md"
          disabled={isLoading}
        />
        
        <Button 
          type="submit" 
          size="lg"
          className="w-full py-4 text-lg font-semibold"
          disabled={isLoading || !email.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Requesting Access...
            </>
          ) : (
            'Request Access'
          )}
        </Button>
        
        <p className="text-sm text-[var(--text-secondary)]">
          No password required. Just a seat in line.
        </p>
      </form>
    </div>
  )
}
