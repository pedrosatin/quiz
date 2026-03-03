import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Algo deu errado
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
              {this.state.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm"
            >
              Recarregar
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
