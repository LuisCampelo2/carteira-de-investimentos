import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Layout/Header'
import { MinhaCarteira } from './components/Carteira/MinhaCarteira'
import { AtivosView } from './components/Ativos/AtivosView'
import { useCarteiras } from './hooks/useCarteiras'

type View = 'carteira' | 'ativos'
type NavState = { view: View; carteiraId?: number }

// Ativos is the main/default screen — "/" and any unknown path land here.
const HOME_STATE: NavState = { view: 'ativos' }

// Every screen gets a real URL, so refreshing (F5) or sharing a link lands
// back on the same page instead of always resetting home — this is the
// only place that maps between NavState and the address bar.
function stateToPath(state: NavState): string {
  if (state.view === 'ativos') return '/'
  if (state.view === 'carteira' && state.carteiraId != null) return `/carteira/${state.carteiraId}`
  return `/${state.view}`
}

function pathToState(pathname: string): NavState {
  const carteiraMatch = pathname.match(/^\/carteira\/(\d+)\/?$/)
  if (carteiraMatch) return { view: 'carteira', carteiraId: Number(carteiraMatch[1]) }
  const view = pathname.replace(/^\/|\/$/g, '')
  if (view === 'carteira') return { view }
  return HOME_STATE
}

function currentLocationState(): NavState {
  return pathToState(window.location.pathname)
}

export default function App() {
  const { carteiras, loading: carteirasLoading, createCarteira, updateCarteira, removeItem, deleteCarteira } = useCarteiras()
  const [view, setView] = useState<View>(() => currentLocationState().view)
  const [carteiraId, setCarteiraId] = useState<number | undefined>(() => currentLocationState().carteiraId)

  // Keep the browser's Back/Forward buttons (and a raw F5 reload) in sync
  // with in-app navigation. The popstate handler only ever calls
  // setView/setCarteiraId directly (never navigate()), so there's no risk
  // of it re-pushing the entry it came from.
  useEffect(() => {
    const initial = currentLocationState()
    window.history.replaceState(initial, '', stateToPath(initial))

    const onPopState = (e: PopStateEvent) => {
      const state = (e.state as NavState | null) ?? currentLocationState()
      setView(state.view)
      setCarteiraId(state.carteiraId)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback((next: NavState) => {
    setView(next.view)
    setCarteiraId(next.carteiraId)
    window.history.pushState(next, '', stateToPath(next))
  }, [])

  const openCarteira = useCallback(() => navigate({ view: 'carteira' }), [navigate])
  const selectCarteira = useCallback(
    (id: number | null) => navigate({ view: 'carteira', carteiraId: id ?? undefined }),
    [navigate],
  )
  const goHome = useCallback(() => navigate(HOME_STATE), [navigate])

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-200">
      <Header
        carteiraCount={carteiras.length}
        onOpenCarteira={openCarteira}
        onGoHome={view !== 'ativos' ? goHome : undefined}
      />

      <div className="relative flex-1 overflow-hidden">
        {view === 'carteira' && (
          <div className="mx-auto h-full w-full max-w-3xl">
            <MinhaCarteira
              carteiras={carteiras}
              loading={carteirasLoading}
              selectedId={carteiraId ?? null}
              onSelectCarteira={selectCarteira}
              onClose={goHome}
              onRemoveItem={removeItem}
              onCreateCarteira={createCarteira}
              onUpdateCarteira={updateCarteira}
              onDeleteCarteira={deleteCarteira}
            />
          </div>
        )}

        {view === 'ativos' && (
          <div className="mx-auto h-full w-full max-w-4xl">
            <AtivosView />
          </div>
        )}
      </div>
    </div>
  )
}
