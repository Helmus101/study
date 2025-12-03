import { useState } from 'react'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import type { Flashcard } from '../../types'

interface FlashcardsProps {
  flashcards: Flashcard[]
}

const confidenceColors = {
  solid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
  wobbly: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100',
  unknown: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
}

export function Flashcards({ flashcards }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = flashcards[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  if (!currentCard) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        No flashcards available yet. AI will generate them based on your study content.
      </div>
    )
  }

  return (
    <section className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
          AI-Generated Flashcards
        </h3>
        <span className="text-sm text-[var(--text-secondary)]">
          {currentIndex + 1} / {flashcards.length}
        </span>
      </header>

      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[200px] p-8 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] cursor-pointer hover:shadow-lg transition flex items-center justify-center"
      >
        <p className="text-xl text-center text-[var(--text-primary)]">
          {isFlipped ? '[Answer hidden - click to reveal]' : currentCard.prompt}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Button onClick={handlePrevious} variant="ghost" size="sm" disabled={flashcards.length <= 1}>
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${confidenceColors[currentCard.confidence]}`}>
          {currentCard.confidence}
        </span>
        <Button onClick={handleNext} variant="ghost" size="sm" disabled={flashcards.length <= 1}>
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  )
}
