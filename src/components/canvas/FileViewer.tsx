import { FileText, Presentation, Link, File as FileIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { StudyAttachment } from '../../types'

interface FileViewerProps {
  attachments: StudyAttachment[]
}

const typeIcons = {
  pdf: FileText,
  slide: Presentation,
  doc: FileIcon,
  link: Link
}

export function FileViewer({ attachments }: FileViewerProps) {
  return (
    <section className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <FileIcon className="w-4 h-4" />
        Attachments & References
      </h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {attachments.map(attachment => {
          const Icon = typeIcons[attachment.type]
          return (
            <button
              key={attachment.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-left hover:shadow transition"
            >
              <div className="p-2 rounded bg-[var(--bg-secondary)]">
                <Icon className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--text-primary)] truncate">{attachment.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Updated {format(parseISO(attachment.updatedAt), 'MMM d, h:mm a')}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
