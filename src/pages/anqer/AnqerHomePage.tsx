import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2, Brain } from 'lucide-react'
import { useAnqerStore } from '../../store/useAnqerStore'
import { mockSearchEntity } from '../../api/mockAnqerApi'
import { Button } from '../../components/ui/Button'

export function AnqerHomePage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { addSearchHistory, setCurrentSnapshot, searchHistory } = useAnqerStore()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const result = await mockSearchEntity(query)
      setCurrentSnapshot(result)
      addSearchHistory(query)
      navigate('/results')
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isSecondSearch = searchHistory.length > 0

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
      <div className="flex items-center gap-3 mb-8 text-4xl font-bold text-[var(--text-primary)]">
        <Brain className="w-12 h-12 text-[var(--color-primary)]" />
        <span>Anqer</span>
      </div>
      
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-[var(--text-primary)]">
        Snapshots are fleeting. <br />
        <span className="text-[var(--color-primary)]">Memory is permanent.</span>
      </h1>
      
      <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl">
        Enter any person or entity to get an instant snapshot analysis. 
        Experience how Anqer sees the world, then help it remember.
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Who should Anqer analyze?"
            className="w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--color-primary)] outline-none transition-all shadow-lg"
            disabled={isLoading}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--text-secondary)]" />
        </div>
        
        <Button 
          type="submit" 
          size="lg"
          className="mt-6 w-full md:w-auto md:px-12 py-4 text-lg font-semibold"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing Snapshot...
            </>
          ) : (
            'Generate Snapshot'
          )}
        </Button>
      </form>

      {isLoading && (
        <div className="mt-8 animate-pulse text-[var(--text-secondary)] italic">
          Scouring digital footprints... Synthesizing current context...
        </div>
      )}

      {isSecondSearch && !isLoading && (
        <div className="mt-12 p-6 bg-[var(--bg-primary)] border border-[var(--color-primary)] rounded-2xl max-w-lg animate-in fade-in slide-in-from-bottom-4">
          <p className="text-[var(--text-primary)] font-medium mb-3">
            "You're using Anqer like a memory tool. Want it to actually remember?"
          </p>
          <Button variant="outline" onClick={() => navigate('/waitlist')}>
            Join the Waitlist
          </Button>
        </div>
      )}
    </div>
  )
}
