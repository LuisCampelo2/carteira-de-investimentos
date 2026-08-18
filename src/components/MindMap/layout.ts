import type { Aula, Concept } from '../../data/types'

export interface PositionedNode {
  x: number
  y: number
}

const AULA_RADIUS = 420
const CONCEPT_RADIUS = 260
const CONCEPT_RADIUS_STEP = 70
const CONCEPT_SPREAD_MAX = 110

export function aulaAngleDeg(index: number, total: number): number {
  return -90 + (index * 360) / total
}

export function aulaPosition(index: number, total: number): PositionedNode {
  const angle = (aulaAngleDeg(index, total) * Math.PI) / 180
  return { x: Math.cos(angle) * AULA_RADIUS, y: Math.sin(angle) * AULA_RADIUS }
}

export function conceptPositions(aulaIndex: number, total: number, aulaPos: PositionedNode, concepts: Concept[]): PositionedNode[] {
  const baseAngle = aulaAngleDeg(aulaIndex, total)
  const n = concepts.length
  const spread = Math.min(CONCEPT_SPREAD_MAX, 24 + n * 12)
  return concepts.map((_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const angleDeg = baseAngle - spread / 2 + t * spread
    const angle = (angleDeg * Math.PI) / 180
    const radius = CONCEPT_RADIUS + (i % 2 === 0 ? 0 : CONCEPT_RADIUS_STEP)
    return {
      x: aulaPos.x + Math.cos(angle) * radius,
      y: aulaPos.y + Math.sin(angle) * radius,
    }
  })
}

export function aulaColorVar(aula: Aula): string {
  return `var(--color-${aula.color})`
}
