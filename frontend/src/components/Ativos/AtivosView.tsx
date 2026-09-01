import { BarChart3, X } from 'lucide-react'
import { ASSET_CLASSES, ASSET_CLASS_COLORS, formatBRLExact, type AssetClass } from '../../utils/finance'
import { describePayout, companyToOption } from '../../utils/carteiraItemCompute'
import type { InvestmentOption } from '../../data/types'
import { useInvestmentOptions } from '../../hooks/useInvestmentOptions'
import { useCompanies } from '../../hooks/useCompanies'
import { RefreshPricesButton } from '../ui/RefreshPricesButton'

// Uma linha por ativo, sempre com as mesmas 3 coisas — preço de compra,
// retorno estimado (só quando existe dado real) e frequência — as mesmas que
// aparecem no assistente e no "Editar ativos" (describePayout), pra não
// mostrar informação diferente dependendo de onde você está olhando o ativo.
function AtivoRow({ cls, opt }: { cls: AssetClass; opt: InvestmentOption }) {
  const payout = describePayout(cls, opt, 0)
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm">
      <div className="min-w-0">
        <div className="truncate font-medium text-slate-200">
          {opt.name}
          {opt.ticker && opt.ticker !== opt.name && <span className="ml-1.5 text-xs text-slate-500">{opt.ticker}</span>}
        </div>
        {payout.returnLabel && <div className="text-xs text-emerald-400">Retorno: {payout.returnLabel}</div>}
        {payout.frequencyLabel && <div className="text-xs text-slate-500">{payout.frequencyLabel}</div>}
      </div>
      <div className="shrink-0 text-right">
        {opt.price != null ? (
          <div className="font-semibold text-emerald-400">{formatBRLExact(opt.price)}</div>
        ) : (
          <div className="text-xs text-slate-600">sem preço de cota</div>
        )}
      </div>
    </div>
  )
}

export function AtivosView({ onClose }: { onClose: () => void }) {
  const { byClass, loading: optionsLoading, refetch: refetchOptions } = useInvestmentOptions()
  const { companies, loading: companiesLoading, refetch: refetchCompanies } = useCompanies()

  const optionsForClass = (cls: AssetClass): InvestmentOption[] =>
    cls === 'Ações' ? companies.map(companyToOption) : (byClass[cls] ?? [])

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
                    {items.map((opt) => (
                      <AtivoRow key={opt.id} cls={cls} opt={opt} />
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
