import { useMutation, useQuery } from '@tanstack/react-query'
import { mockApi } from '../../api/mockApi'
import { queryKeys } from '../../api/queryKeys'
import { DragDropProvider } from './DragDropProvider'
import { CanvasComponent } from './CanvasComponent'
import { useCanvasLayoutStore } from '../../store/canvasLayoutStore'
import { useLayoutStore } from '../../store/layoutStore'
import { AIAssistant } from './AIAssistant'
import { DocEditor } from './DocEditor'
import { RightPanel } from './RightPanel'
import { FileViewer } from './FileViewer'
import { Flashcards } from './Flashcards'
import { QuizPlaceholder } from './QuizPlaceholder'
import { EnvironmentControls } from './EnvironmentControls'
import { useEffect, useRef } from 'react'
import type { StudySession, ComponentLayout } from '../../types'

interface StudyCanvasProps {
  sessionId: string
  data: StudySession
  onAIPrompt: (prompt: string) => void
  onDocContentChange: (content: string) => void
  onChecklistToggle: (itemId: string) => void
  onEnvironmentChange: (env: Partial<StudySession['environment']>) => void
}

export function StudyCanvas({
  data,
  onAIPrompt,
  onDocContentChange,
  onChecklistToggle,
  onEnvironmentChange
}: Omit<StudyCanvasProps, 'sessionId'>) {
  const userId = 'default'
  const { mode } = useLayoutStore()
  const { layouts, setLayouts, updateLayout } = useCanvasLayoutStore()
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()

  // Load user preferences (layout configuration)
  const { data: preferences } = useQuery({
    queryKey: queryKeys.userPreferences(userId),
    queryFn: () => mockApi.getUserPreferences(userId)
  })

  // Save layout mutation
  const saveLayoutMutation = useMutation({
    mutationFn: (layouts: ComponentLayout[]) => mockApi.updateCanvasLayout(userId, layouts),
    onSuccess: () => {
      console.log('Layout saved successfully')
    }
  })

  // Initialize layouts from preferences
  useEffect(() => {
    if (preferences?.canvasLayout) {
      setLayouts(preferences.canvasLayout)
    }
  }, [preferences, setLayouts])

  const handleLayoutChange = (id: string, newLayout: ComponentLayout) => {
    updateLayout(id, newLayout)
    
    // Get the current updated layouts from store
    const currentLayouts = useCanvasLayoutStore.getState().layouts
    
    // Debounce save to avoid excessive API calls
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      saveLayoutMutation.mutate(currentLayouts)
    }, 500)
  }

  const getLayoutById = (id: string): ComponentLayout | undefined => {
    return layouts.find(layout => layout.id === id)
  }

  if (mode === 'fixed') {
    // Render fixed layout (original behavior)
    return (
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80">
          <AIAssistant suggestions={data.aiSuggestions} onPrompt={onAIPrompt} />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <DocEditor
              docId={data.docId}
              docTitle={data.docTitle}
              docOwner={data.docOwner}
              content={data.docContent}
              onContentChange={onDocContentChange}
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
            <FileViewer attachments={data.attachments} />
            <div className="grid md:grid-cols-2 border-t border-[var(--border-color)]">
              <Flashcards flashcards={data.flashcards} />
              <QuizPlaceholder quiz={data.quiz} />
            </div>
          </div>
        </main>

        <div className="w-80">
          <RightPanel
            calendar={data.calendar}
            checklist={data.checklist}
            onChecklistToggle={onChecklistToggle}
          />
        </div>
      </div>
    )
  }

  // Render customizable layout with drag-and-drop
  return (
    <DragDropProvider>
      <div className={`flex-1 relative overflow-hidden ${mode === 'customizable' ? 'grid-snap' : ''} bg-[var(--bg-secondary)]`}>
        {/* AI Assistant */}
        {getLayoutById('ai-assistant') && (
          <CanvasComponent
            id="ai-assistant"
            layout={getLayoutById('ai-assistant')!}
            onLayoutChange={(layout) => handleLayoutChange('ai-assistant', layout)}
          >
            <div className="h-full bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              <AIAssistant suggestions={data.aiSuggestions} onPrompt={onAIPrompt} />
            </div>
          </CanvasComponent>
        )}

        {/* Document Editor */}
        {getLayoutById('doc-editor') && (
          <CanvasComponent
            id="doc-editor"
            layout={getLayoutById('doc-editor')!}
            onLayoutChange={(layout) => handleLayoutChange('doc-editor', layout)}
          >
            <div className="h-full bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              <DocEditor
                docId={data.docId}
                docTitle={data.docTitle}
                docOwner={data.docOwner}
                content={data.docContent}
                onContentChange={onDocContentChange}
              />
            </div>
          </CanvasComponent>
        )}

        {/* Right Panel (Calendar & Tasks) */}
        {getLayoutById('right-panel') && (
          <CanvasComponent
            id="right-panel"
            layout={getLayoutById('right-panel')!}
            onLayoutChange={(layout) => handleLayoutChange('right-panel', layout)}
          >
            <div className="h-full bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              <RightPanel
                calendar={data.calendar}
                checklist={data.checklist}
                onChecklistToggle={onChecklistToggle}
              />
            </div>
          </CanvasComponent>
        )}

        {/* File Viewer */}
        {getLayoutById('file-viewer') && (
          <CanvasComponent
            id="file-viewer"
            layout={getLayoutById('file-viewer')!}
            onLayoutChange={(layout) => handleLayoutChange('file-viewer', layout)}
          >
            <div className="h-full bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              <div className="h-full overflow-y-auto">
                <FileViewer attachments={data.attachments} />
                <div className="grid md:grid-cols-2 border-t border-[var(--border-color)]">
                  <Flashcards flashcards={data.flashcards} />
                  <QuizPlaceholder quiz={data.quiz} />
                </div>
              </div>
            </div>
          </CanvasComponent>
        )}

        {/* Environment Controls (fixed at bottom) */}
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
          <EnvironmentControls
            environment={data.environment}
            onEnvironmentChange={onEnvironmentChange}
          />
        </div>
      </div>
    </DragDropProvider>
  )
}