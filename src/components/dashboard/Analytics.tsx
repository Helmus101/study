import { TrendingUp, Battery, RefreshCw, FileText, Sparkles } from 'lucide-react'
import { Card } from '../ui/Card'
import type { AnalyticsSnapshot } from '../../types'

interface AnalyticsProps {
  analytics: AnalyticsSnapshot
}

export function Analytics({ analytics }: AnalyticsProps) {
  const metrics = [
    { label: 'Focus Score', value: analytics.focusScore, icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Energy Level', value: analytics.energyLevel, icon: Battery, color: 'text-green-500' },
    { label: 'Pronote Sync', value: analytics.pronoteSyncLevel, icon: RefreshCw, color: 'text-purple-500' },
    { label: 'Google Docs', value: analytics.googleDocsSynced, icon: FileText, color: 'text-yellow-500', isCount: true },
    { label: 'AI Insights', value: analytics.aiInsightsToday, icon: Sparkles, color: 'text-pink-500', isCount: true }
  ]

  return (
    <Card title="Analytics" subtitle="Placeholder for engagement patterns & workload trends">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map(metric => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${metric.color}`} />
                <span className="text-xs font-medium text-[var(--text-secondary)] uppercase">
                  {metric.label}
                </span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {metric.value}{metric.isCount ? '' : '%'}
              </div>
              {!metric.isCount && (
                <div className="mt-2 h-1.5 rounded-full bg-[var(--bg-tertiary)]">
                  <div
                    className={`h-full rounded-full ${metric.color.replace('text-', 'bg-')}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
