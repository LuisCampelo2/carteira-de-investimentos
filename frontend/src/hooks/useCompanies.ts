import { useEffect, useState } from 'react'
import type { Company } from '../data/types'
import { api } from '../utils/api'

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Company[]>('/api/companies')
      .then(setCompanies)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { companies, loading }
}
