import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ChevronLeft, Coins, Download, Minus, PiggyBank, Plus, Settings2, Trash2, X } from 'lucide-react'
import type { CarteiraItem, CarteiraState, InvestmentOption } from '../../data/types'
import {
  ASSET_CLASSES,
  ASSET_CLASS_COLORS,
  ANNUAL_RATE_BY_RISK,
  formatBRL,
  formatBRLExact,
  formatPaymentDate,
  simulatePortfolioGrowth,
  type AssetClass,
  type RiskTolerance,
} from '../../utils/finance'
import { buildItemFromOption, annualYieldPercentFor, describePayout, weightedRateAndCoverage, FALLBACK_RATE_PERCENT } from '../../utils/carteiraItemCompute'
import { useInvestmentOptions } from '../../hooks/useInvestmentOptions'
import { useCompanies } from '../../hooks/useCompanies'
import { RefreshPricesButton } from '../ui/RefreshPricesButton'

import { PortfolioSimulator } from '../PortfolioSimulator/PortfolioSimulator'

// Same mapping PortfolioSimulator uses to turn a company row into a generic
// InvestmentOption — duplicated here (not imported) because it's defined
// inline inside that component, not exported.
function companyToOption(c: ReturnType<typeof useCompanies>['companies'][number]): InvestmentOption {
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

function CarteiraDetail({
  carteira,
  onBack,
  onEdit,
  onDelete,
  onRemoveItem,
  onUpdateCarteira,
}: {
  carteira: CarteiraState
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onRemoveItem: (itemId: string) => void
  onUpdateCarteira: (id: number, next: Omit<CarteiraState, 'id'>) => Promise<CarteiraState>
}) {
  const { byClass: baseOptionsByClass, refetch: refetchOptions } = useInvestmentOptions()
  const { companies, refetch: refetchCompanies } = useCompanies()
  const [addAtivosOpen, setAddAtivosOpen] = useState(false)
  const [addClass, setAddClass] = useState<AssetClass>('Ações')
  const [addQty, setAddQty] = useState(1)
  const [addAmount, setAddAmount] = useState(0)
  const [addSaving, setAddSaving] = useState(false)

  const optionsForClass = (cls: AssetClass): InvestmentOption[] =>
    cls === 'Ações' ? companies.map(companyToOption) : baseOptionsByClass[cls] ?? []

  // Re-derives an item's up-to-date rate/real-ness against a given options
  // snapshot (either freshly refetched, for "Atualizar", or whatever's
  // currently loaded, for adding an asset) — the item alone can't tell real
  // from hypothetical once persisted (see estimatedAnnualRate on the type),
  // so this is the one place both flows re-check it against live data.
  const rateEntryFor = (
    item: CarteiraItem,
    byClass: Record<AssetClass, InvestmentOption[]>,
    companiesList: typeof companies,
  ): { entry: { monthlyAmount: number; annualRatePercent: number; real: boolean }; updated: CarteiraItem } => {
    const fallback = {
      entry: { monthlyAmount: item.monthlyAmount, annualRatePercent: item.estimatedAnnualRate ?? FALLBACK_RATE_PERCENT, real: false },
      updated: item,
    }
    if (item.assetClass === 'Renda fixa' || item.id.startsWith('rf-')) return fallback

    const optId = item.id.slice(item.id.indexOf(':') + 1)
    const cls = item.assetClass as AssetClass
    let opt: InvestmentOption | undefined
    if (cls === 'Ações') {
      const company = companiesList.find((c) => c.id === optId)
      opt = company ? companyToOption(company) : undefined
    } else {
      opt = byClass[cls]?.find((o) => o.id === optId)
    }
    if (!opt || opt.price == null || item.quantity == null) return fallback

    const updated = buildItemFromOption(cls, opt, item.quantity)
    return {
      entry: {
        monthlyAmount: updated.monthlyAmount,
        annualRatePercent: updated.estimatedAnnualRate ?? FALLBACK_RATE_PERCENT,
        real: annualYieldPercentFor(cls, opt) != null,
      },
      updated,
    }
  }

  const saveWithRecomputedRate = (items: CarteiraItem[], byClass: Record<AssetClass, InvestmentOption[]>, companiesList: typeof companies) => {
    const rateEntries = items.map((i) => rateEntryFor(i, byClass, companiesList).entry)
    const { rate, coveragePercent } = weightedRateAndCoverage(rateEntries, carteira.monthlyContribution)
    return onUpdateCarteira(carteira.id, {
      name: carteira.name,
      items,
      monthlyContribution: carteira.monthlyContribution,
      initialAmount: carteira.initialAmount,
      years: carteira.years,
      objective: carteira.objective,
      risk: carteira.risk,
      estimatedAnnualRate: rate,
      estimatedAnnualRateCoverage: coveragePercent,
      classPercents: carteira.classPercents,
      updatedAt: new Date().toISOString(),
    })
  }

  // "Atualizar": re-pulls fresh prices/dividendos/taxas e recalcula só os
  // valores de cada ativo já escolhido (preço × quantidade salva, rendimento
  // esperado, taxa) — nunca muda quais ativos estão na carteira. Itens sem
  // preço público (Renda fixa, customizados) ficam como estão: não há como
  // recalcular sem inventar um número.
  const handleAtualizado = async () => {
    const [freshByClass, freshCompanies] = await Promise.all([refetchOptions(), refetchCompanies()])
    const newItems = carteira.items.map((item) => rateEntryFor(item, freshByClass, freshCompanies).updated)
    await saveWithRecomputedRate(newItems, freshByClass, freshCompanies)
  }

  const addOptions = optionsForClass(addClass)
  const alreadyAddedIds = new Set(
    carteira.items.filter((i) => i.assetClass === addClass).map((i) => i.id.slice(i.id.indexOf(':') + 1)),
  )

  // Teto da classe = % que você separou pra ela no assistente (persistido em
  // classPercents) × aporte mensal — o mesmo valor que o assistente respeita
  // ao montar a carteira, agora respeitado aqui também. Carteiras salvas
  // antes de classPercents existir não têm esse dado: nesse caso não trava
  // (null = sem teto conhecido) em vez de bloquear tudo em zero.
  const classBudget =
    carteira.classPercents?.[addClass] != null ? (carteira.monthlyContribution * carteira.classPercents[addClass]) / 100 : null
  const classSpentNow = carteira.items
    .filter((i) => i.assetClass === addClass)
    .reduce((sum, i) => sum + i.monthlyAmount, 0)
  const classRemaining = classBudget == null ? Infinity : Math.max(0, classBudget - classSpentNow)

  const addCost = (opt: InvestmentOption): number => (opt.price != null ? opt.price * addQty : addAmount)

  const handleAddAtivo = async (opt: InvestmentOption) => {
    if (addCost(opt) > classRemaining + 0.005) return
    setAddSaving(true)
    try {
      const newItem = buildItemFromOption(addClass, opt, addQty, addAmount)
      await saveWithRecomputedRate([...carteira.items, newItem], baseOptionsByClass, companies)
      setAddQty(1)
      setAddAmount(0)
    } finally {
      setAddSaving(false)
    }
  }

  const totalMonthly = useMemo(() => carteira.items.reduce((sum, i) => sum + i.monthlyAmount, 0), [carteira])

  const percentByClass = useMemo(() => {
    if (totalMonthly === 0) return {} as Record<string, number>
    const map: Record<string, number> = {}
    for (const item of carteira.items) {
      map[item.assetClass] = (map[item.assetClass] || 0) + item.monthlyAmount
    }
    for (const key of Object.keys(map)) map[key] = (map[key] / totalMonthly) * 100
    return map
  }, [carteira, totalMonthly])

  const incomeSummary = useMemo(() => {
    let total = 0
    let withData = 0
    let withoutData = 0
    for (const item of carteira.items) {
      if (item.expectedIncome != null) {
        total += item.expectedIncome
        withData++
      } else {
        withoutData++
      }
    }
    return { total, withData, withoutData }
  }, [carteira])

  // Taxa média exibida no resumo — calculada quando a carteira foi montada
  // (ver portfolioAnnualRate no PortfolioSimulator); carteiras salvas antes
  // dessa funcionalidade não têm esse dado, então caem de volta na taxa
  // hipotética do risco.
  const effectiveRatePercent = useMemo(
    () => carteira.estimatedAnnualRate ?? ANNUAL_RATE_BY_RISK[(carteira.risk as RiskTolerance) || 'media'] * 100,
    [carteira],
  )

  // Só a estimativa final (sem o gráfico visual) — mesma lógica de streams
  // por item do PortfolioSimulator: cada ativo rende na sua própria taxa
  // real quando tem uma, o resto (e qualquer sobra do aporte) na hipotética.
  const projection = useMemo(() => {
    const fallbackRate = ANNUAL_RATE_BY_RISK[(carteira.risk as RiskTolerance) || 'media']
    const streams = carteira.items.map((item) => ({
      monthlyAmount: item.monthlyAmount,
      annualRate: (item.estimatedAnnualRate ?? fallbackRate * 100) / 100,
    }))
    const leftover = carteira.monthlyContribution - totalMonthly
    if (leftover > 0.005) streams.push({ monthlyAmount: leftover, annualRate: fallbackRate })
    const points = simulatePortfolioGrowth(carteira.initialAmount, fallbackRate, carteira.years, streams)
    return points[points.length - 1]
  }, [carteira, totalMonthly])

  return (
    <div className="space-y-4">
      <div className="no-print flex items-center justify-between gap-2">
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200">
          <ChevronLeft size={14} /> Todas as carteiras
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAddAtivosOpen((v) => !v)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
              addAtivosOpen ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Settings2 size={13} /> Editar ativos
          </button>
          <button
            onClick={() => window.print()}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Baixar carteira em PDF"
            title="Baixar carteira em PDF"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Excluir a carteira "${carteira.name}"?`)) onDelete()
            }}
            className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-800 hover:text-rose-400"
          >
            Excluir carteira
          </button>
        </div>
      </div>

      <div className="no-print">
        <RefreshPricesButton onRefreshed={handleAtualizado} />
      </div>

      {addAtivosOpen && (
        <div className="no-print space-y-3 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-medium text-slate-200">Adicionar ativo</div>
            <select
              value={addClass}
              onChange={(e) => {
                setAddClass(e.target.value as AssetClass)
                setAddQty(1)
                setAddAmount(0)
              }}
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 text-sm text-slate-200 outline-none focus:border-sky-500"
            >
              {ASSET_CLASSES.filter((c) => c !== 'Renda fixa').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500">
            Renda fixa tem taxa/vencimento próprios — para adicionar, use "Refazer simulação". Aqui dá pra adicionar os
            outros tipos direto, sem passar pelo assistente de novo.
          </p>
          {classBudget != null ? (
            <p className={`text-xs font-medium ${classRemaining < 0.005 ? 'text-amber-300' : 'text-slate-400'}`}>
              {classRemaining < 0.005
                ? `Valor separado pra ${addClass} (${formatBRL(classBudget)}/mês) já está todo alocado.`
                : `Restante em ${addClass}: ${formatBRLExact(classRemaining)}/mês (de ${formatBRL(classBudget)}/mês separados).`}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Essa carteira não tem % por classe salvo (feita antes dessa opção existir) — sem teto pra respeitar aqui.
            </p>
          )}
          <div className="max-h-72 space-y-1.5 overflow-y-auto">
            {addOptions.length === 0 && <p className="text-xs text-slate-500">Nenhuma opção carregada para esta classe.</p>}
            {addOptions.map((opt) => {
              const already = alreadyAddedIds.has(opt.id)
              const payout = describePayout(addClass, opt, addQty)
              return (
                <div
                  key={opt.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <div className="truncate text-slate-200">
                      {opt.name}
                      {opt.ticker && opt.ticker !== opt.name && <span className="ml-1 text-xs text-slate-500">{opt.ticker}</span>}
                      {already && <span className="ml-1.5 text-xs text-emerald-400">já na carteira</span>}
                    </div>
                    {opt.price != null && <div className="text-xs text-slate-500">Compra: {formatBRLExact(opt.price)}/un.</div>}
                    {payout.returnLabel && <div className="text-xs text-emerald-400">Retorno: {payout.returnLabel}</div>}
                    {payout.frequencyLabel && <div className="text-xs text-slate-500">{payout.frequencyLabel}</div>}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {opt.price != null ? (
                      <>
                        <button
                          onClick={() => setAddQty((q) => Math.max(1, q - 1))}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-slate-400"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-sm text-slate-200">{addQty}</span>
                        <button
                          onClick={() => setAddQty((q) => q + 1)}
                          disabled={opt.price * (addQty + 1) > classRemaining + 0.005}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                      </>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        value={addAmount === 0 ? '' : addAmount}
                        onChange={(e) => setAddAmount(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                        placeholder="R$/mês"
                        className="w-20 appearance-none rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1 text-right text-sm text-slate-200 outline-none placeholder:text-slate-600 [-moz-appearance:textfield] focus:border-sky-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    )}
                    <button
                      onClick={() => handleAddAtivo(opt)}
                      disabled={addSaving || (opt.price == null && addAmount <= 0) || addCost(opt) > classRemaining + 0.005}
                      className="shrink-0 rounded-lg border border-sky-500 px-2.5 py-1 text-xs font-medium text-sky-300 hover:bg-sky-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="print-area space-y-5">
        <h3 className="text-base font-semibold text-slate-100 print:text-slate-900">
          {carteira.name} <span className="hidden font-normal text-slate-500 print:inline">— {new Date().toLocaleDateString('pt-BR')}</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div className="rounded-lg border border-slate-700/50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">Aporte mensal</div>
            <div className="text-slate-200">{formatBRL(carteira.monthlyContribution)}</div>
          </div>
          <div className="rounded-lg border border-slate-700/50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">Patrimônio inicial</div>
            <div className="text-slate-200">{formatBRL(carteira.initialAmount)}</div>
          </div>
          <div className="rounded-lg border border-slate-700/50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">Horizonte</div>
            <div className="text-slate-200">{carteira.years} anos</div>
          </div>
          <div className="rounded-lg border border-slate-700/50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">Taxa usada na projeção</div>
            <div className="text-slate-200">≈{effectiveRatePercent.toFixed(1).replace('.', ',')}% a.a.</div>
          </div>
          <div className="rounded-lg border border-slate-700/50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">Total aportado até lá</div>
            <div className="text-slate-200">{formatBRL(projection.invested)}</div>
          </div>
          <div className="rounded-lg border border-slate-700/50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">Projeção final</div>
            <div className="font-medium text-emerald-400">{formatBRL(projection.projected)}</div>
          </div>
        </div>
        {carteira.estimatedAnnualRate != null && (
          <p className="text-xs text-slate-500">
            {(carteira.estimatedAnnualRateCoverage ?? 0) > 0.5
              ? `Baseada no rendimento real de ${(carteira.estimatedAnnualRateCoverage ?? 0).toFixed(0)}% da carteira (dividendos/proventos dos ativos escolhidos)${
                  (carteira.estimatedAnnualRateCoverage ?? 0) < 99.5
                    ? ', misturada com uma taxa hipotética de mercado para o restante.'
                    : '.'
                }`
              : 'Sem dado real de rendimento para os ativos escolhidos — usando uma taxa hipotética de mercado.'}{' '}
            Não inclui valorização/desvalorização do preço dos ativos, só o rendimento.
          </p>
        )}

        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {ASSET_CLASSES.filter((c) => percentByClass[c] > 0).map((cls) => (
            <div key={cls} style={{ width: `${percentByClass[cls]}%`, backgroundColor: ASSET_CLASS_COLORS[cls] }} title={cls} />
          ))}
        </div>

        <div className="space-y-3">
          {ASSET_CLASSES.filter((cls) => carteira.items.some((i) => i.assetClass === cls)).map((cls) => (
            <div key={cls}>
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ASSET_CLASS_COLORS[cls] }}>
                {cls} — {(percentByClass[cls] ?? 0).toFixed(0)}%
              </div>
              <ul className="space-y-1.5">
                {carteira.items
                  .filter((i) => i.assetClass === cls)
                  .map((item) => (
                    <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">
                          {item.name}
                          {item.ticker && item.ticker !== item.name && <span className="ml-1 text-xs text-slate-500">({item.ticker})</span>}
                          {item.quantity != null && item.quantity > 1 && <span className="ml-1 text-xs text-slate-500">×{item.quantity}</span>}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="text-slate-500">{formatBRLExact(item.monthlyAmount)}/mês</span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="no-print text-slate-600 hover:text-rose-400"
                            aria-label={`Remover ${item.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </span>
                      </div>
                      {item.expectedIncome != null && (
                        <div className="mt-0.5 text-xs text-emerald-400">
                          Recebe ≈ {formatBRLExact(item.expectedIncome)}
                          {item.expectedIncomeNote ? ` (${item.expectedIncomeNote})` : ''}
                        </div>
                      )}
                      {item.rendaFixaTipo && item.estimatedAnnualRate != null && (
                        <div className="mt-0.5 text-xs text-slate-500">≈{item.estimatedAnnualRate.toFixed(1).replace('.', ',')}% a.a. usado na projeção</div>
                      )}
                      {item.payoutFrequency && <div className="mt-0.5 text-xs text-slate-500">{item.payoutFrequency}</div>}
                      {item.rendaFixaVencimento && (
                        <div className="mt-0.5 text-xs text-slate-500">Vencimento: {formatPaymentDate(item.rendaFixaVencimento)}</div>
                      )}
                      {item.rendaFixaAvisos && item.rendaFixaAvisos.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.rendaFixaAvisos.map((aviso) => (
                            <span key={aviso} className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-300">
                              {aviso}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {incomeSummary.withData > 0 && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-300">
              <Coins size={14} /> Proventos esperados
            </div>
            <div className="text-2xl font-bold text-emerald-400">{formatBRLExact(incomeSummary.total)}</div>
            <p className="mt-1 text-xs text-emerald-200/80">
              Soma do próximo pagamento (ações) ou estimativa mensal (FIIs) de {incomeSummary.withData}{' '}
              {incomeSummary.withData === 1 ? 'ativo com dado real' : 'ativos com dado real'} de mercado.
              {incomeSummary.withoutData > 0 &&
                ` Não inclui ${incomeSummary.withoutData} ${incomeSummary.withoutData === 1 ? 'ativo sem' : 'ativos sem'} dado real disponível.`}
            </p>
          </div>
        )}

        <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-200">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" />
          <span>Carteira e projeção são simulações educacionais, não recomendações de investimento.</span>
        </div>

        <button
          onClick={onEdit}
          className="no-print w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500"
        >
          Refazer simulação
        </button>
      </div>
    </div>
  )
}

export function MinhaCarteira({
  carteiras,
  loading,
  selectedId,
  onSelectCarteira,
  onClose,
  onRemoveItem,
  onCreateCarteira,
  onUpdateCarteira,
  onDeleteCarteira,
}: {
  carteiras: CarteiraState[]
  loading: boolean
  /** Which carteira's detail is open — lives in the URL (/carteira/:id) at
   * the App level, not local state, so F5/back-forward/sharing a link work. */
  selectedId: number | null
  onSelectCarteira: (id: number | null) => void
  onClose: () => void
  onRemoveItem: (carteiraId: number, itemId: string) => void
  onCreateCarteira: (next: Omit<CarteiraState, 'id'>) => Promise<CarteiraState>
  onUpdateCarteira: (id: number, next: Omit<CarteiraState, 'id'>) => Promise<CarteiraState>
  onDeleteCarteira: (id: number) => void
}) {
  const [wizardMode, setWizardMode] = useState<'new' | 'edit' | null>(null)

  const selected = selectedId != null ? carteiras.find((c) => c.id === selectedId) : undefined
  // A carteira selecionada pode ter sido apagada em outra sessão/aba — some da lista sem travar a tela.
  useEffect(() => {
    if (selectedId != null && !loading && !selected) onSelectCarteira(null)
  }, [selectedId, loading, selected, onSelectCarteira])

  return (
    <div className="flex h-full w-full flex-col bg-slate-950">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <PiggyBank size={18} className="text-emerald-400" /> Minha Carteira
        </h2>
        <div className="no-print flex items-center gap-1">
          {!wizardMode && !selected && carteiras.length > 0 && (
            <button
              onClick={() => setWizardMode('new')}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              <Plus size={14} /> Nova carteira
            </button>
          )}
          <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <p className="text-sm text-slate-500">Carregando...</p>
        ) : wizardMode === 'new' ? (
          <div className="space-y-4">
            {carteiras.length > 0 && (
              <button onClick={() => setWizardMode(null)} className="text-xs font-medium text-slate-400 hover:text-slate-200">
                ← Cancelar
              </button>
            )}
            <p className="text-sm text-slate-400">Monte sua carteira simulando abaixo o seu aporte e escolhendo seus investimentos.</p>
            <PortfolioSimulator
              onConfirm={(next) => {
                onCreateCarteira(next).then(() => setWizardMode(null))
              }}
            />
          </div>
        ) : wizardMode === 'edit' && selected ? (
          <div className="space-y-4">
            <button onClick={() => setWizardMode(null)} className="text-xs font-medium text-slate-400 hover:text-slate-200">
              ← Voltar para "{selected.name}"
            </button>
            <PortfolioSimulator
              defaultName={selected.name}
              onConfirm={(next) => {
                onUpdateCarteira(selected.id, next).then(() => setWizardMode(null))
              }}
            />
          </div>
        ) : selected ? (
          <CarteiraDetail
            carteira={selected}
            onBack={() => onSelectCarteira(null)}
            onEdit={() => setWizardMode('edit')}
            onDelete={() => {
              onDeleteCarteira(selected.id)
              onSelectCarteira(null)
            }}
            onRemoveItem={(itemId) => onRemoveItem(selected.id, itemId)}
            onUpdateCarteira={onUpdateCarteira}
          />
        ) : carteiras.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Monte sua carteira simulando abaixo o seu aporte e escolhendo seus investimentos.</p>
            <PortfolioSimulator onConfirm={(next) => onCreateCarteira(next)} />
          </div>
        ) : (
          <div className="space-y-2">
            {carteiras.map((c) => {
              const income = c.items.reduce((sum, i) => sum + (i.expectedIncome ?? 0), 0)
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCarteira(c.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-left transition-colors hover:border-sky-500"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-200">{c.name}</div>
                    <div className="text-xs text-slate-500">
                      {formatBRL(c.monthlyContribution)}/mês · {c.years} anos · {c.items.length} {c.items.length === 1 ? 'ativo' : 'ativos'}
                    </div>
                  </div>
                  {income > 0 && <div className="shrink-0 text-sm font-medium text-emerald-400">{formatBRLExact(income)}</div>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
