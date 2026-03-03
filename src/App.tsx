import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useQuizStore } from './store/quizStore'
import { loadLogos, loadBrandColors } from './utils/dataLoader'
import { useTheme } from './hooks/useTheme'
import Layout from './components/Layout/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import DashboardPage from './pages/DashboardPage'

function AppInit() {
  const { setAllLogos, setDataError } = useQuizStore()
  useTheme() // applies saved theme on mount

  useEffect(() => {
    Promise.all([loadLogos(), loadBrandColors()])
      .then(([data, colors]) => setAllLogos(data.logos, colors))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setDataError(msg)
      })
  }, [setAllLogos, setDataError])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit />
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/quiz"
              element={
                <ErrorBoundary>
                  <QuizPage />
                </ErrorBoundary>
              }
            />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  )
}
