import { useState, useCallback, useRef, useEffect } from 'react'
import { useCanvasLayoutStore } from '../store/canvasLayoutStore'
import type { ComponentLayout } from '../types'

interface ResizableComponentProps {
  id: string
  layout: ComponentLayout
  children: React.ReactNode
  onLayoutChange?: (layout: ComponentLayout) => void
  className?: string
}

export function ResizableComponent({
  id,
  layout,
  children,
  onLayoutChange,
  className = ''
}: ResizableComponentProps) {
  const { isResizing, setResizing, bringToFront } = useCanvasLayoutStore()
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const resizeHandle = useRef<'right' | 'bottom' | 'corner' | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: 'right' | 'bottom' | 'corner') => {
    if (!layout.isResizable) return

    e.preventDefault()
    e.stopPropagation()
    
    resizeHandle.current = handle
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: layout.width,
      height: layout.height
    }
    
    setResizing(id)
    bringToFront(id)
  }, [layout, id, setResizing, bringToFront])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeHandle.current || !isResizing) return

      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y

      let newWidth = startPos.current.width
      let newHeight = startPos.current.height

      switch (resizeHandle.current) {
        case 'right':
          newWidth = Math.max(layout.minSize?.width || 200, startPos.current.width + deltaX)
          break
        case 'bottom':
          newHeight = Math.max(layout.minSize?.height || 150, startPos.current.height + deltaY)
          break
        case 'corner':
          newWidth = Math.max(layout.minSize?.width || 200, startPos.current.width + deltaX)
          newHeight = Math.max(layout.minSize?.height || 150, startPos.current.height + deltaY)
          break
      }

      // Apply max size constraints
      if (layout.maxSize) {
        newWidth = Math.min(newWidth, layout.maxSize.width)
        newHeight = Math.min(newHeight, layout.maxSize.height)
      }

      const newLayout = {
        ...layout,
        width: newWidth,
        height: newHeight
      }

      onLayoutChange?.(newLayout)
    }

    const handleMouseUp = () => {
      resizeHandle.current = null
      if (isResizing === id) {
        setResizing(null)
      }
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, id, layout, onLayoutChange, setResizing])

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full h-full overflow-hidden
        ${layout.isResizable ? 'resize-enabled' : ''}
        ${isHovering && layout.isResizable ? 'resize-hover' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      
      {layout.isResizable && (
        <>
          {/* Right resize handle */}
          <div
            className="resize-handle absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-500 hover:opacity-50 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'right')}
          />
          
          {/* Bottom resize handle */}
          <div
            className="resize-handle absolute bottom-0 left-0 w-full h-2 cursor-ns-resize hover:bg-blue-500 hover:opacity-50 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'bottom')}
          />
          
          {/* Corner resize handle */}
          <div
            className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-blue-500 hover:opacity-50 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'corner')}
          />
        </>
      )}
    </div>
  )
}