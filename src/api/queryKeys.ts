export const queryKeys = {
  dashboard: ['dashboard'] as const,
  tasks: ['tasks'] as const,
  studySession: (id = 'default') => ['study-session', id] as const
}
