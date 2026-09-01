import { BarChart3, X } from 'lucide-react'
import { ASSET_CLASSES, ASSET_CLASS_COLORS, formatBRLExact, type AssetClass } from '../../utils/finance'
import type { Company, InvestmentOption } from '../../data/types'
import { useInvestmentOptions } from '../../hooks/useInvestmentOptions'
import { useCompanies } from '../../hooks/useCompanies'
import { RefreshPricesButton } from '../ui/RefreshPricesButton'

const MONTHS_PT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

function formatReferenceMonth(iso: string): string {
  const [year, month] = iso.split('-')
  return `${MONTHS_PT[Number(month) - 1]}/${year}`
}

// Uma linha por ativo, com o que se sabe de real: preço (quando o ativo tem
// preço unitário público — ações/ETFs/FIIs/cripto) e o rendimento real que
// já é mostrado no simulador (dividendo/proventos ou taxa Selic/CDI/IPCA para
// os itens de Renda fixa do catálogo). Nunca mostra número que não
// veio de refresh real — some para "—" quando não tem.
function AtivoRow({ name, ticker, price, extra }: { name: string; ticker?: string; price?: number; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm">
      <div className="min-w-0">
        <div className="truncate font-medium text-slate-200">
          {name}
          {ticker && ticker !== name && <span className="ml-1.5 text-xs text-slate-500">{ticker}</span>}
        </div>
        {extra}
      </div>
      <div className="shrink-0 text-right">
        {price != null ? (
          <div className="font-semibold text-emerald-400">{formatBRLExact(price)}</div>
        ) : (
          <div className="text-xs text-slate-600">sem preço de cota</div>
        )}
      </div>
    </div>
  )
}

function CompanyExtra({ c }: { c: Company }) {
  const hasNextPayment = c.nextPaymentDate && c.nextPaymentAmount != null
  return (
    <>
      {hasNextPayment ? (
        <div className="text-xs text-slate-500">
          DY ≈{c.dividendYieldValue!.toFixed(1).replace('.', ',')}% a.a. · próximo {formatBRLExact(c.nextPaymentAmount!)}/un. em{' '}
          {c.nextPaymentDate!.split('-').reverse().join('/')}
          {c.realPaymentFrequency ? ` (${c.realPaymentFrequency})` : ''}
        </div>
      ) : c.dividendYieldValue != null ? (
        <div className="text-xs text-slate-500">
          {c.dividendYieldValue === 0
            ? `Sem dividendos nos últimos 12 meses${c.dividendReferenceMonth ? ` (dado de ${formatReferenceMonth(c.dividendReferenceMonth)})` : ''}`
            : `DY ≈${c.dividendYieldValue.toFixed(1).replace('.', ',')}% nos últimos 12 meses${c.dividendReferenceMonth ? ` (dado de ${formatReferenceMonth(c.dividendReferenceMonth)})` : ''}`}
        </div>
      ) : null}
      {/* A frequência já aparece dentro da linha acima quando há calendário real
          (realPaymentFrequency) — só mostra o texto genérico do payoutFrequency
          nos outros casos, senão fica repetido. */}
      {!hasNextPayment && c.payoutFrequency && <div className="text-xs text-slate-500">{c.payoutFrequency}</div>}
    </>
  )
}

function OptionExtra({ opt }: { opt: InvestmentOption }) {
  return (
    <>
      {opt.dividendYieldValue != null ? (
        <div className="text-xs text-slate-500">
          Rendeu {opt.dividendYieldValue.toFixed(2).replace('.', ',')}%
          {opt.dividendReferenceMonth ? ` em ${formatReferenceMonth(opt.dividendReferenceMonth)}` : ''} · Mensal
        </div>
      ) : opt.rateValue != null ? (
        <div className="text-xs text-slate-500">Taxa real ≈{opt.rateValue.toFixed(2).replace('.', ',')}% a.a. (Banco Central)</div>
      ) : opt.marketInfo ? (
        <div className="truncate text-xs text-slate-500">{opt.marketInfo}</div>
      ) : null}
      {/* Mensal já fica claro na linha de DY acima — só acrescenta o
          payoutFrequency quando ele traz frequência que ainda não apareceu. */}
      {opt.dividendYieldValue == null && opt.payoutFrequency && <div className="text-xs text-slate-500">{opt.payoutFrequency}</div>}
    </>
  )
}

export function AtivosView({ onClose }: { onClose: () => void }) {
  const { byClass, loading: optionsLoading, refetch: refetchOptions } = useInvestmentOptions()
  const { companies, loading: companiesLoading, refetch: refetchCompanies } = useCompanies()

  const optionsForClass = (cls: AssetClass): { key: string; name: string; ticker?: string; price?: number; extra: React.ReactNode }[] => {
    if (cls === 'Ações') {
      return companies.map((c) => ({ key: c.id, name: c.name, ticker: c.ticker, price: c.priceValue, extra: <CompanyExtra c={c} /> }))
    }
    return (byClass[cls] ?? []).map((opt) => ({ key: opt.id, name: opt.name, ticker: opt.ticker, price: opt.price, extra: <OptionExtra opt={opt} /> }))
  }

  const loading = optionsLoading || companiesLoading

  return (
    <div className="flex h-full w-full flex-col bg-slate-950">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <BarChart3 size={18} className="text-sky-400" /> Todos os Ativos
        </h2>
        <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
          <X size={18} />
        </button>
      </div>

      <div className="border-b border-slate-800 px-5 py-3">
        <RefreshPricesButton onRefreshed={() => Promise.all([refetchOptions(), refetchCompanies()])} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <p className="text-sm text-slate-500">Carregando ativos...</p>
        ) : (
          <div className="space-y-6">
            {ASSET_CLASSES.map((cls) => {
              const items = optionsForClass(cls)
              if (items.length === 0) return null
              return (
                <div key={cls}>
                  <div
                    className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: ASSET_CLASS_COLORS[cls] }}
                  >
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ASSET_CLASS_COLORS[cls] }} />
                    {cls} — {items.length} {items.length === 1 ? 'ativo' : 'ativos'}
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {items.map((item) => (
                      <AtivoRow key={item.key} name={item.name} ticker={item.ticker} price={item.price} extra={item.extra} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
