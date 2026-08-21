export type RiskTolerance = 'baixa' | 'media' | 'alta'

export type AssetClass =
  | 'Renda fixa'
  | 'ETFs'
  | 'Ações'
  | 'FIIs'
  | 'Fundos Multimercado'
  | 'Previdência Privada'
  | 'Debêntures'
  | 'Criptomoedas'

export const ASSET_CLASSES: AssetClass[] = [
  'Renda fixa',
  'ETFs',
  'Ações',
  'FIIs',
  'Fundos Multimercado',
  'Previdência Privada',
  'Debêntures',
  'Criptomoedas',
]

export const ASSET_CLASS_COLORS: Record<AssetClass, string> = {
  'Renda fixa': 'var(--color-brand-4)',
  ETFs: 'var(--color-brand-2)',
  Ações: 'var(--color-brand-1)',
  FIIs: 'var(--color-brand-5)',
  'Fundos Multimercado': 'var(--color-brand-3)',
  'Previdência Privada': 'var(--color-brand-8)',
  Debêntures: 'var(--color-brand-10)',
  Criptomoedas: 'var(--color-brand-6)',
}

export const ANNUAL_RATE_BY_RISK: Record<RiskTolerance, number> = {
  baixa: 0.08,
  media: 0.1,
  alta: 0.12,
}

export interface ProjectionPoint {
  year: number
  invested: number
  projected: number
}

// One recurring monthly purchase — e.g. "3x ITUB4 every month, R$114,60/mês,
// rendendo 8% a.a. real" — compounded on its own, at its own rate.
export interface GrowthStream {
  monthlyAmount: number
  annualRate: number
}

// Assumes the SAME purchases (same assets, same quantities) every month for
// the whole horizon, each compounding at its own real rate when we have one
// (falling back to the hypothetical risk rate only where we don't) — instead
// of a single blended rate applied to the whole contribution, which would
// silently apply one asset's real yield to money that isn't actually going
// into that asset. `initial` (patrimônio inicial) isn't tied to a specific
// asset in this simulator, so it compounds at `initialRate`.
export function simulatePortfolioGrowth(
  initial: number,
  initialRate: number,
  years: number,
  streams: GrowthStream[],
): ProjectionPoint[] {
  const initialMonthlyRate = Math.pow(1 + initialRate, 1 / 12) - 1
  const streamMonthlyRates = streams.map((s) => Math.pow(1 + s.annualRate, 1 / 12) - 1)

  let initialBalance = initial
  const streamBalances = streams.map(() => 0)
  let invested = initial

  const points: ProjectionPoint[] = [{ year: 0, invested, projected: initial }]

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      initialBalance *= 1 + initialMonthlyRate
      for (let i = 0; i < streams.length; i++) {
        streamBalances[i] = streamBalances[i] * (1 + streamMonthlyRates[i]) + streams[i].monthlyAmount
        invested += streams[i].monthlyAmount
      }
    }
    const projected = initialBalance + streamBalances.reduce((a, b) => a + b, 0)
    points.push({ year, invested, projected })
  }

  return points
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

// Same formatting, but keeps the exact cents — used for individual asset
// prices and the class budget math, so what's shown always matches exactly
// what gets deducted (formatBRL rounds to whole reais, which is fine for
// large aggregate totals but hides the real price of an asset).
export function formatBRLExact(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// "2026-08-31" -> "31/08/2026"
export function formatPaymentDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}
