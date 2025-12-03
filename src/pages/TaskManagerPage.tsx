import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockApi } from '../api/mockApi'
import { queryKeys } from '../api/queryKeys'
import { TaskGroup } from '../components/tasks/TaskGroup'
import { LayoutToggle } from '../components/LayoutToggle'
import { useLayoutStore } from '../store/layoutStore'
import type { Task } from '../types'
import { RefreshCw } from 'lucide-react'

export function TaskManagerPage() {
  const { mode } = useLayoutStore()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.tasks,
    queryFn: mockApi.getTasks
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: Task['status'] }) =>
      mockApi.updateTask(taskId, status),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(queryKeys.tasks, (previous: typeof data) => {
        if (!previous) return previous
        const updateTasks = (tasks: Task[]) =>
          tasks.map(task =>
            task.id === variables.taskId
              ? {
                  ...task,
                  status: variables.status
                }
              : task
          )

        return {
          today: updateTasks(previous.today),
          week: updateTasks(previous.week),
          upcoming: updateTasks(previous.upcoming),
          overdue: updateTasks(previous.overdue)
        }
      })
    }
  })

  const updateSubtaskMutation = useMutation({
    mutationFn: ({ taskId, subtaskId, isDone }: { taskId: string; subtaskId: string; isDone: boolean }) =>
      mockApi.updateSubtask(taskId, subtaskId, isDone),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(queryKeys.tasks, (previous: typeof data) => {
        if (!previous) return previous
        const updateSubtasks = (tasks: Task[]) =>
          tasks.map(task =>
            task.id === variables.taskId
              ? {
                  ...task,
                  aiGeneratedSubtasks: task.aiGeneratedSubtasks.map(subtask =>
                    subtask.id === variables.subtaskId
                      ? { ...subtask, isDone: variables.isDone }
                      : subtask
                  )
                }
              : task
          )

        return {
          today: updateSubtasks(previous.today),
          week: updateSubtasks(previous.week),
          upcoming: updateSubtasks(previous.upcoming),
          overdue: updateSubtasks(previous.overdue)
        }
      })
    }
  })

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    updateTaskMutation.mutate({ taskId, status })
  }

  const handleSubtaskToggle = (taskId: string, subtaskId: string, isDone: boolean) => {
    updateSubtaskMutation.mutate({ taskId, subtaskId, isDone })
  }

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
        Error loading tasks: {error?.message || 'Unknown error'}
      </div>
    )
  }

  if (!data) {
    return <div className="p-6 text-center text-[var(--text-secondary)]">No tasks available.</div>
  }

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Task Manager</h1>
        <p className="text-[var(--text-secondary)]">
          Tasks grouped by urgency with Pronote badges and AI-generated subtasks.
        </p>
        <LayoutToggle />
        {mode === 'customizable' && (
          <p className="text-xs text-[var(--text-secondary)]">
            Customizable layout mode will allow drag & resize in production. Fixed layout keeps sections
            anchored for now.
          </p>
        )}
      </header>

      <div className={`grid gap-6 ${mode === 'fixed' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        <TaskGroup
          title="Today"
          description="What needs attention before midnight"
          tasks={data.today}
          onStatusChange={handleStatusChange}
          onSubtaskToggle={handleSubtaskToggle}
        />
        <TaskGroup
          title="This Week"
          description="Plan and pre-act on upcoming work"
          tasks={data.week}
          onStatusChange={handleStatusChange}
          onSubtaskToggle={handleSubtaskToggle}
        />
        <TaskGroup
          title="Upcoming"
          description="Scheduled items in your horizon"
          tasks={data.upcoming}
          onStatusChange={handleStatusChange}
          onSubtaskToggle={handleSubtaskToggle}
        />
        <TaskGroup
          title="Overdue"
          description="Items Pronote flagged as late"
          tasks={data.overdue}
          onStatusChange={handleStatusChange}
          onSubtaskToggle={handleSubtaskToggle}
        />
      </div>
    </div>
  )
}
