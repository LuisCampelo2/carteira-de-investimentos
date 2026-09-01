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
  payoutFrequency?: string
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
  /** % of monthlyContribution set aside for each class in the wizard (e.g.
   * {"Ações": 70, "FIIs": 20, "Renda fixa": 10}) — the per-class ceiling
   * "Editar ativos" must respect when adding an asset outside the wizard. */
  classPercents?: Record<string, number>
  updatedAt: string
}

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed'
