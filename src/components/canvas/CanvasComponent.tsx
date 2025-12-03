import { useState } from 'react'
import { DraggableComponent } from './DraggableComponent'
import { ResizableComponent } from './ResizableComponent'
import { useCanvasLayoutStore } from '../store/canvasLayoutStore'
import type { ComponentLayout } from '../types'

interface CanvasComponentProps {
  id: string
  layout: ComponentLayout
  children: React.ReactNode
  onLayoutChange?: (layout: ComponentLayout) => void
  className?: string
}

export function CanvasComponent({
  id,
  layout,
  children,
  onLayoutChange,
  className = ''
}: CanvasComponentProps) {
  const { snapToGrid } = useCanvasLayoutStore()
  const [currentLayout, setCurrentLayout] = useState(layout)

  const handleLayoutChange = (newLayout: ComponentLayout) => {
    const snappedLayout = snapToGrid(20, newLayout)
    setCurrentLayout(snappedLayout)
    onLayoutChange?.(snappedLayout)
  }

  return (
    <DraggableComponent
      id={id}
      layout={currentLayout}
      onLayoutChange={handleLayoutChange}
      className={className}
    >
      <ResizableComponent
        id={id}
        layout={currentLayout}
        onLayoutChange={handleLayoutChange}
      >
        {children}
      </ResizableComponent>
    </DraggableComponent>
  )
}