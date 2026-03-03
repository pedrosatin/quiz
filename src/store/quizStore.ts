import { create } from 'zustand'
import type { Logo, QuizQuestion, QuizAnswerRecord, Settings } from '../types'

interface QuizState {
  // Data
  allLogos: Logo[]
  brandColors: Record<string, string>
  isDataLoaded: boolean
  dataError: string | null

  // Session config
  selectedCategory: string | null
  settings: Settings

  // Active quiz round
  questions: QuizQuestion[]
  currentIndex: number
  answers: QuizAnswerRecord[]
  roundStartTime: number | null
  questionStartTime: number | null

  // Actions
  setAllLogos: (logos: Logo[], colors: Record<string, string>) => void
  setDataError: (error: string) => void
  setSelectedCategory: (category: string | null) => void
  setSettings: (settings: Partial<Settings>) => void
  startRound: (questions: QuizQuestion[]) => void
  recordAnswer: (answer: QuizAnswerRecord) => void
  advanceQuestion: () => void
  resetRound: () => void
}

export const useQuizStore = create<QuizState>((set) => ({
  allLogos: [],
  brandColors: {},
  isDataLoaded: false,
  dataError: null,

  selectedCategory: null,
  settings: { theme: 'light', difficulty: 'all' },

  questions: [],
  currentIndex: 0,
  answers: [],
  roundStartTime: null,
  questionStartTime: null,

  setAllLogos: (logos, colors) =>
    set({ allLogos: logos, brandColors: colors, isDataLoaded: true }),

  setDataError: (error) => set({ dataError: error }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSettings: (partial) =>
    set((state) => ({ settings: { ...state.settings, ...partial } })),

  startRound: (questions) =>
    set({
      questions,
      currentIndex: 0,
      answers: [],
      roundStartTime: Date.now(),
      questionStartTime: Date.now(),
    }),

  recordAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),

  advanceQuestion: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      questionStartTime: Date.now(),
    })),

  resetRound: () =>
    set({
      questions: [],
      currentIndex: 0,
      answers: [],
      roundStartTime: null,
      questionStartTime: null,
    }),
}))
