import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function Card({ title, subtitle, children, actions, className = '' }: CardProps) {
  return (
    <section className={`bg-[var(--bg-primary)] rounded-2xl shadow ${className}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-4 border-b border-[var(--border-color)] px-6 py-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>}
            {subtitle && <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="px-6 py-5 text-[var(--text-primary)]">{children}</div>
    </section>
  )
}
