import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Bell, PenLine, ExternalLink, Brain } from 'lucide-react'
import { useAnqerStore } from '../../store/useAnqerStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { SoftWallModal } from '../../components/anqer/SoftWallModal'

export function AnqerResultsPage() {
  const navigate = useNavigate()
  const { currentSnapshot, openSoftWall, isSoftWallOpen, waitlist } = useAnqerStore()

  if (!currentSnapshot) {
    navigate('/')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <Badge variant="outline" className="mb-2">Current Context Snapshot</Badge>
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            {currentSnapshot.entityName}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Generated on {new Date(currentSnapshot.timestamp).toLocaleString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openSoftWall('save')}>
            <Save className="w-4 h-4 mr-2" />
            Remember
          </Button>
          <Button variant="outline" size="sm" onClick={() => openSoftWall('monitor')}>
            <Bell className="w-4 h-4 mr-2" />
            Monitor
          </Button>
          <Button variant="outline" size="sm" onClick={() => openSoftWall('note')}>
            <PenLine className="w-4 h-4 mr-2" />
            Private Note
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="p-8">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Snapshot Analysis</h2>
          <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-6">
            {currentSnapshot.analysis}
          </p>
          
          <h3 className="font-medium mb-3 text-[var(--text-primary)]">Key Insights</h3>
          <ul className="space-y-3">
            {currentSnapshot.keyInsights.map((insight, i) => (
              <li key={i} className="flex items-start gap-3 text-[var(--text-secondary)]">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-8">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Sources & Attribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSnapshot.sources.map((source, i) => (
              <a 
                key={i} 
                href={source.url}
                className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] hover:border-[var(--color-primary)] transition group"
              >
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{source.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{source.type}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--color-primary)]" />
              </a>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-16 pt-12 border-t border-[var(--border-color)] text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--border-color)] mb-6">
          <Brain className="w-8 h-8 text-[var(--color-primary)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          This is a one-time snapshot.
        </h2>
        <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
          Anqer becomes powerful when it remembers. Don't let this context fade away.
        </p>
        
        {!waitlist.isJoined ? (
          <div className="max-w-md mx-auto">
            <Button size="lg" className="w-full" onClick={() => navigate('/waitlist')}>
              Want Anqer to remember this person for you?
            </Button>
          </div>
        ) : (
          <p className="text-[var(--color-primary)] font-medium">
            You're on the waitlist. We'll notify you when memory unlocks.
          </p>
        )}
      </div>

      {isSoftWallOpen && <SoftWallModal />}
    </div>
  )
}
