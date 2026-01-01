// Base entity types
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// Layout types
export type LayoutMode = 'fixed' | 'customizable'

export interface ComponentLayout {
  id: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isResizable?: boolean
  isDraggable?: boolean
  minSize?: { width: number; height: number }
  maxSize?: { width: number; height: number }
}

export interface UserPreferences {
  id: string
  userId: string
  canvasLayout: ComponentLayout[]
  theme: 'light' | 'dark' | 'auto'
  createdAt: Date
  updatedAt: Date
}

// Dashboard types
export interface DashboardInsight {
  id: string
  title: string
  summary: string
  source: 'pronote' | 'google' | 'ai'
  sentiment: 'positive' | 'neutral' | 'warning'
  tags: string[]
  actionLabel?: string
}

export interface DashboardPlan {
  id: string
  title: string
  timeframe: 'morning' | 'afternoon' | 'evening'
  tasks: number
  completion: number
  focus: string
  recommendedStart: string
}

export interface DashboardAnalytics {
  focusScore: number
  energyLevel: number
  pronoteSyncLevel: number
  googleDocsSynced: number
  aiInsightsToday: number
}

export interface DashboardResponse {
  insights: DashboardInsight[]
  plan: DashboardPlan[]
  analytics: DashboardAnalytics
}

// Task types
export interface AISubtask {
  id: string
  label: string
  isDone: boolean
  source: 'ai'
  confidence: number
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'todo' | 'in_progress' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high'
  pronote: boolean
  course?: string
  tags: string[]
  aiGeneratedSubtasks: AISubtask[]
  attachments: string[]
  hasGoogleDoc: boolean
}

export interface TasksResponse {
  today: Task[]
  week: Task[]
  upcoming: Task[]
  overdue: Task[]
}

// Study Session Canvas types
export interface CalendarEvent {
  date: string
  focus: string
  workload: number
  highlightedTaskId?: string
}

export interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

export interface EnvironmentSettings {
  music?: string
  pomodoroPhase: 'focus' | 'break' | 'long_break'
  pomodoroRemaining: number
  scene: string
}

export interface Attachment {
  id: string
  name: string
  type: string
  updatedAt: string
}

export interface Flashcard {
  id: string
  prompt: string
  confidence: 'solid' | 'wobbly' | 'unknown'
}

export interface QuizOption {
  id: string
  text: string
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
  calendar: CalendarEvent[]
  checklist: ChecklistItem[]
  environment: EnvironmentSettings
  attachments: Attachment[]
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
}

// Anqer Lead Magnet types
export interface SnapshotSource {
  name: string
  url: string
  date: string
  snippet: string
}

export interface SnapshotResult {
  id: string
  entityName: string
  summary: string
  keyPoints: string[]
  sources: SnapshotSource[]
  analyzedAt: string
}

export interface SearchHistoryItem {
  entityName: string
  searchedAt: string
  resultId: string
}

export type SoftWallType = 'save' | 'monitor' | 'note' | null

export interface WaitlistSubmission {
  email: string
  submittedAt: string
  entityContext?: string
}