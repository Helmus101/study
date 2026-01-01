import { useState } from 'react'
import { Calendar, Save, Bell, FileText, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import type { SnapshotResult, SoftWallType } from '../../types'

interface ResultsDisplayProps {
  result: SnapshotResult
  onEmailCapture: (email: string) => void
  onSoftWallTrigger: (type: SoftWallType) => void
  showEmailCapture?: boolean
}

export function ResultsDisplay({ 
  result, 
  onEmailCapture, 
  onSoftWallTrigger,
  showEmailCapture = true 
}: ResultsDisplayProps) {
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onEmailCapture(email)
      setEmailSubmitted(true)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch {
      return dateString
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Results Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          {result.entityName}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
          <Calendar size={14} />
          Current snapshot · {formatDate(result.analyzedAt)}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 shadow-[var(--shadow)] mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
          Summary
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Key Points */}
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 shadow-[var(--shadow)] mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
          Key Points
        </h2>
        <ul className="space-y-2">
          {result.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-[var(--color-primary)] mt-1">•</span>
              <span className="text-[var(--text-secondary)]">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sources */}
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 shadow-[var(--shadow)] mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Sources
        </h2>
        <div className="space-y-4">
          {result.sources.map((source, index) => (
            <div key={index} className="border-l-2 border-[var(--color-primary)] pl-4">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="font-medium text-[var(--text-primary)]">
                  {source.name}
                </h3>
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[var(--color-primary)] hover:underline text-sm"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-sm text-[var(--text-tertiary)] mb-2">
                {formatDate(source.date)}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {source.snippet}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons - Trigger Soft Walls */}
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 shadow-[var(--shadow)] mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onSoftWallTrigger('save')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Save size={18} />
            <span>Save Snapshot</span>
          </button>
          <button
            onClick={() => onSoftWallTrigger('monitor')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Bell size={18} />
            <span>Monitor Changes</span>
          </button>
          <button
            onClick={() => onSoftWallTrigger('note')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <FileText size={18} />
            <span>Add Private Note</span>
          </button>
        </div>
      </div>

      {/* Memory CTA Section */}
      {showEmailCapture && !emailSubmitted && (
        <>
          <div className="border-t border-[var(--border-color)] my-8"></div>
          
          <div className="bg-[var(--bg-primary)] rounded-lg p-8 shadow-[var(--shadow)] text-center">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
              This is a one-time snapshot
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
              Anqer becomes powerful when it remembers. Want Anqer to keep track of {result.entityName} for you over time?
            </p>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Remember
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
