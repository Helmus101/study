import { useNavigate } from 'react-router-dom'
import { X, Lock } from 'lucide-react'
import { useAnqerStore } from '../../store/useAnqerStore'
import { Button } from '../ui/Button'

export function SoftWallModal() {
  const navigate = useNavigate()
  const { softWallTrigger, closeSoftWall } = useAnqerStore()

  const getMessage = () => {
    switch (softWallTrigger) {
      case 'save':
        return 'To remember this snapshot forever, Anqer needs a memory core.'
      case 'monitor':
        return 'Real-time monitoring requires continuous memory synchronization.'
      case 'note':
        return 'Private notes are woven into the long-term memory of an entity.'
      default:
        return 'This feature requires Anqer Memory.'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-primary)] rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={closeSoftWall}
          className="absolute right-6 top-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-[var(--color-primary)]" />
          </div>

          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Memory is currently locked
          </h2>
          
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            {getMessage()} Join the waitlist to be among the first to unlock permanent memory.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => {
                closeSoftWall()
                navigate('/waitlist')
              }}
            >
              Request Access
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-[var(--text-secondary)]"
              onClick={closeSoftWall}
            >
              Maybe later
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
