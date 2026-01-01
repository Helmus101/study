import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]',
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100',
    outline: 'bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)]'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
