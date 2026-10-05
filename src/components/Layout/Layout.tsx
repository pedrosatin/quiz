import type { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      <footer className="max-w-4xl mx-auto px-4 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Criado por{' '}
        <a
          href="https://github.com/pedrosatin"
          className="underline hover:opacity-80 transition-opacity"
        >
          @pedrosatin
        </a>
      </footer>
    </div>
  )
}
