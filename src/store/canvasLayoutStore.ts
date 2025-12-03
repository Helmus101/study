import { create } from 'zustand'
import type { ComponentLayout } from '../types'

interface CanvasLayoutState {
  layouts: ComponentLayout[]
  isDragging: string | null
  isResizing: string | null
  setLayouts: (layouts: ComponentLayout[]) => void
  updateLayout: (id: string, updates: Partial<ComponentLayout>) => void
  setDragging: (id: string | null) => void
  setResizing: (id: string | null) => void
  bringToFront: (id: string) => void
  snapToGrid: (value: number, layout: ComponentLayout) => ComponentLayout
}

const GRID_SIZE = 20

export const useCanvasLayoutStore = create<CanvasLayoutState>((set) => ({
  layouts: [],
  isDragging: null,
  isResizing: null,

  setLayouts: (layouts) => set({ layouts }),

  updateLayout: (id, updates) => set((state) => ({
    layouts: state.layouts.map(layout =>
      layout.id === id ? { ...layout, ...updates } : layout
    )
  })),

  setDragging: (id) => set({ isDragging: id }),

  setResizing: (id) => set({ isResizing: id }),

  bringToFront: (id) => set((state) => {
    const maxZ = Math.max(...state.layouts.map(l => l.zIndex))
    return {
      layouts: state.layouts.map(layout =>
        layout.id === id ? { ...layout, zIndex: maxZ + 1 } : layout
      )
    }
  }),

  snapToGrid: (_value, layout) => {
    const snapped = {
      ...layout,
      x: Math.round(layout.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(layout.y / GRID_SIZE) * GRID_SIZE,
      width: Math.round(layout.width / GRID_SIZE) * GRID_SIZE,
      height: Math.round(layout.height / GRID_SIZE) * GRID_SIZE
    }

    // Apply size constraints
    if (layout.minSize) {
      snapped.width = Math.max(snapped.width, layout.minSize.width)
      snapped.height = Math.max(snapped.height, layout.minSize.height)
    }
    if (layout.maxSize) {
      snapped.width = Math.min(snapped.width, layout.maxSize.width)
      snapped.height = Math.min(snapped.height, layout.maxSize.height)
    }

    return snapped
  }
}))