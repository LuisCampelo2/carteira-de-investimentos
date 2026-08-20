import { useState } from 'react'
import { ChevronRight, CheckCircle2, Circle, CircleDot, TrendingUp } from 'lucide-react'
import { aulas } from '../../data/aulas'
import type { ProgressStatus } from '../../data/types'
import { aulaColorVar } from './layout'
import { stripEmoji } from '../../utils/text'

const statusIcon: Record<ProgressStatus, typeof Circle> = {
  'not-started': Circle,
  'in-progress': CircleDot,
  completed: CheckCircle2,
}
const statusColor: Record<ProgressStatus, string> = {
  'not-started': 'text-slate-500',
  'in-progress': 'text-amber-400',
  completed: 'text-emerald-400',
}

export function MobileTree({
  getStatus,
  onOpenAula,
  onOpenConcept,
}: {
  getStatus: (aulaId: string) => ProgressStatus
  onOpenAula: (aulaId: string) => void
  onOpenConcept: (aulaId: string, conceptId: string) => void
}) {
  const [openAula, setOpenAula] = useState<string | null>(null)

  return (
    <div className="h-full overflow-y-auto px-4 py-4">
      <div className="mb-4 flex flex-col items-center gap-1 rounded-2xl border border-sky-400/40 bg-gradient-to-br from-sky-500/20 via-slate-900 to-slate-900 px-4 py-4 text-center">
        <TrendingUp size={24} className="text-sky-400" />
        <span className="text-sm font-bold text-slate-50">INVESTIMENTOS EM AÇÕES</span>
        <span className="text-xs text-slate-400">Mapa mental de estudos</span>
      </div>

      <div className="space-y-2">
        {aulas.map((aula) => {
          const status = getStatus(aula.id)
          const StatusIcon = statusIcon[status]
          const color = aulaColorVar(aula)
          const isOpen = openAula === aula.id

          return (
            <div key={aula.id} className="overflow-hidden rounded-xl border" style={{ borderColor: color }}>
              <button
                className="flex w-full items-center justify-between gap-2 bg-slate-900/80 px-3 py-3 text-left"
                onClick={() => setOpenAula(isOpen ? null : aula.id)}
              >
                <div className="flex items-center gap-2">
                  <StatusIcon size={14} className={statusColor[status]} />
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>
                      Aula {aula.number}
                    </div>
                    <div className="text-sm font-medium text-slate-100">{aula.shortTitle}</div>
                  </div>
                </div>
                <ChevronRight size={16} className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>

              {isOpen && (
                <div className="animate-fade-in space-y-1.5 bg-slate-900/40 px-3 py-3">
                  <button
                    onClick={() => onOpenAula(aula.id)}
                    className="w-full rounded-lg border border-slate-700 px-3 py-2 text-left text-xs font-medium text-slate-300 hover:border-slate-500"
                  >
                    Abrir aula completa →
                  </button>
                  {aula.concepts.map((concept) => (
                    <button
                      key={concept.id}
                      onClick={() => onOpenConcept(aula.id, concept.id)}
                      className="block w-full rounded-lg bg-slate-800/60 px-3 py-2 text-left text-xs text-slate-300"
                    >
                      {stripEmoji(concept.title)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
