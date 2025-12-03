import { useEffect, useState } from 'react'
import { FileText, Save } from 'lucide-react'
import { Button } from '../ui/Button'

interface DocEditorProps {
  docId: string
  docTitle: string
  docOwner: string
  content: string
  onContentChange: (content: string) => void
}

export function DocEditor({ docId, docTitle, docOwner, content, onContentChange }: DocEditorProps) {
  const [localContent, setLocalContent] = useState(content)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setLocalContent(content)
  }, [content])

  const handleChange = (newContent: string) => {
    setLocalContent(newContent)
    setHasChanges(true)
  }

  const handleSave = () => {
    onContentChange(localContent)
    setHasChanges(false)
  }

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <header className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[var(--color-primary)]" />
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">{docTitle}</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Owner: {docOwner} | Doc ID: {docId}
            </p>
          </div>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} size="sm" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        )}
      </header>

      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        <textarea
          value={localContent}
          onChange={e => handleChange(e.target.value)}
          className="w-full h-full min-h-[600px] p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Start writing your document..."
        />
      </div>

      <footer className="border-t border-[var(--border-color)] px-6 py-3 text-xs text-[var(--text-secondary)]">
        <p>
          This editor is a mirror of your Google Doc. Changes sync bidirectionally via
          WebSocket mock.
        </p>
      </footer>
    </div>
  )
}
