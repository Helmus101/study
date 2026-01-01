import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain } from 'lucide-react'
import { SearchInterface } from '../components/anqer/SearchInterface'
import { SecondSearchRecognition } from '../components/anqer/SecondSearchRecognition'
import { mockApi } from '../api/mockApi'
import { useAnqerStore } from '../store/anqerStore'

export function AnqerHomePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { 
    searchHistory, 
    addToSearchHistory, 
    setCurrentSnapshot,
    secondSearchRecognitionShown,
    setSecondSearchRecognitionShown
  } = useAnqerStore()

  const handleSearch = async (entityName: string) => {
    setIsLoading(true)
    
    try {
      const result = await mockApi.analyzeEntity(entityName)
      setCurrentSnapshot(result)
      addToSearchHistory({
        entityName,
        searchedAt: new Date().toISOString(),
        resultId: result.id
      })
      
      navigate('/anqer/results')
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const showSecondSearchRecognition = searchHistory.length >= 1 && !secondSearchRecognitionShown

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Brain size={28} className="text-[var(--color-primary)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Anqer</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-4">
              Get the current context
            </h2>
            <p className="text-xl text-[var(--text-secondary)]">
              Analyze any person or entity. Instant snapshot of what matters now.
            </p>
          </div>

          <SearchInterface onSearch={handleSearch} isLoading={isLoading} />

          {searchHistory.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-[var(--text-tertiary)]">
                Recent snapshots: {searchHistory.map(h => h.entityName).join(', ')}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Second Search Recognition */}
      {showSecondSearchRecognition && (
        <SecondSearchRecognition
          onJoinWaitlist={() => {
            setSecondSearchRecognitionShown(true)
            navigate('/anqer/waitlist')
          }}
          onDismiss={() => setSecondSearchRecognitionShown(true)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-[var(--text-secondary)]">
          <p>Anqer · Memory-first intelligence</p>
        </div>
      </footer>
    </div>
  )
}
