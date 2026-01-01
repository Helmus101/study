import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardPage } from './pages/DashboardPage'
import { TaskManagerPage } from './pages/TaskManagerPage'
import { StudyCanvasPage } from './pages/StudyCanvasPage'
import { AnqerHomePage } from './pages/AnqerHomePage'
import { AnqerResultsPage } from './pages/AnqerResultsPage'
import { AnqerWaitlistPage } from './pages/AnqerWaitlistPage'
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

function AppRoutes() {
  const location = useLocation()
  const isAnqerRoute = location.pathname.startsWith('/anqer')

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {!isAnqerRoute && <Navigation />}
      <Routes>
        <Route path="/" element={<Navigate to="/anqer" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TaskManagerPage />} />
        <Route path="/canvas" element={<StudyCanvasPage />} />
        <Route path="/anqer" element={<AnqerHomePage />} />
        <Route path="/anqer/results" element={<AnqerResultsPage />} />
        <Route path="/anqer/waitlist" element={<AnqerWaitlistPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
