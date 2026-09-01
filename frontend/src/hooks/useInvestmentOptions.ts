import { useCallback, useEffect, useState } from 'react'
import { ASSET_CLASSES, type AssetClass } from '../utils/finance'
import type { InvestmentOption } from '../data/types'
import { api } from '../utils/api'

function emptyByClass(): Record<AssetClass, InvestmentOption[]> {
  return Object.fromEntries(ASSET_CLASSES.map((cls) => [cls, [] as InvestmentOption[]])) as Record<
    AssetClass,
    InvestmentOption[]
  >
}

export function useInvestmentOptions() {
  const [byClass, setByClass] = useState<Record<AssetClass, InvestmentOption[]>>(() => emptyByClass())
  const [loading, setLoading] = useState(true)

  // Returns the fresh grouped data directly (not just void) so a caller that
  // needs to compute something with the just-refreshed values right away
  // (e.g. "Atualizar" recomputing a saved carteira) doesn't hit a stale
  // closure by reading `byClass` from state immediately after awaiting this.
  const refetch = useCallback(() => {
    return api
      .get<InvestmentOption[]>('/api/investment-options')
      .then((options) => {
        const grouped = emptyByClass()
        for (const opt of options) {
          if (grouped[opt.assetClass as AssetClass]) grouped[opt.assetClass as AssetClass].push(opt)
        }
        setByClass(grouped)
        return grouped
      })
      .catch((err) => {
        console.error(err)
        return emptyByClass()
      })
  }, [])

  useEffect(() => {
    refetch().finally(() => setLoading(false))
  }, [refetch])

  return { byClass, loading, refetch }
}
