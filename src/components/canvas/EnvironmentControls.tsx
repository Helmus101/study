import { Headphones, Timer, Palette, SkipForward } from 'lucide-react'
import { Button } from '../ui/Button'
import type { StudyEnvironment } from '../../types'

interface EnvironmentControlsProps {
  environment: StudyEnvironment
  onEnvironmentChange: (partial: Partial<StudyEnvironment>) => void
}

export function EnvironmentControls({ environment, onEnvironmentChange }: EnvironmentControlsProps) {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] px-6 py-4 grid gap-4 md:grid-cols-3">
      <div className="flex items-center gap-3">
        <Headphones className="w-5 h-5 text-[var(--color-primary)]" />
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Study Music</p>
          <p className="font-semibold text-[var(--text-primary)]">{environment.music}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => onEnvironmentChange({ music: 'Lo-fi Beta Mix' })}>
          Switch
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Timer className="w-5 h-5 text-[var(--color-primary)]" />
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Pomodoro</p>
          <p className="font-semibold text-[var(--text-primary)]">
            {environment.pomodoroPhase === 'focus' ? 'Focus' : 'Break'} -
            {Math.floor(environment.pomodoroRemaining / 60)} min left
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => onEnvironmentChange({ pomodoroPhase: environment.pomodoroPhase === 'focus' ? 'break' : 'focus' })}>
          Toggle
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Palette className="w-5 h-5 text-[var(--color-primary)]" />
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Scene</p>
          <p className="font-semibold text-[var(--text-primary)]">{environment.scene}</p>
        </div>
        <Button size="sm" variant="ghost" className="flex items-center gap-1" onClick={() => onEnvironmentChange({ scene: 'Forest Focus' })}>
          <SkipForward className="w-4 h-4" />
          Cycle
        </Button>
      </div>
    </footer>
  )
}
