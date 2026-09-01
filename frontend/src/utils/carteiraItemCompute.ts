import { ANNUAL_RATE_BY_RISK, formatBRLExact, formatPaymentDate, type AssetClass } from './finance'
import type { CarteiraItem, InvestmentOption } from '../data/types'

const MONTHS_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

function formatReferenceMonth(iso: string): string {
  const [year, month] = iso.split('-')
  return `${MONTHS_PT[Number(month) - 1]}/${year}`
}

// Mirrors PortfolioSimulator's expectedIncome/annualYieldPercent — kept here
// so "Atualizar" (refresh a saved carteira's values) and "Editar" (add an
// asset to a saved carteira) can reuse the exact same real-data-only rules
// without going through the wizard.

export function expectedIncomeFor(cls: AssetClass, opt: InvestmentOption, qty: number, unit: number): number | null {
  if (qty <= 0) return null
  if (opt.nextPaymentAmount != null && opt.nextPaymentDate) return opt.nextPaymentAmount * qty
  if (cls === 'FIIs' && opt.dividendYieldValue != null && opt.dividendReferenceMonth) {
    return unit * (opt.dividendYieldValue / 100) * qty
  }
  return null
}

export function annualYieldPercentFor(cls: AssetClass, opt: InvestmentOption): number | null {
  if (opt.dividendYieldValue == null) return null
  if (cls === 'FIIs') return (Math.pow(1 + opt.dividendYieldValue / 100, 12) - 1) * 100
  if (cls === 'Ações') return opt.dividendYieldValue
  return null
}

/** Real unit price when known (stocks/ETFs/FIIs), otherwise null — caller decides the fallback. */
export function unitPriceFor(opt: InvestmentOption): number | null {
  return opt.price ?? null
}

export interface PayoutDisplay {
  /** e.g. "≈ R$12,34/mês" or "R$45,67 em 21/12" — null when there's no real
   * data to compute a return from (never a guessed number). */
  returnLabel: string | null
  /** e.g. "Mensal" or "Trimestral (JCP antecipado por trimestre)..." — the
   * real inferred frequency when a payment calendar exists, else the
   * catalog's generic frequency text, else null. */
  frequencyLabel: string | null
}

/** The exact 3 things a card should show about an asset's payout: purchase
 * price (handled separately by the caller via opt.price), estimated return,
 * and how often — condensed from whichever real data source is available
 * (brapi.dev calendar > FII monthly CVM yield > stock trailing DY), never
 * inventing a number for classes without one. */
export function describePayout(cls: AssetClass, opt: InvestmentOption, qty: number): PayoutDisplay {
  const unit = opt.price ?? 0
  const frequencyLabel = opt.realPaymentFrequency ?? opt.payoutFrequency ?? null
  const forUnit = qty > 0 ? '' : '/un.'
  const effectiveQty = qty > 0 ? qty : 1

  if (opt.nextPaymentAmount != null && opt.nextPaymentDate) {
    return {
      returnLabel: `${formatBRLExact(opt.nextPaymentAmount * effectiveQty)}${forUnit} em ${formatPaymentDate(opt.nextPaymentDate)}`,
      frequencyLabel,
    }
  }
  if (cls === 'FIIs' && opt.dividendYieldValue != null && opt.dividendReferenceMonth) {
    return {
      returnLabel: `≈ ${formatBRLExact(unit * (opt.dividendYieldValue / 100) * effectiveQty)}${forUnit}/mês`,
      frequencyLabel,
    }
  }
  if (cls === 'Ações' && opt.dividendYieldValue != null) {
    if (opt.dividendYieldValue === 0) return { returnLabel: 'Sem dividendos nos últimos 12 meses', frequencyLabel }
    return {
      returnLabel: `≈ ${formatBRLExact(unit * (opt.dividendYieldValue / 100) * effectiveQty)}${forUnit}/ano`,
      frequencyLabel,
    }
  }
  // Renda fixa (tesouro-selic/cdb/tesouro-ipca): não tem preço de cota nem
  // quantidade — o "retorno" aqui é a taxa real (Banco Central), não um R$.
  if (opt.rateValue != null) {
    return { returnLabel: `≈${opt.rateValue.toFixed(2).replace('.', ',')}% a.a. (Banco Central)`, frequencyLabel }
  }
  return { returnLabel: null, frequencyLabel }
}

/** Same mapping used by PortfolioSimulator/MinhaCarteira to turn a company
 * row into the generic InvestmentOption shape describePayout/buildItemFromOption expect. */
export function companyToOption(c: {
  id: string
  name: string
  ticker: string
  whatItDoes: string
  priceApprox?: string
  payoutFrequency?: string
  priceValue?: number
  dividendYieldValue?: number
  dividendReferenceMonth?: string
  nextPaymentDate?: string
  nextPaymentAmount?: number
  nextPaymentLabel?: string
  realPaymentFrequency?: string
}): InvestmentOption {
  return {
    id: c.id,
    assetClass: 'Ações',
    name: c.name,
    ticker: c.ticker,
    description: c.whatItDoes,
    marketInfo: c.priceApprox,
    payoutFrequency: c.payoutFrequency,
    price: c.priceValue,
    dividendYieldValue: c.dividendYieldValue,
    dividendReferenceMonth: c.dividendReferenceMonth,
    nextPaymentDate: c.nextPaymentDate,
    nextPaymentAmount: c.nextPaymentAmount,
    nextPaymentLabel: c.nextPaymentLabel,
    realPaymentFrequency: c.realPaymentFrequency,
  }
}

export const FALLBACK_RATE_PERCENT = ANNUAL_RATE_BY_RISK.media * 100

/** Builds a CarteiraItem for `opt` × `qty`, using its real price/dividend data when known. */
export function buildItemFromOption(cls: AssetClass, opt: InvestmentOption, qty: number, monthlyAmountOverride?: number): CarteiraItem {
  const unit = unitPriceFor(opt) ?? monthlyAmountOverride ?? 0
  const monthlyAmount = unitPriceFor(opt) != null ? unit * qty : (monthlyAmountOverride ?? 0)
  const income = expectedIncomeFor(cls, opt, qty, unit)
  const note = income == null
    ? undefined
    : opt.nextPaymentDate
      ? `próximo pagamento em ${formatPaymentDate(opt.nextPaymentDate)}`
      : opt.dividendReferenceMonth
        ? `estimativa mensal, base ${formatReferenceMonth(opt.dividendReferenceMonth)}`
        : undefined

  return {
    id: `${cls}:${opt.id}`,
    assetClass: cls,
    name: opt.name,
    ticker: opt.ticker,
    quantity: unitPriceFor(opt) != null ? qty : undefined,
    monthlyAmount,
    expectedIncome: income ?? undefined,
    expectedIncomeNote: note,
    estimatedAnnualRate: annualYieldPercentFor(cls, opt) ?? FALLBACK_RATE_PERCENT,
    payoutFrequency: opt.payoutFrequency,
  }
}

/** One item's contribution to the weighted-average rate, tagging whether its
 * rate is real (known at build time, before collapsing to the item's single
 * `estimatedAnnualRate` number — the persisted item alone can't tell real
 * from hypothetical afterwards, so callers must pass this in fresh). */
export interface RateEntry {
  monthlyAmount: number
  annualRatePercent: number
  real: boolean
}

/** Weighted-average annual rate + real-data coverage across a carteira's
 * items, plus any unallocated leftover of the monthly contribution (always
 * counted as hypothetical) — mirrors portfolioAnnualRate in PortfolioSimulator. */
export function weightedRateAndCoverage(
  entries: RateEntry[],
  monthlyContribution: number,
): { rate: number; coveragePercent: number } {
  const entriesMonthly = entries.reduce((s, e) => s + e.monthlyAmount, 0)
  const leftover = Math.max(0, monthlyContribution - entriesMonthly)
  const totalMonthly = entriesMonthly + leftover
  if (totalMonthly <= 0) return { rate: FALLBACK_RATE_PERCENT, coveragePercent: 0 }

  const weightedRate =
    (entries.reduce((s, e) => s + e.monthlyAmount * e.annualRatePercent, 0) + leftover * FALLBACK_RATE_PERCENT) /
    totalMonthly
  const coveredMonthly = entries.filter((e) => e.real).reduce((s, e) => s + e.monthlyAmount, 0)
  return { rate: weightedRate, coveragePercent: (coveredMonthly / totalMonthly) * 100 }
}
