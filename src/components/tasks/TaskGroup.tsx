import { TaskCard } from './TaskCard'
import type { Task } from '../../types'

interface TaskGroupProps {
  title: string
  description: string
  tasks: Task[]
  onStatusChange: (taskId: string, status: Task['status']) => void
  onSubtaskToggle: (taskId: string, subtaskId: string, isDone: boolean) => void
}

export function TaskGroup({ title, description, tasks, onStatusChange, onSubtaskToggle }: TaskGroupProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onSubtaskToggle={onSubtaskToggle} />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)]">No tasks in this bucket.</p>
        )}
      </div>
    </section>
  )
}
