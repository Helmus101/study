import { useState } from 'react'
import { X, Save, Bell, FileText } from 'lucide-react'
import type { SoftWallType } from '../../types'

interface SoftWallModalProps {
  type: SoftWallType
  entityName: string
  onClose: () => void
  onEmailSubmit: (email: string) => void
}

const modalContent = {
  save: {
    icon: Save,
    title: 'Save this snapshot',
    description: 'To save snapshots and access them later, Anqer needs to remember your preferences.'
  },
  monitor: {
    icon: Bell,
    title: 'Monitor for changes',
    description: 'Anqer can track updates over time and notify you of changes. Let us remember this person for you.'
  },
  note: {
    icon: FileText,
    title: 'Add private notes',
    description: 'Private notes are stored alongside your memory. Want Anqer to keep track of your context?'
  }
}

export function SoftWallModal({ type, entityName, onClose, onEmailSubmit }: SoftWallModalProps) {
  const [email, setEmail] = useState('')
  
  if (!type) return null
  
  const content = modalContent[type]
  const Icon = content.icon

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onEmailSubmit(email)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-[var(--bg-primary)] rounded-lg shadow-[var(--shadow-lg)] max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
            <Icon size={24} className="text-[var(--color-primary)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {content.title}
          </h2>
        </div>

        <p className="text-[var(--text-secondary)] mb-6">
          {content.description}
        </p>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 mb-6">
          <p className="text-sm text-[var(--text-secondary)]">
            You're trying to remember <span className="font-medium text-[var(--text-primary)]">{entityName}</span>.
            Want Anqer to actually remember?
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoFocus
            className="w-full px-4 py-3 mb-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Not now
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Request Access
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
