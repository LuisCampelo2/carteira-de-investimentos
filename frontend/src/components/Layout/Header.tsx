import { ArrowLeft, BarChart3, PiggyBank, TrendingUp } from 'lucide-react'
import { SearchBar } from '../Search/SearchBar'

export function Header({
  completed,
  total,
  carteiraCount,
  onSelectSearch,
  onOpenCarteira,
  onOpenAtivos,
  onGoHome,
}: {
  completed: number
  total: number
  carteiraCount: number
  onSelectSearch: (aulaId: string, conceptId: string) => void
  onOpenCarteira: () => void
  onOpenAtivos: () => void
  onGoHome?: () => void
}) {
  return (
    <header className="no-print flex flex-col gap-3 border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-slate-100"
          >
            <ArrowLeft size={14} /> Voltar
          </button>
        )}
        <button onClick={onGoHome} className="text-left" disabled={!onGoHome}>
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-sky-400" />
            <h1 className="text-lg font-bold text-slate-50">Investimentos em Ações</h1>
          </div>
          <p className="text-xs text-slate-500">Do zero à sua primeira carteira</p>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 sm:gap-4">
        <span>{total} aulas</span>
        <span className="flex items-center gap-1.5">
          Progresso:
          <span className="font-semibold text-slate-200">{completed}/{total}</span>
        </span>
        <span className="hidden sm:inline">Aporte estudado: R$400/mês</span>
      </div>

      {/* min-w-0 lets SearchBar actually shrink instead of shoving the nav
          buttons off the right edge (flex items refuse to shrink below their
          content size by default); button labels collapse to icon-only below
          sm so all three keep fitting alongside the search field on phones. */}
      <div className="flex min-w-0 items-center gap-2">
        <SearchBar onSelect={onSelectSearch} />
        <button
          onClick={onOpenCarteira}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-slate-100 sm:px-3"
        >
          <PiggyBank size={14} /> <span className="hidden sm:inline">Minha Carteira</span>
          {carteiraCount > 0 && (
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">{carteiraCount}</span>
          )}
        </button>
        <button
          onClick={onOpenAtivos}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-slate-100 sm:px-3"
        >
          <BarChart3 size={14} /> <span className="hidden sm:inline">Ativos</span>
        </button>
      </div>
    </header>
  )
}
