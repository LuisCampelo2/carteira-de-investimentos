import { useCallback, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Maximize2, Minimize2, LocateFixed } from 'lucide-react'
import { aulas } from '../../data/aulas'
import type { ProgressStatus } from '../../data/types'
import { CentralNode } from './CentralNode'
import { AulaNode, type AulaNodeData } from './AulaNode'
import { ConceptNode, type ConceptNodeData } from './ConceptNode'
import { aulaPosition, conceptPositions, aulaColorVar } from './layout'

const nodeTypes = { central: CentralNode, aula: AulaNode, concept: ConceptNode }

interface MindMapViewProps {
  getStatus: (aulaId: string) => ProgressStatus
  onOpenAula: (aulaId: string) => void
  onOpenConcept: (aulaId: string, conceptId: string) => void
}

function Canvas({ getStatus, onOpenAula, onOpenConcept }: MindMapViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const { fitView } = useReactFlow()

  const toggleExpand = useCallback((aulaId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(aulaId)) next.delete(aulaId)
      else next.add(aulaId)
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setExpanded(new Set(aulas.map((a) => a.id)))
    setTimeout(() => fitView({ duration: 400, padding: 0.15 }), 50)
  }, [fitView])

  const collapseAll = useCallback(() => {
    setExpanded(new Set())
    setTimeout(() => fitView({ duration: 400, padding: 0.3 }), 50)
  }, [fitView])

  const backToCenter = useCallback(() => {
    fitView({ duration: 500, padding: 0.35, maxZoom: 1 })
  }, [fitView])

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [
      { id: 'central', type: 'central', position: { x: 0, y: 0 }, data: {}, draggable: false, selectable: false },
    ]
    const edges: Edge[] = []

    aulas.forEach((aula, i) => {
      const pos = aulaPosition(i, aulas.length)
      const color = aulaColorVar(aula)
      const isExpanded = expanded.has(aula.id)

      nodes.push({
        id: aula.id,
        type: 'aula',
        position: pos,
        data: {
          aula,
          status: getStatus(aula.id),
          expanded: isExpanded,
          onToggleExpand: toggleExpand,
          onOpen: onOpenAula,
        } satisfies AulaNodeData,
        draggable: false,
      })

      edges.push({
        id: `central-${aula.id}`,
        source: 'central',
        target: aula.id,
        style: { stroke: color, strokeWidth: 2, opacity: 0.6 },
        animated: false,
      })

      if (isExpanded) {
        const positions = conceptPositions(i, aulas.length, pos, aula.concepts)
        aula.concepts.forEach((concept, ci) => {
          const nodeId = `${aula.id}::${concept.id}`
          nodes.push({
            id: nodeId,
            type: 'concept',
            position: positions[ci],
            data: {
              title: concept.title,
              color,
              onOpen: () => onOpenConcept(aula.id, concept.id),
            } satisfies ConceptNodeData,
            draggable: false,
          })
          edges.push({
            id: `${aula.id}-${nodeId}`,
            source: aula.id,
            target: nodeId,
            style: { stroke: color, strokeWidth: 1.5, opacity: 0.45 },
          })
        })
      }
    })

    return { nodes, edges }
  }, [expanded, getStatus, onOpenAula, onOpenConcept, toggleExpand])

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.35, maxZoom: 1 }}
        minZoom={0.25}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#232a3a" />
        <Controls showInteractive={false} className="!bottom-4 !left-4" />
      </ReactFlow>

      <div className="absolute right-4 top-4 flex gap-2">
        <button
          onClick={expandAll}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur hover:border-slate-500 hover:text-slate-100"
        >
          <Maximize2 size={13} /> Expandir tudo
        </button>
        <button
          onClick={collapseAll}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur hover:border-slate-500 hover:text-slate-100"
        >
          <Minimize2 size={13} /> Recolher tudo
        </button>
        <button
          onClick={backToCenter}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur hover:border-slate-500 hover:text-slate-100"
        >
          <LocateFixed size={13} /> Voltar ao centro
        </button>
      </div>
    </div>
  )
}

export function MindMapView(props: MindMapViewProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  )
}
