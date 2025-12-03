import { Calendar, CheckCircle2, Circle, FileText, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { Task } from '../../types'
import { useState } from 'react'

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: Task['status']) => void
  onSubtaskToggle: (taskId: string, subtaskId: string, isDone: boolean) => void
}

const priorityColors = {
  low: 'info',
  medium: 'warning',
  high: 'danger'
} as const

export function TaskCard({ task, onStatusChange, onSubtaskToggle }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
      <header className="flex items-start gap-3">
        <button
          onClick={() =>
            onStatusChange(task.id, task.status === 'done' ? 'todo' : 'done')
          }
          className="mt-0.5 text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition"
        >
          {task.status === 'done' ? (
            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1">
          <h4 className={`font-semibold ${task.status === 'done' ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
            {task.title}
          </h4>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{task.description}</p>
        </div>
      </header>

      <div className="flex items-center gap-2 flex-wrap text-sm text-[var(--text-secondary)]">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {format(new Date(task.dueDate), 'MMM d, yyyy')}
        </span>
        {task.course && <span>• {task.course}</span>}
        {task.hasGoogleDoc && (
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Google Doc
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={priorityColors[task.priority]}>
          {task.priority} priority
        </Badge>
        {task.pronote && (
          <Badge variant="info">Pronote</Badge>
        )}
        {task.tags.map(tag => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>

      {task.aiGeneratedSubtasks.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            <Sparkles className="w-4 h-4" />
            AI Subtasks ({task.aiGeneratedSubtasks.filter(s => s.isDone).length}/
            {task.aiGeneratedSubtasks.length})
          </button>
          {expanded && (
            <ul className="mt-2 space-y-2">
              {task.aiGeneratedSubtasks.map(subtask => (
                <li key={subtask.id} className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => onSubtaskToggle(task.id, subtask.id, !subtask.isDone)}
                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
                  >
                    {subtask.isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <span
                    className={`text-sm ${subtask.isDone ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}
                  >
                    {subtask.label}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {Math.round(subtask.confidence * 100)}% confidence
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <footer className="flex gap-2">
        <Button size="sm" variant="ghost" className="flex-1">
          View Details
        </Button>
        {task.hasGoogleDoc && (
          <Button size="sm" variant="secondary" className="flex-1">
            Open in Canvas
          </Button>
        )}
      </footer>
    </article>
  )
}
