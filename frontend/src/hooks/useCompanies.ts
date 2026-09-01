import { useCallback, useEffect, useState } from 'react'
import type { Company } from '../data/types'
import { api } from '../utils/api'

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  // Returns the fresh array directly — see the identical comment in
  // useInvestmentOptions.refetch for why (avoids a stale-closure read).
  const refetch = useCallback(() => {
    return api
      .get<Company[]>('/api/companies')
      .then((next) => {
        setCompanies(next)
        return next
      })
      .catch((err) => {
        console.error(err)
        return [] as Company[]
      })
  }, [])

  useEffect(() => {
    refetch().finally(() => setLoading(false))
  }, [refetch])

  return { companies, loading, refetch }
}
