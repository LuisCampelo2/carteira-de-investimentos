import { Handle, Position } from 'reactflow'
import { TrendingUp } from 'lucide-react'

export function CentralNode() {
  return (
    <div className="flex w-64 flex-col items-center gap-1.5 rounded-2xl border border-sky-400/40 bg-gradient-to-br from-sky-500/20 via-slate-900 to-slate-900 px-6 py-5 text-center shadow-[0_0_40px_-8px_rgba(56,189,248,0.5)]">
      <Handle type="source" position={Position.Top} className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
      <Handle type="source" position={Position.Left} className="!opacity-0" />
      <Handle type="source" position={Position.Right} className="!opacity-0" />
      <TrendingUp size={28} className="text-sky-400" />
      <span className="text-base font-bold leading-tight text-slate-50">INVESTIMENTOS EM AÇÕES</span>
      <span className="text-xs text-slate-400">Mapa mental de estudos</span>
    </div>
  )
}
