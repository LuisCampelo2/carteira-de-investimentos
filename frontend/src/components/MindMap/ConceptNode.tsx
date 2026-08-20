import { Handle, Position } from 'reactflow'
import { stripEmoji } from '../../utils/text'

export interface ConceptNodeData {
  title: string
  color: string
  onOpen: () => void
}

export function ConceptNode({ data }: { data: ConceptNodeData }) {
  return (
    <div
      className="max-w-[10rem] cursor-pointer rounded-lg border bg-slate-900/90 px-3 py-2 text-center text-xs font-medium text-slate-200 shadow-md transition-transform hover:-translate-y-0.5"
      style={{ borderColor: data.color }}
      onClick={data.onOpen}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      {stripEmoji(data.title)}
    </div>
  )
}
