import { CheckCircle, Mail } from 'lucide-react'

interface EmailConfirmationProps {
  email: string
  entityName?: string
}

export function EmailConfirmation({ email, entityName }: EmailConfirmationProps) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8 flex justify-center">
        <div className="p-4 rounded-full bg-[var(--color-success)] bg-opacity-10">
          <CheckCircle size={48} className="text-[var(--color-success)]" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
        You're in.
      </h1>
      
      <p className="text-lg text-[var(--text-secondary)] mb-6">
        We'll notify you when memory unlocks.
      </p>

      <div className="bg-[var(--bg-primary)] rounded-lg p-6 shadow-[var(--shadow)] mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mail size={20} className="text-[var(--color-primary)]" />
          <span className="font-medium text-[var(--text-primary)]">{email}</span>
        </div>
        
        {entityName && (
          <div className="border-t border-[var(--border-color)] pt-4 mt-4">
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">{entityName}</span> will be waiting for you.
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-2">
              When you get access, this person will be ready to remember.
            </p>
          </div>
        )}
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-lg p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-2">
          What happens next?
        </h3>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 text-left max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-primary)] mt-0.5">•</span>
            <span>You'll receive a confirmation email shortly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-primary)] mt-0.5">•</span>
            <span>We'll notify you when your access is ready</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-primary)] mt-0.5">•</span>
            <span>Your preferences and context will be saved</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
