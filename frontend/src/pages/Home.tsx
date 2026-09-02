import { BarChart3, PiggyBank, TrendingUp, Workflow } from 'lucide-react'

interface HomeProps {
  completed: number
  total: number
  carteiraCount: number
  onOpenMapa: () => void
  onOpenCarteira: () => void
  onOpenAtivos: () => void
}

export function Home({ completed, total, carteiraCount, onOpenMapa, onOpenCarteira, onOpenAtivos }: HomeProps) {
  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto bg-slate-950 px-4 py-10">
      {/* my-auto (not justify-center on the parent) so it centers vertically
          when it fits but stays fully scrollable instead of clipping its own
          top edge when content is taller than the viewport (small phones). */}
      <div className="my-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div className="flex items-center gap-2 text-sky-400">
          <TrendingUp size={28} />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-50 sm:text-3xl">Investimentos em Ações</h1>
        <p className="mt-1 text-sm text-slate-400">Do zero à sua primeira carteira</p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>{total} aulas</span>
          <span>
            Progresso: <span className="font-semibold text-slate-300">{completed}/{total}</span>
          </span>
          <span>Aporte estudado: R$400/mês</span>
        </div>

        <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={onOpenMapa}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-6 py-8 text-center transition-colors hover:border-sky-500 hover:bg-sky-500/10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/15 text-sky-400 transition-transform group-hover:scale-105">
              <Workflow size={24} />
            </span>
            <span className="text-base font-semibold text-slate-100">Mapa Mental</span>
            <span className="text-xs text-slate-500">Explore as 10 aulas em um mapa interativo</span>
          </button>

          <button
            onClick={onOpenCarteira}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-6 py-8 text-center transition-colors hover:border-sky-500 hover:bg-sky-500/10"
          >
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 transition-transform group-hover:scale-105">
              <PiggyBank size={24} />
              {carteiraCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-white">
                  {carteiraCount}
                </span>
              )}
            </span>
            <span className="text-base font-semibold text-slate-100">Minha Carteira</span>
            <span className="text-xs text-slate-500">Monte e acompanhe sua carteira simulada</span>
          </button>

          <button
            onClick={onOpenAtivos}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-6 py-8 text-center transition-colors hover:border-sky-500 hover:bg-sky-500/10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 transition-transform group-hover:scale-105">
              <BarChart3 size={24} />
            </span>
            <span className="text-base font-semibold text-slate-100">Todos os Ativos</span>
            <span className="text-xs text-slate-500">Veja e atualize os preços de cada classe</span>
          </button>
        </div>
      </div>
    </div>
  )
}
