import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Layout/Header'
import { MindMapView } from './components/MindMap/MindMapView'
import { MobileTree } from './components/MindMap/MobileTree'
import { LessonPanel } from './components/LessonPanel/LessonPanel'
import { GlossaryView } from './components/Glossary/GlossaryView'
import { MinhaCarteira } from './components/Carteira/MinhaCarteira'
import { useProgress } from './hooks/useProgress'
import { useCarteira } from './hooks/useCarteira'
import { useMediaQuery } from './hooks/useMediaQuery'
import { getAulaById } from './data/aulas'

type Drawer = { type: 'aula'; aulaId: string; conceptId?: string } | { type: 'glossary' } | { type: 'carteira' } | null

export default function App() {
  const { getStatus, setStatus, markStarted, completedCount, total } = useProgress()
  const { carteira, saveCarteira, removeItem, clearCarteira } = useCarteira()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [drawer, setDrawer] = useState<Drawer>(null)

  const openAula = useCallback(
    (aulaId: string) => {
      markStarted(aulaId)
      setDrawer({ type: 'aula', aulaId })
    },
    [markStarted],
  )

  const openConcept = useCallback(
    (aulaId: string, conceptId: string) => {
      markStarted(aulaId)
      setDrawer({ type: 'aula', aulaId, conceptId })
    },
    [markStarted],
  )

  const openGlossary = useCallback(() => setDrawer({ type: 'glossary' }), [])
  const openCarteira = useCallback(() => setDrawer({ type: 'carteira' }), [])
  const closeDrawer = useCallback(() => setDrawer(null), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeDrawer])

  const activeAula = drawer?.type === 'aula' ? getAulaById(drawer.aulaId) : undefined
  const drawerOpen = drawer !== null

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-200">
      <Header
        completed={completedCount}
        total={total}
        carteiraCount={carteira?.items.length ?? 0}
        onSelectSearch={openConcept}
        onOpenGlossary={openGlossary}
        onOpenCarteira={openCarteira}
      />

      <div className="relative flex-1 overflow-hidden">
        {isDesktop ? (
          <MindMapView getStatus={getStatus} onOpenAula={openAula} onOpenConcept={openConcept} />
        ) : (
          <MobileTree getStatus={getStatus} onOpenAula={openAula} onOpenConcept={openConcept} />
        )}

        {drawerOpen && (
          <div className="absolute inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-sm" onClick={closeDrawer}>
            <div
              className="animate-fade-in h-full w-full max-w-xl border-l border-slate-800 shadow-2xl md:w-[36rem]"
              onClick={(e) => e.stopPropagation()}
            >
              {drawer?.type === 'aula' && activeAula && (
                <LessonPanel
                  aula={activeAula}
                  status={getStatus(activeAula.id)}
                  onSetStatus={(s) => setStatus(activeAula.id, s)}
                  onClose={closeDrawer}
                  focusConceptId={drawer.conceptId}
                  onAddedToCarteira={(next) => {
                    saveCarteira(next)
                    openCarteira()
                  }}
                />
              )}
              {drawer?.type === 'glossary' && <GlossaryView onClose={closeDrawer} />}
              {drawer?.type === 'carteira' && (
                <MinhaCarteira
                  carteira={carteira}
                  onClose={closeDrawer}
                  onRemoveItem={removeItem}
                  onSaveCarteira={saveCarteira}
                  onClearCarteira={clearCarteira}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
