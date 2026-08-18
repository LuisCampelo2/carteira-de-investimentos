import { aulas } from '../data/aulas'
import type { Concept, ContentBlock } from '../data/types'

export interface SearchResult {
  aulaId: string
  aulaTitle: string
  aulaEmoji: string
  conceptId: string
  conceptTitle: string
  snippet: string
}

function blockText(block: ContentBlock): string {
  switch (block.type) {
    case 'text':
      return block.text
    case 'quote':
      return block.text
    case 'warning':
      return block.text
    case 'example':
      return `${block.title ?? ''} ${block.code}`
    case 'formula':
      return `${block.formula} ${block.description ?? ''}`
    case 'list':
      return block.items.join(' ')
    case 'table':
      return [block.headers.join(' '), ...block.rows.map((r) => r.join(' '))].join(' ')
    case 'compare':
      return block.items.map((i) => `${i.label} ${i.text}`).join(' ')
    default:
      return ''
  }
}

function collectConcepts(concepts: Concept[]): Concept[] {
  const out: Concept[] = []
  for (const c of concepts) {
    out.push(c)
    if (c.subConcepts) out.push(...collectConcepts(c.subConcepts))
  }
  return out
}

export function searchAll(query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: SearchResult[] = []

  for (const aula of aulas) {
    const concepts = collectConcepts(aula.concepts)
    for (const concept of concepts) {
      const haystack = [concept.title, ...concept.blocks.map(blockText)].join(' ').toLowerCase()
      if (haystack.includes(q)) {
        const matchedBlock = concept.blocks.find((b) => blockText(b).toLowerCase().includes(q))
        const snippetSource = matchedBlock ? blockText(matchedBlock) : concept.title
        const snippet = snippetSource.length > 140 ? `${snippetSource.slice(0, 140)}…` : snippetSource
        results.push({
          aulaId: aula.id,
          aulaTitle: aula.title,
          aulaEmoji: aula.emoji,
          conceptId: concept.id,
          conceptTitle: concept.title,
          snippet,
        })
      }
    }
  }

  return results.slice(0, 30)
}
