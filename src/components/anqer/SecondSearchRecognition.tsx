import { Brain, X } from 'lucide-react'

interface SecondSearchRecognitionProps {
  onJoinWaitlist: () => void
  onDismiss: () => void
}

export function SecondSearchRecognition({ onJoinWaitlist, onDismiss }: SecondSearchRecognitionProps) {
  return (
    <div className="fixed bottom-6 right-6 max-w-md bg-[var(--bg-primary)] rounded-lg shadow-[var(--shadow-lg)] p-6 border border-[var(--border-color)] z-40">
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <X size={18} />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-[var(--color-primary)] bg-opacity-10 mt-1">
          <Brain size={20} className="text-[var(--color-primary)]" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">
            Using Anqer like a memory tool?
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            You've searched multiple times. Want Anqer to actually remember for you?
          </p>
          <button
            onClick={onJoinWaitlist}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  )
}
