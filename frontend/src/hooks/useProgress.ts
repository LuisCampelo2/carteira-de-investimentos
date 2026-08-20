import { useCallback, useEffect, useState } from 'react'
import type { ProgressStatus } from '../data/types'
import { aulas } from '../data/aulas'
import { api } from '../utils/api'

type ProgressMap = Record<string, ProgressStatus>

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({})

  useEffect(() => {
    api.get<ProgressMap>('/api/progress').then(setProgress).catch(console.error)
  }, [])

  const getStatus = useCallback(
    (aulaId: string): ProgressStatus => progress[aulaId] ?? 'not-started',
    [progress],
  )

  const persistStatus = useCallback((aulaId: string, status: ProgressStatus) => {
    api.put(`/api/progress/${encodeURIComponent(aulaId)}`, { status }).catch(console.error)
  }, [])

  const setStatus = useCallback(
    (aulaId: string, status: ProgressStatus) => {
      setProgress((prev) => ({ ...prev, [aulaId]: status }))
      persistStatus(aulaId, status)
    },
    [persistStatus],
  )

  const markStarted = useCallback(
    (aulaId: string) => {
      setProgress((prev) => {
        if (prev[aulaId] && prev[aulaId] !== 'not-started') return prev
        persistStatus(aulaId, 'in-progress')
        return { ...prev, [aulaId]: 'in-progress' }
      })
    },
    [persistStatus],
  )

  const markCompleted = useCallback(
    (aulaId: string) => {
      setProgress((prev) => ({ ...prev, [aulaId]: 'completed' }))
      persistStatus(aulaId, 'completed')
    },
    [persistStatus],
  )

  const completedCount = aulas.filter((a) => progress[a.id] === 'completed').length

  return { progress, getStatus, setStatus, markStarted, markCompleted, completedCount, total: aulas.length }
}
