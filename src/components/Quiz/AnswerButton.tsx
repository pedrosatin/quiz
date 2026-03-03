import type { AnswerState } from '../../types'

interface AnswerButtonProps {
  label: string
  index: number
  state: AnswerState | 'neutral'
  disabled: boolean
  onClick: () => void
}

const KEY_LABELS = ['1', '2', '3', '4']

export default function AnswerButton({ label, index, state, disabled, onClick }: AnswerButtonProps) {
  const base =
    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-left'

  const styles: Record<string, string> = {
    idle: 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 active:scale-95',
    neutral:
      'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-default opacity-70',
    correct:
      'border-green-500 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 scale-[1.02] shadow-md cursor-default',
    wrong: 'border-red-400 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 cursor-default',
    timeout:
      'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default',
  }

  const icon: Record<string, string> = {
    correct: '✅',
    wrong: '❌',
    timeout: '',
    idle: '',
    neutral: '',
  }

  return (
    <button
      className={`${base} ${styles[state]}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Opção ${KEY_LABELS[index]}: ${label}`}
      aria-pressed={state === 'correct' || state === 'wrong' ? true : undefined}
    >
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold shrink-0">
        {KEY_LABELS[index]}
      </span>
      <span className="flex-1">{label}</span>
      {icon[state] && <span aria-hidden="true">{icon[state]}</span>}
    </button>
  )
}
