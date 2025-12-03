import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { mockSocket } from '../api/mockSocket'
import { queryKeys } from '../api/queryKeys'
import type { DashboardResponse, StudySession } from '../types'

export function useRealtimeSync(sessionId = 'default') {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = mockSocket.subscribe(message => {
      if (message.channel === 'pronote') {
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks })
      }

      if (message.channel === 'google') {
        queryClient.setQueryData(queryKeys.studySession(sessionId), (prev: StudySession | undefined) => {
          if (!prev) return prev
          return { ...prev, docContent: `${prev.docContent}\n\n${message.payload.content}` }
        })
      }

      if (message.channel === 'ai') {
        queryClient.setQueryData(queryKeys.dashboard, (prev: DashboardResponse | undefined) => {
          if (!prev) return prev
          return {
            ...prev,
            insights: [message.payload.insight, ...prev.insights].slice(0, 10)
          }
        })
      }
    })

    return () => unsubscribe()
  }, [queryClient, sessionId])
}
