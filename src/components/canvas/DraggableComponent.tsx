import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useEffect } from 'react'
import { useCanvasLayoutStore } from '../store/canvasLayoutStore'
import type { ComponentLayout } from '../types'

interface DraggableComponentProps {
  id: string
  layout: ComponentLayout
  children: React.ReactNode
  onLayoutChange?: (layout: ComponentLayout) => void
  className?: string
}

export function DraggableComponent({
  id,
  layout,
  children,
  onLayoutChange,
  className = ''
}: DraggableComponentProps) {
  const { isDragging, setDragging, bringToFront } = useCanvasLayoutStore()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDraggingItem
  } = useDraggable({
    id,
    disabled: !layout.isDraggable
  })

  useEffect(() => {
    if (isDraggingItem) {
      setDragging(id)
      bringToFront(id)
    } else if (isDragging === id) {
      setDragging(null)
    }
  }, [isDraggingItem, id, isDragging, setDragging, bringToFront])

  useEffect(() => {
    if (transform && onLayoutChange) {
      const newLayout = {
        ...layout,
        x: layout.x + transform.x,
        y: layout.y + transform.y
      }
      onLayoutChange(newLayout)
    }
  }, [transform, layout, onLayoutChange])

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute' as const,
    left: layout.x,
    top: layout.y,
    width: layout.width,
    height: layout.height,
    zIndex: layout.zIndex,
    transition: isDraggingItem ? 'none' : 'all 0.2s ease',
    opacity: isDraggingItem ? 0.8 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        canvas-component
        ${layout.isDraggable ? 'draggable-area' : 'cursor-default'}
        ${isDraggingItem ? 'dragging shadow-2xl scale-105' : 'shadow-lg'}
        ${className}
      `}
      {...attributes}
      {...listeners}
    >
      {layout.isDraggable && (
        <div className="absolute top-2 left-2 z-10 opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-[var(--color-primary)] text-white rounded px-2 py-1 text-xs cursor-move flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
            Drag
          </div>
        </div>
      )}
      {children}
    </div>
  )
}