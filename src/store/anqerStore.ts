import { create } from 'zustand'
import type { SnapshotResult, SearchHistoryItem, SoftWallType, WaitlistSubmission } from '../types'

interface AnqerState {
  currentSnapshot: SnapshotResult | null
  searchHistory: SearchHistoryItem[]
  waitlistSubmission: WaitlistSubmission | null
  softWallType: SoftWallType
  emailConfirmationShown: boolean
  secondSearchRecognitionShown: boolean
  
  setCurrentSnapshot: (snapshot: SnapshotResult | null) => void
  addToSearchHistory: (item: SearchHistoryItem) => void
  setWaitlistSubmission: (submission: WaitlistSubmission) => void
  setSoftWallType: (type: SoftWallType) => void
  setEmailConfirmationShown: (shown: boolean) => void
  setSecondSearchRecognitionShown: (shown: boolean) => void
  clearSession: () => void
}

export const useAnqerStore = create<AnqerState>((set) => ({
  currentSnapshot: null,
  searchHistory: [],
  waitlistSubmission: null,
  softWallType: null,
  emailConfirmationShown: false,
  secondSearchRecognitionShown: false,
  
  setCurrentSnapshot: (snapshot) => set({ currentSnapshot: snapshot }),
  
  addToSearchHistory: (item) => set((state) => ({
    searchHistory: [...state.searchHistory, item]
  })),
  
  setWaitlistSubmission: (submission) => set({ 
    waitlistSubmission: submission,
    emailConfirmationShown: true
  }),
  
  setSoftWallType: (type) => set({ softWallType: type }),
  
  setEmailConfirmationShown: (shown) => set({ emailConfirmationShown: shown }),
  
  setSecondSearchRecognitionShown: (shown) => set({ secondSearchRecognitionShown: shown }),
  
  clearSession: () => set({
    currentSnapshot: null,
    searchHistory: [],
    waitlistSubmission: null,
    softWallType: null,
    emailConfirmationShown: false,
    secondSearchRecognitionShown: false
  })
}))
