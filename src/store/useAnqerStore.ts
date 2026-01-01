import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SnapshotResult, SearchHistoryItem, WaitlistState } from '../types'

interface AnqerStore {
  waitlist: WaitlistState
  searchHistory: SearchHistoryItem[]
  currentSnapshot: SnapshotResult | null
  isSoftWallOpen: boolean
  softWallTrigger: 'save' | 'monitor' | 'note' | null
  
  // Actions
  joinWaitlist: (email: string) => void
  confirmEmail: () => void
  addSearchHistory: (query: string) => void
  setCurrentSnapshot: (snapshot: SnapshotResult | null) => void
  openSoftWall: (trigger: 'save' | 'monitor' | 'note') => void
  closeSoftWall: () => void
  resetStore: () => void
}

export const useAnqerStore = create<AnqerStore>()(
  persist(
    (set) => ({
      waitlist: {
        isJoined: false,
        email: null,
        confirmed: false,
      },
      searchHistory: [],
      currentSnapshot: null,
      isSoftWallOpen: false,
      softWallTrigger: null,

      joinWaitlist: (email: string) =>
        set((state) => ({
          waitlist: { ...state.waitlist, isJoined: true, email },
        })),

      confirmEmail: () =>
        set((state) => ({
          waitlist: { ...state.waitlist, confirmed: true },
        })),

      addSearchHistory: (query: string) =>
        set((state) => ({
          searchHistory: [
            { query, timestamp: new Date().toISOString() },
            ...state.searchHistory,
          ],
        })),

      setCurrentSnapshot: (snapshot: SnapshotResult | null) =>
        set({ currentSnapshot: snapshot }),

      openSoftWall: (trigger: 'save' | 'monitor' | 'note') =>
        set({ isSoftWallOpen: true, softWallTrigger: trigger }),

      closeSoftWall: () =>
        set({ isSoftWallOpen: false, softWallTrigger: null }),

      resetStore: () =>
        set({
          waitlist: { isJoined: false, email: null, confirmed: false },
          searchHistory: [],
          currentSnapshot: null,
          isSoftWallOpen: false,
          softWallTrigger: null,
        }),
    }),
    {
      name: 'anqer-storage',
      partialize: (state) => ({
        waitlist: state.waitlist,
        searchHistory: state.searchHistory,
      }),
    }
  )
)
