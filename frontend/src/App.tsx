import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Layout/Header'
import { MindMapView } from './components/MindMap/MindMapView'
import { MobileTree } from './components/MindMap/MobileTree'
import { LessonPanel } from './components/LessonPanel/LessonPanel'
import { GlossaryView } from './components/Glossary/GlossaryView'
import { MinhaCarteira } from './components/Carteira/MinhaCarteira'
import { Home } from './pages/Home'
import { useProgress } from './hooks/useProgress'
import { useCarteira } from './hooks/useCarteira'
import { useMediaQuery } from './hooks/useMediaQuery'
import { getAulaById } from './data/aulas'

type Drawer = { type: 'aula'; aulaId: string; conceptId?: string } | null
type View = 'home' | 'mapa' | 'glossario' | 'carteira'
type NavState = { view: View; drawer: Drawer }

const HOME_STATE: NavState = { view: 'home', drawer: null }

// Every screen gets a real URL, so refreshing (F5) or sharing a link lands
// back on the same page instead of always resetting to home — this is the
// only place that maps between NavState and the address bar.
function stateToPath(state: NavState): string {
  if (state.drawer?.type === 'aula') {
    const base = `/mapa/aula/${encodeURIComponent(state.drawer.aulaId)}`
    return state.drawer.conceptId ? `${base}?conceito=${encodeURIComponent(state.drawer.conceptId)}` : base
  }
  if (state.view === 'home') return '/'
  return `/${state.view}`
}

function pathToState(pathname: string, search: string): NavState {
  const aulaMatch = pathname.match(/^\/mapa\/aula\/([^/]+)\/?$/)
  if (aulaMatch) {
    const conceptId = new URLSearchParams(search).get('conceito')
    return {
      view: 'mapa',
      drawer: { type: 'aula', aulaId: decodeURIComponent(aulaMatch[1]), conceptId: conceptId ?? undefined },
    }
  }
  const view = pathname.replace(/^\/|\/$/g, '')
  if (view === 'mapa' || view === 'glossario' || view === 'carteira') return { view, drawer: null }
  return HOME_STATE
}

function currentLocationState(): NavState {
  return pathToState(window.location.pathname, window.location.search)
}

export default function App() {
  const { getStatus, setStatus, markStarted, completedCount, total } = useProgress()
  const { carteira, saveCarteira, removeItem, clearCarteira } = useCarteira()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [view, setView] = useState<View>(() => currentLocationState().view)
  const [drawer, setDrawer] = useState<Drawer>(() => currentLocationState().drawer)

  // Keep the browser's Back/Forward buttons (and a raw F5 reload) in sync
  // with in-app navigation. The popstate handler only ever calls
  // setView/setDrawer directly (never navigate()), so there's no risk of it
  // re-pushing the entry it came from.
  useEffect(() => {
    const initial = currentLocationState()
    window.history.replaceState(initial, '', stateToPath(initial))
    if (initial.drawer?.type === 'aula') markStarted(initial.drawer.aulaId)

    const onPopState = (e: PopStateEvent) => {
      const state = (e.state as NavState | null) ?? currentLocationState()
      setView(state.view)
      setDrawer(state.drawer)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigate = useCallback((next: NavState) => {
    setView(next.view)
    setDrawer(next.drawer)
    window.history.pushState(next, '', stateToPath(next))
  }, [])

  const openAula = useCallback(
    (aulaId: string) => {
      markStarted(aulaId)
      navigate({ view: 'mapa', drawer: { type: 'aula', aulaId } })
    },
    [markStarted, navigate],
  )

  const openConcept = useCallback(
    (aulaId: string, conceptId: string) => {
      markStarted(aulaId)
      navigate({ view: 'mapa', drawer: { type: 'aula', aulaId, conceptId } })
    },
    [markStarted, navigate],
  )

  const openGlossary = useCallback(() => navigate({ view: 'glossario', drawer: null }), [navigate])
  const openCarteira = useCallback(() => navigate({ view: 'carteira', drawer: null }), [navigate])
  const closeDrawer = useCallback(() => navigate({ view: 'mapa', drawer: null }), [navigate])
  const goHome = useCallback(() => navigate(HOME_STATE), [navigate])
  const goToMapa = useCallback(() => navigate({ view: 'mapa', drawer: null }), [navigate])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeDrawer])

  const activeAula = drawer?.type === 'aula' ? getAulaById(drawer.aulaId) : undefined
  const drawerOpen = drawer !== null

  if (view === 'home') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
        <Home
          completed={completedCount}
          total={total}
          carteiraCount={carteira?.items.length ?? 0}
          onOpenMapa={goToMapa}
          onOpenGlossario={openGlossary}
          onOpenCarteira={openCarteira}
        />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-200">
      <Header
        completed={completedCount}
        total={total}
        carteiraCount={carteira?.items.length ?? 0}
        onSelectSearch={openConcept}
        onOpenGlossary={openGlossary}
        onOpenCarteira={openCarteira}
        onGoHome={goHome}
      />

      <div className="relative flex-1 overflow-hidden">
        {view === 'mapa' && (
          <>
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
                </div>
              </div>
            )}
          </>
        )}

        {view === 'glossario' && (
          <div className="mx-auto h-full w-full max-w-3xl">
            <GlossaryView onClose={goHome} />
          </div>
        )}

        {view === 'carteira' && (
          <div className="mx-auto h-full w-full max-w-3xl">
            <MinhaCarteira
              carteira={carteira}
              onClose={goHome}
              onRemoveItem={removeItem}
              onSaveCarteira={saveCarteira}
              onClearCarteira={clearCarteira}
            />
          </div>
        )}
      </div>
    </div>
  )
}
