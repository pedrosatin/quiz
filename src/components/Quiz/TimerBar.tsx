interface TimerBarProps {
  duration: number // seconds
  isRunning: boolean
  onExpire: () => void
  key: string | number // force remount to restart
}

import { useEffect, useRef, useState } from 'react'

export default function TimerBar({ duration, isRunning, onExpire }: TimerBarProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const expiredRef = useRef(false)

  useEffect(() => {
    setTimeLeft(duration)
    expiredRef.current = false
  }, [duration])

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          if (!expiredRef.current) {
            expiredRef.current = true
            onExpire()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, onExpire])

  const pct = (timeLeft / duration) * 100
  const isUrgent = timeLeft <= 5

  return (
    <div
      className="w-full"
      role="timer"
      aria-label={`${timeLeft} segundos restantes`}
      aria-live="off"
    >
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>⏱ Tempo</span>
        <span
          className={`font-bold transition-colors ${isUrgent ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isUrgent ? 'bg-red-500' : pct > 50 ? 'bg-green-500' : 'bg-yellow-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
