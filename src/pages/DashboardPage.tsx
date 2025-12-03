import { useQuery } from '@tanstack/react-query'
import { mockApi } from '../api/mockApi'
import { queryKeys } from '../api/queryKeys'
import { SmartFeed } from '../components/dashboard/SmartFeed'
import { DailyPlan } from '../components/dashboard/DailyPlan'
import { Analytics } from '../components/dashboard/Analytics'
import { useRealtimeSync } from '../hooks/useRealtimeSync'
import { RefreshCw } from 'lucide-react'

export function DashboardPage() {
  useRealtimeSync()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: mockApi.getDashboard
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-[var(--color-danger)]">
        Error loading dashboard: {error?.message || 'Unknown error'}
      </div>
    )
  }

  if (!data) {
    return <div className="p-6 text-center text-[var(--text-secondary)]">No data available.</div>
  }

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Proactive AI Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Stay ahead of your work with intelligent insights from Pronote, Google Docs, and AI.
        </p>
      </header>

      <Analytics analytics={data.analytics} />
      <DailyPlan plan={data.plan} />
      <SmartFeed insights={data.insights} />
    </div>
  )
}
