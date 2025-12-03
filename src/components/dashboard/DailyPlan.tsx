import { Clock, Play } from 'lucide-react'
import { Card } from '../ui/Card'
import type { PlanCard } from '../../types'
import { Button } from '../ui/Button'

interface DailyPlanProps {
  plan: PlanCard[]
}

const timeframeColors: Record<PlanCard['timeframe'], string> = {
  morning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100',
  afternoon: 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-100',
  evening: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100'
}

export function DailyPlan({ plan }: DailyPlanProps) {
  return (
    <Card
      title="Daily Plan"
      subtitle="AI stitches Pronote, Google, and habits into a proactive plan"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {plan.map(block => (
          <div key={block.id} className="rounded-2xl border border-[var(--border-color)] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold uppercase tracking-wide ${timeframeColors[block.timeframe]}`}>
                {block.timeframe}
              </span>
              <span className="text-sm text-[var(--text-secondary)]">{block.tasks} tasks</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[var(--text-primary)]">{block.title}</h4>
              <p className="text-sm text-[var(--text-secondary)]">Focus: {block.focus}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Clock className="w-4 h-4" />
                Recommended start {block.recommendedStart}
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-tertiary)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                  style={{ width: `${block.completion}%` }}
                />
              </div>
            </div>
            <Button size="sm" className="w-full flex items-center justify-center gap-2" variant="secondary">
              <Play className="w-4 h-4" />
              Launch focus block
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
