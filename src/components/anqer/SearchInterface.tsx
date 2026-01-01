import { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchInterfaceProps {
  onSearch: (entityName: string) => void
  isLoading?: boolean
}

export function SearchInterface({ onSearch, isLoading = false }: SearchInterfaceProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSearch(input.trim())
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a person or entity to analyze..."
            disabled={isLoading}
            className="w-full px-6 py-4 pr-14 text-lg rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </form>
      
      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-[var(--text-secondary)] text-sm">
            Analyzing current context...
          </p>
        </div>
      )}
    </div>
  )
}
