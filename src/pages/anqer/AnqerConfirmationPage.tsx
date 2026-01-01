import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, Brain } from 'lucide-react'
import { useAnqerStore } from '../../store/useAnqerStore'
import { mockSendConfirmationEmail } from '../../api/mockAnqerApi'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

export function AnqerConfirmationPage() {
  const navigate = useNavigate()
  const { waitlist, confirmEmail } = useAnqerStore()

  useEffect(() => {
    if (!waitlist.isJoined || !waitlist.email) {
      navigate('/waitlist')
      return
    }

    const sendEmail = async () => {
      await mockSendConfirmationEmail(waitlist.email!)
      confirmEmail()
    }

    sendEmail()
  }, [waitlist.isJoined, waitlist.email, navigate, confirmEmail])

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Card className="p-12 text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-primary)]" />
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Mail className="w-20 h-20 text-[var(--color-primary)]" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
              1
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
          Check your inbox
        </h1>
        
        <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed">
          We've sent a magic link to <span className="font-semibold text-[var(--text-primary)]">{waitlist.email}</span>. 
          Confirming your email secures your place in line and begins the memory synchronization process.
        </p>

        <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 mb-10 text-left">
          <div className="flex items-center gap-3 mb-4 text-[var(--color-primary)]">
            <Brain className="w-6 h-6" />
            <span className="font-bold uppercase tracking-wider text-sm">Psychological Ownership</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            This person will be waiting.
          </h2>
          <p className="text-[var(--text-secondary)]">
            By joining the waitlist, you've already started a mental thread. 
            Once you have access, Anqer will bridge the gap between this moment and permanent memory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Search
          </Button>
          <Button onClick={() => window.open('https://gmail.com', '_blank')}>
            Open Email App
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Card>
      
      <p className="mt-8 text-center text-[var(--text-secondary)]">
        Didn't receive it? Check your spam folder or <button className="underline hover:text-[var(--text-primary)]">click here to resend</button>.
      </p>
    </div>
  )
}
