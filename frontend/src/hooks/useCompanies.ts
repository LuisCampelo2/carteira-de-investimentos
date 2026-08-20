import { useCallback, useEffect, useState } from 'react'
import type { Company } from '../data/types'
import { api } from '../utils/api'

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(() => {
    return api.get<Company[]>('/api/companies').then(setCompanies).catch(console.error)
  }, [])

  useEffect(() => {
    refetch().finally(() => setLoading(false))
  }, [refetch])

  return { companies, loading, refetch }
}
