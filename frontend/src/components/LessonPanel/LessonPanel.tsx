import { useEffect, useRef } from 'react'
import { CheckCircle2, Circle, CircleDot, X } from 'lucide-react'
import type { Aula, CarteiraState, ProgressStatus } from '../../data/types'
import { ConceptAccordion } from '../ui/ConceptAccordion'
import { Checklist } from './Checklist'
import { CompanyAnalyzer } from '../CompanyAnalyzer/CompanyAnalyzer'
import { PortfolioSimulator } from '../PortfolioSimulator/PortfolioSimulator'
import { QuizView } from '../Quiz/QuizView'
import { getQuizByAulaId } from '../../data/quizzes'

const statusMeta: Record<ProgressStatus, { label: string; icon: typeof Circle; className: string }> = {
  'not-started': { label: 'Não iniciada', icon: Circle, className: 'text-slate-500' },
  'in-progress': { label: 'Em andamento', icon: CircleDot, className: 'text-amber-400' },
  completed: { label: 'Concluída', icon: CheckCircle2, className: 'text-emerald-400' },
}

export function LessonPanel({
  aula,
  status,
  onSetStatus,
  onClose,
  focusConceptId,
  onAddedToCarteira,
}: {
  aula: Aula
  status: ProgressStatus
  onSetStatus: (status: ProgressStatus) => void
  onClose: () => void
  focusConceptId?: string | null
  onAddedToCarteira?: (carteira: Omit<CarteiraState, 'id'>) => void
}) {
  const quiz = getQuizByAulaId(aula.id)
  const conceptRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (focusConceptId && conceptRefs.current[focusConceptId]) {
      conceptRefs.current[focusConceptId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [focusConceptId])

  return (
    <div className="flex h-full w-full flex-col bg-slate-950">
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Aula {aula.number}</div>
          <h2 className="mt-0.5 flex items-center gap-2 text-lg font-semibold text-slate-100">
            <span>{aula.emoji}</span> {aula.title}
          </h2>
          {aula.objective && <p className="mt-1 text-sm text-slate-400">{aula.objective}</p>}
        </div>
        <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
          <X size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-3">
        <span className="text-xs text-slate-500">Progresso:</span>
        {(['not-started', 'in-progress', 'completed'] as ProgressStatus[]).map((s) => {
          const meta = statusMeta[s]
          const Icon = meta.icon
          const active = status === s
          return (
            <button
              key={s}
              onClick={() => onSetStatus(s)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                active ? 'border-slate-600 bg-slate-800 text-slate-100' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={13} className={meta.className} />
              {meta.label}
            </button>
          )
        })}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {aula.special === 'company-analyzer' && <CompanyAnalyzer />}
        {aula.special === 'portfolio-builder' && (
          <PortfolioSimulator
            onConfirm={(carteira) => {
              onSetStatus('completed')
              onAddedToCarteira?.(carteira)
            }}
          />
        )}

        {aula.concepts.map((concept) => (
          <div key={concept.id} ref={(el) => { conceptRefs.current[concept.id] = el }}>
            <ConceptAccordion concept={concept} defaultOpen={aula.concepts.length <= 2 || concept.id === focusConceptId} />
          </div>
        ))}

        {aula.checklist && <Checklist aulaId={aula.id} items={aula.checklist} />}

        {quiz && (
          <div className="pt-2">
            <QuizView quiz={quiz} onComplete={() => status !== 'completed' && onSetStatus('completed')} />
          </div>
        )}
      </div>
    </div>
  )
}
