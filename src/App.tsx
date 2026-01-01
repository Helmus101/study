import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardPage } from './pages/DashboardPage'
import { TaskManagerPage } from './pages/TaskManagerPage'
import { StudyCanvasPage } from './pages/StudyCanvasPage'
import { AnqerHomePage } from './pages/anqer/AnqerHomePage'
import { AnqerResultsPage } from './pages/anqer/AnqerResultsPage'
import { AnqerWaitlistPage } from './pages/anqer/AnqerWaitlistPage'
import { AnqerConfirmationPage } from './pages/anqer/AnqerConfirmationPage'
import { Navigation } from './components/Navigation'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[var(--bg-secondary)]">
          <Navigation />
          <Routes>
            <Route path="/" element={<AnqerHomePage />} />
            <Route path="/results" element={<AnqerResultsPage />} />
            <Route path="/waitlist" element={<AnqerWaitlistPage />} />
            <Route path="/confirmation" element={<AnqerConfirmationPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TaskManagerPage />} />
            <Route path="/canvas" element={<StudyCanvasPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
