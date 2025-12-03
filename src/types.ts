export type LayoutMode = 'fixed' | 'customizable'

export type InsightSource = 'pronote' | 'google' | 'ai'

export interface DashboardInsight {
  id: string
  title: string
  summary: string
  source: InsightSource
  sentiment: 'positive' | 'neutral' | 'warning'
  tags: string[]
  actionLabel?: string
}

export interface PlanCard {
  id: string
  title: string
  timeframe: 'morning' | 'afternoon' | 'evening'
  tasks: number
  completion: number
  focus: string
  recommendedStart: string
}

export interface AnalyticsSnapshot {
  focusScore: number
  energyLevel: number
  pronoteSyncLevel: number
  googleDocsSynced: number
  aiInsightsToday: number
}

export interface Subtask {
  id: string
  label: string
  isDone: boolean
  source: InsightSource
  confidence: number
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'todo' | 'in_progress' | 'done' | 'overdue'
  priority: 'low' | 'medium' | 'high'
  pronote: boolean
  course?: string
  tags: string[]
  aiGeneratedSubtasks: Subtask[]
  attachments: string[]
  hasGoogleDoc: boolean
}

export interface CalendarDay {
  date: string
  focus: string
  workload: number
  highlightedTaskId?: string
}

export interface StudyChecklistItem {
  id: string
  label: string
  completed: boolean
}

export interface StudyEnvironment {
  music: string
  pomodoroPhase: 'focus' | 'break'
  pomodoroRemaining: number
  scene: string
}

export interface StudyAttachment {
  id: string
  name: string
  type: 'pdf' | 'slide' | 'doc' | 'link'
  updatedAt: string
}

export interface Flashcard {
  id: string
  prompt: string
  confidence: 'solid' | 'wobbly' | 'unknown'
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  answer: number
}

export interface StudySession {
  id: string
  docId: string
  docTitle: string
  docOwner: string
  docContent: string
  focusArea: string
  aiSuggestions: string[]
  calendar: CalendarDay[]
  checklist: StudyChecklistItem[]
  environment: StudyEnvironment
  attachments: StudyAttachment[]
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
}

export interface DashboardResponse {
  insights: DashboardInsight[]
  plan: PlanCard[]
  analytics: AnalyticsSnapshot
}

export interface TasksResponse {
  today: Task[]
  week: Task[]
  upcoming: Task[]
  overdue: Task[]
}

export type RealtimeMessage =
  | {
      channel: 'pronote'
      payload: { taskId: string; status: Task['status'] }
    }
  | {
      channel: 'google'
      payload: { docId: string; content: string }
    }
  | {
      channel: 'ai'
      payload: { insight: DashboardInsight }
    }
