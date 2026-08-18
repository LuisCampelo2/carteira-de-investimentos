import { useCallback, useEffect, useState } from 'react'
import type { CarteiraState } from '../data/types'

const STORAGE_KEY = 'mmi:carteira'

function loadCarteira(): CarteiraState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CarteiraState
  } catch {
    return null
  }
}

export function useCarteira() {
  const [carteira, setCarteira] = useState<CarteiraState | null>(() => loadCarteira())

  useEffect(() => {
    if (carteira) localStorage.setItem(STORAGE_KEY, JSON.stringify(carteira))
    else localStorage.removeItem(STORAGE_KEY)
  }, [carteira])

  const saveCarteira = useCallback((next: CarteiraState) => {
    setCarteira(next)
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setCarteira((prev) => {
      if (!prev) return prev
      return { ...prev, items: prev.items.filter((i) => i.id !== itemId) }
    })
  }, [])

  const clearCarteira = useCallback(() => setCarteira(null), [])

  return { carteira, saveCarteira, removeItem, clearCarteira }
}
