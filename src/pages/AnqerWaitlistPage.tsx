import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Brain } from 'lucide-react'
import { WaitlistForm } from '../components/anqer/WaitlistForm'
import { EmailConfirmation } from '../components/anqer/EmailConfirmation'
import { useAnqerStore } from '../store/anqerStore'
import { mockApi } from '../api/mockApi'

export function AnqerWaitlistPage() {
  const navigate = useNavigate()
  const { 
    waitlistSubmission, 
    setWaitlistSubmission,
    currentSnapshot
  } = useAnqerStore()

  const handleSubmit = async (email: string) => {
    try {
      const submission = await mockApi.submitWaitlist(email, currentSnapshot?.entityName)
      setWaitlistSubmission(submission)
      await mockApi.sendConfirmationEmail(email, currentSnapshot?.entityName)
    } catch (error) {
      console.error('Waitlist submission failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain size={28} className="text-[var(--color-primary)]" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Anqer</h1>
          </div>
          {!waitlistSubmission && (
            <button
              onClick={() => navigate('/anqer')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {waitlistSubmission ? (
          <EmailConfirmation
            email={waitlistSubmission.email}
            entityName={waitlistSubmission.entityContext}
          />
        ) : (
          <WaitlistForm onSubmit={handleSubmit} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-[var(--text-secondary)]">
          <p>Anqer · Memory-first intelligence</p>
        </div>
      </footer>
    </div>
  )
}
