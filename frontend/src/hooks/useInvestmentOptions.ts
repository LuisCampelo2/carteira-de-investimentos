import { useEffect, useState } from 'react'
import { ASSET_CLASSES, type AssetClass } from '../utils/finance'
import type { InvestmentOption } from '../data/types'
import { api } from '../utils/api'

export function useInvestmentOptions() {
  const [byClass, setByClass] = useState<Record<AssetClass, InvestmentOption[]>>(() =>
    Object.fromEntries(ASSET_CLASSES.map((cls) => [cls, [] as InvestmentOption[]])) as Record<AssetClass, InvestmentOption[]>,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<InvestmentOption[]>('/api/investment-options')
      .then((options) => {
        const grouped = Object.fromEntries(ASSET_CLASSES.map((cls) => [cls, [] as InvestmentOption[]])) as Record<
          AssetClass,
          InvestmentOption[]
        >
        for (const opt of options) {
          if (grouped[opt.assetClass as AssetClass]) grouped[opt.assetClass as AssetClass].push(opt)
        }
        setByClass(grouped)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { byClass, loading }
}
