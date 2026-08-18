import { Handle, Position } from 'reactflow'
import { ChevronDown, CheckCircle2, Circle, CircleDot } from 'lucide-react'
import type { Aula, ProgressStatus } from '../../data/types'
import { aulaColorVar } from './layout'

export interface AulaNodeData {
  aula: Aula
  status: ProgressStatus
  expanded: boolean
  onToggleExpand: (aulaId: string) => void
  onOpen: (aulaId: string) => void
}

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

export function AulaNode({ data }: { data: AulaNodeData }) {
  const { aula, status, expanded, onToggleExpand, onOpen } = data
  const color = aulaColorVar(aula)
  const StatusIcon = statusIcon[status]

  return (
    <div
      className="group flex w-56 cursor-pointer flex-col gap-1.5 rounded-xl border bg-slate-900/95 px-4 py-3 shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5"
      style={{ borderColor: color }}
      onClick={() => onOpen(aula.id)}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
      <Handle type="source" position={Position.Left} className="!opacity-0" />
      <Handle type="source" position={Position.Right} className="!opacity-0" />
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>
          Aula {aula.number}
        </span>
        <StatusIcon size={14} className={statusColor[status]} />
      </div>
      <span className="text-sm font-medium leading-snug text-slate-100">{aula.shortTitle}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleExpand(aula.id)
        }}
        className="mt-1 flex items-center gap-1 self-start rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-slate-400 hover:border-slate-500 hover:text-slate-200"
      >
        <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        {expanded ? 'Recolher' : 'Expandir'}
      </button>
    </div>
  )
}
