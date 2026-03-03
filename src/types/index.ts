export interface Logo {
  id: string
  name: string
  category: string
  imageUrl: string
  simpleIconsSlug: string
  difficulty: 'fácil' | 'médio' | 'difícil'
  yearFounded: number
  country: string
}

export interface LogosData {
  version: string
  totalLogos: number
  categories: string[]
  logos: Logo[]
}

export interface QuizQuestion {
  logo: Logo
  options: string[]
  correctAnswer: string
}

export interface QuizAnswerRecord {
  logoId: string
  logoName: string
  correct: boolean
  timeMs: number
}

export interface QuizSession {
  id: string
  category: string
  date: string
  score: number
  totalQuestions: number
  timeSpentSeconds: number
  questions: QuizAnswerRecord[]
}

export interface CategoryProgress {
  usedIds: string[]
  totalInCategory: number
  cycleCount: number
  lastPlayed: string
}

export interface Analytics {
  sessions: QuizSession[]
  totalCorrect: number
  totalAnswered: number
  logoStats: Record<string, { correct: number; wrong: number }>
}

export interface Settings {
  theme: 'light' | 'dark'
  difficulty: 'all' | 'easy' | 'medium' | 'hard'
}

export type AnswerState = 'idle' | 'correct' | 'wrong' | 'timeout'

export interface CategoryStat {
  category: string
  correct: number
  answered: number
  accuracy: number
}
