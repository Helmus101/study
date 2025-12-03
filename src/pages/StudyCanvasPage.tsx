import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockApi } from '../api/mockApi'
import { queryKeys } from '../api/queryKeys'
import { StudyCanvas } from '../components/canvas/StudyCanvas'
import { useRealtimeSync } from '../hooks/useRealtimeSync'
import { LayoutToggle } from '../components/LayoutToggle'
import { RefreshCw } from 'lucide-react'
import type { StudySession } from '../types'

export function StudyCanvasPage() {
  const sessionId = 'default'
  useRealtimeSync(sessionId)
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.studySession(sessionId),
    queryFn: () => mockApi.getStudySession(sessionId)
  })

  const updateDocMutation = useMutation({
    mutationFn: (content: string) => mockApi.updateDocContent(data?.docId ?? '', content),
    onMutate: async newContent => {
      await queryClient.cancelQueries({ queryKey: queryKeys.studySession(sessionId) })
      const previous = queryClient.getQueryData(queryKeys.studySession(sessionId))
      queryClient.setQueryData(queryKeys.studySession(sessionId), (old: StudySession | undefined) =>
        old ? { ...old, docContent: newContent } : old
      )
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.studySession(sessionId), context.previous)
      }
    }
  })

  const updateChecklistMutation = useMutation({
    mutationFn: ({ itemId, completed }: { itemId: string; completed: boolean }) =>
      mockApi.updateChecklistItem(itemId, completed),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(queryKeys.studySession(sessionId), (old: StudySession | undefined) => {
        if (!old) return old
        return {
          ...old,
          checklist: old.checklist.map(item =>
            item.id === variables.itemId ? { ...item, completed: variables.completed } : item
          )
        }
      })
    }
  })

  const updateEnvironmentMutation = useMutation({
    mutationFn: (env: Partial<StudySession['environment']>) => mockApi.updateEnvironment(env),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(queryKeys.studySession(sessionId), (old: StudySession | undefined) => {
        if (!old) return old
        return {
          ...old,
          environment: { ...old.environment, ...variables }
        }
      })
    }
  })

  const handleAIPrompt = async (prompt: string) => {
    try {
      await mockApi.sendAiPrompt(prompt)
    } catch (error) {
      console.error('Failed to send AI prompt:', error)
    }
  }

  const handleChecklistToggle = (itemId: string) => {
    const item = data?.checklist.find(i => i.id === itemId)
    if (item) {
      updateChecklistMutation.mutate({ itemId, completed: !item.completed })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--color-danger)]">
        Error loading study session: {error?.message || 'Unknown error'}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--text-secondary)]">
        No study session data.
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-secondary)]">
      <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Study Session Canvas</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Full-screen workspace for deep focus with integrated AI assistance
          </p>
        </div>
        <div className="w-80">
          <LayoutToggle />
        </div>
      </header>

      <StudyCanvas
        sessionId={sessionId}
        data={data}
        onAIPrompt={handleAIPrompt}
        onDocContentChange={content => updateDocMutation.mutate(content)}
        onChecklistToggle={handleChecklistToggle}
        onEnvironmentChange={env => updateEnvironmentMutation.mutate(env)}
      />
    </div>
  )
}
