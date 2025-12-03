import { Bell, AlertTriangle, TrendingUp, BookOpen } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import type { DashboardInsight } from '../../types'

interface SmartFeedProps {
  insights: DashboardInsight[]
}

const sourceIcons = {
  pronote: BookOpen,
  google: TrendingUp,
  ai: Bell
}

const sentimentColors = {
  positive: 'success',
  neutral: 'info',
  warning: 'warning'
} as const

export function SmartFeed({ insights }: SmartFeedProps) {
  return (
    <Card title="Smart Feed" subtitle="AI-curated updates from all sources">
      <div className="space-y-3">
        {insights.map(insight => {
          const Icon = sourceIcons[insight.source]
          return (
            <article
              key={insight.id}
              className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] transition hover:shadow-md"
            >
              <header className="flex items-start gap-3 mb-2">
                <div
                  className={`p-2 rounded-lg ${insight.sentiment === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-blue-100 dark:bg-blue-900'}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--text-primary)]">{insight.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{insight.summary}</p>
                </div>
                {insight.sentiment === 'warning' && (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
              </header>
              <footer className="flex items-center justify-between mt-3">
                <div className="flex gap-2 flex-wrap">
                  {insight.tags.map(tag => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                  <Badge variant={sentimentColors[insight.sentiment]}>
                    {insight.source}
                  </Badge>
                </div>
                {insight.actionLabel && (
                  <Button size="sm" variant="ghost">
                    {insight.actionLabel}
                  </Button>
                )}
              </footer>
            </article>
          )
        })}
      </div>
    </Card>
  )
}
