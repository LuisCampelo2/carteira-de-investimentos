import { useCallback, useEffect, useState } from 'react'
import type { ProgressStatus } from '../data/types'
import { aulas } from '../data/aulas'

const STORAGE_KEY = 'mmi:progresso'

type ProgressMap = Record<string, ProgressStatus>

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ProgressMap
  } catch {
    return {}
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const getStatus = useCallback(
    (aulaId: string): ProgressStatus => progress[aulaId] ?? 'not-started',
    [progress],
  )

  const setStatus = useCallback((aulaId: string, status: ProgressStatus) => {
    setProgress((prev) => ({ ...prev, [aulaId]: status }))
  }, [])

  const markStarted = useCallback(
    (aulaId: string) => {
      setProgress((prev) => {
        if (prev[aulaId] && prev[aulaId] !== 'not-started') return prev
        return { ...prev, [aulaId]: 'in-progress' }
      })
    },
    [],
  )

  const markCompleted = useCallback((aulaId: string) => {
    setProgress((prev) => ({ ...prev, [aulaId]: 'completed' }))
  }, [])

  const completedCount = aulas.filter((a) => progress[a.id] === 'completed').length

  return { progress, getStatus, setStatus, markStarted, markCompleted, completedCount, total: aulas.length }
}
