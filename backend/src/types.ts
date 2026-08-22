export interface CarteiraItem {
  id: string
  assetClass: string
  name: string
  ticker?: string
  monthlyAmount: number
  quantity?: number
  expectedIncome?: number
  expectedIncomeNote?: string
  rendaFixaTipo?: string
  rendaFixaTaxa?: string
  rendaFixaVencimento?: string
  rendaFixaAvisos?: string[]
  /** Annual rate (%) used to compound this item's own recurring monthly
   * purchase in the growth projection — the item's real dividend/FII yield
   * when we have one, otherwise the hypothetical risk-based rate. */
  estimatedAnnualRate?: number
}

export interface CarteiraState {
  id: number
  name: string
  items: CarteiraItem[]
  monthlyContribution: number
  initialAmount: number
  years: number
  objective: string
  risk: string
  estimatedAnnualRate?: number
  estimatedAnnualRateCoverage?: number
  updatedAt: string
}

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed'
