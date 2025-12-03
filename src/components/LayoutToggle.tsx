import { useLayoutStore } from '../store/layoutStore'
import type { LayoutMode } from '../types'

export function LayoutToggle() {
  const { mode, setMode } = useLayoutStore()

  const options: { label: string; value: LayoutMode; description: string }[] = [
    { label: 'Fixed Layout', value: 'fixed', description: 'Locked sections for focus' },
    { label: 'Customizable', value: 'customizable', description: 'Drag & drop components with resizing' }
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="inline-flex rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-1 shadow-inner">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => setMode(option.value)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${mode === option.value ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--text-secondary)]">
        {options.find(option => option.value === mode)?.description}
      </p>
    </div>
  )
}
