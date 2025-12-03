import { create } from 'zustand'
import type { LayoutMode } from '../types'

interface LayoutState {
  mode: LayoutMode
  toggleMode: () => void
  setMode: (mode: LayoutMode) => void
}

export const useLayoutStore = create<LayoutState>((set) => ({
  mode: 'fixed',
  toggleMode: () => set((state) => ({ mode: state.mode === 'fixed' ? 'customizable' : 'fixed' })),
  setMode: (mode) => set({ mode })
}))
