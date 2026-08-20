import { useCallback, useEffect, useState } from 'react'
import type { CarteiraState } from '../data/types'
import { api } from '../utils/api'

export function useCarteira() {
  const [carteira, setCarteira] = useState<CarteiraState | null>(null)

  useEffect(() => {
    api.get<CarteiraState | null>('/api/carteira').then(setCarteira).catch(console.error)
  }, [])

  const saveCarteira = useCallback((next: CarteiraState) => {
    setCarteira(next)
    api.put<CarteiraState>('/api/carteira', next).catch(console.error)
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setCarteira((prev) => {
      if (!prev) return prev
      return { ...prev, items: prev.items.filter((i) => i.id !== itemId) }
    })
    api.delete<CarteiraState>(`/api/carteira/items/${encodeURIComponent(itemId)}`).catch(console.error)
  }, [])

  const clearCarteira = useCallback(() => {
    setCarteira(null)
    api.delete('/api/carteira').catch(console.error)
  }, [])

  return { carteira, saveCarteira, removeItem, clearCarteira }
}
