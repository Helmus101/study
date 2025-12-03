import { ListChecks } from 'lucide-react'
import type { QuizQuestion } from '../../types'
import { Button } from '../ui/Button'

interface QuizPlaceholderProps {
  quiz: QuizQuestion[]
}

export function QuizPlaceholder({ quiz }: QuizPlaceholderProps) {
  return (
    <section className="p-6 space-y-4 border-t border-[var(--border-color)]">
      <header className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
        <ListChecks className="w-5 h-5 text-[var(--color-primary)]" />
        Lightning Quiz Preview
      </header>
      <p className="text-sm text-[var(--text-secondary)]">
        Quick formative assessments appear here. Questions pull from AI memory of your pronote and
        Google activity. Selecting an answer triggers mocked endpoints for now.
      </p>
      <div className="space-y-3">
        {quiz.map(question => (
          <article key={question.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
            <p className="font-medium text-[var(--text-primary)] mb-3">{question.question}</p>
            <div className="grid gap-2">
              {question.options.map((option, index) => (
                <Button key={index} variant="ghost" size="sm" className="justify-start">
                  {option}
                </Button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
