import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, CheckSquare, Square } from 'lucide-react'
import type { CalendarDay, StudyChecklistItem } from '../../types'

interface RightPanelProps {
  calendar: CalendarDay[]
  checklist: StudyChecklistItem[]
  onChecklistToggle: (itemId: string) => void
}

export function RightPanel({ calendar, checklist, onChecklistToggle }: RightPanelProps) {
  return (
    <aside className="h-full flex flex-col bg-[var(--bg-primary)] border-l border-[var(--border-color)]">
      <section className="border-b border-[var(--border-color)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          Mini Calendar
        </h3>
        <div className="space-y-2">
          {calendar.slice(0, 3).map(day => (
            <div
              key={day.date}
              className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm"
            >
              <div className="font-medium text-[var(--text-primary)]">
                {format(parseISO(day.date), 'EEE, MMM d')}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">{day.focus}</div>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${i < day.workload ? 'bg-[var(--color-primary)]' : 'bg-[var(--bg-tertiary)]'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Task Checklist</h3>
        <ul className="space-y-2">
          {checklist.map(item => (
            <li key={item.id} className="flex items-start gap-2">
              <button
                onClick={() => onChecklistToggle(item.id)}
                className="mt-0.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
              >
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-[var(--color-success)]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span
                className={`text-sm ${item.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
