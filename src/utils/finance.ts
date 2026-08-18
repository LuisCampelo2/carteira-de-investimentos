export type RiskTolerance = 'baixa' | 'media' | 'alta'

export type AssetClass = 'Renda fixa' | 'ETFs' | 'Ações' | 'FIIs'

export const ASSET_CLASSES: AssetClass[] = ['Renda fixa', 'ETFs', 'Ações', 'FIIs']

export const ASSET_CLASS_COLORS: Record<AssetClass, string> = {
  'Renda fixa': 'var(--color-brand-4)',
  ETFs: 'var(--color-brand-2)',
  Ações: 'var(--color-brand-1)',
  FIIs: 'var(--color-brand-5)',
}

export interface Allocation {
  label: AssetClass
  percent: number
  color: string
}

const PRESETS: Record<RiskTolerance, Record<AssetClass, number>> = {
  baixa: { 'Renda fixa': 65, ETFs: 20, Ações: 10, FIIs: 5 },
  alta: { 'Renda fixa': 15, ETFs: 30, Ações: 45, FIIs: 10 },
  media: { 'Renda fixa': 40, ETFs: 25, Ações: 20, FIIs: 15 },
}

export function getAllocationPreset(risk: RiskTolerance): Record<AssetClass, number> {
  return { ...PRESETS[risk] }
}

export function getAllocation(risk: RiskTolerance): Allocation[] {
  const preset = PRESETS[risk] ?? PRESETS.media
  return ASSET_CLASSES.map((label) => ({ label, percent: preset[label], color: ASSET_CLASS_COLORS[label] }))
}

const ANNUAL_RATE_BY_RISK: Record<RiskTolerance, number> = {
  baixa: 0.08,
  media: 0.1,
  alta: 0.12,
}

export interface ProjectionPoint {
  year: number
  invested: number
  projected: number
}

export function simulateGrowth(
  initial: number,
  monthly: number,
  years: number,
  risk: RiskTolerance,
): ProjectionPoint[] {
  const annualRate = ANNUAL_RATE_BY_RISK[risk]
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1

  const points: ProjectionPoint[] = [{ year: 0, invested: initial, projected: initial }]
  let balance = initial
  let invested = initial

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthly
      invested += monthly
    }
    points.push({ year, invested, projected: balance })
  }

  return points
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
