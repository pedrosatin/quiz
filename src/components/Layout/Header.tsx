import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity"
          aria-label="Logo Quiz — página inicial"
        >
          🏷️ Logo Quiz
        </Link>

        <nav className="flex items-center gap-2" aria-label="Navegação principal">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label="Ver dashboard de estatísticas"
          >
            📊 Dashboard
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  )
}
