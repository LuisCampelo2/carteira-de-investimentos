import { useCallback, useEffect, useState } from 'react'
import type { CarteiraState } from '../data/types'
import { api } from '../utils/api'

export function useCarteiras() {
  const [carteiras, setCarteiras] = useState<CarteiraState[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(() => {
    return api.get<CarteiraState[]>('/api/carteira').then(setCarteiras).catch(console.error)
  }, [])

  useEffect(() => {
    refetch().finally(() => setLoading(false))
  }, [refetch])

  const createCarteira = useCallback(async (next: Omit<CarteiraState, 'id'>) => {
    const created = await api.post<CarteiraState>('/api/carteira', next)
    setCarteiras((prev) => [created, ...prev])
    return created
  }, [])

  const updateCarteira = useCallback(async (id: number, next: Omit<CarteiraState, 'id'>) => {
    const updated = await api.put<CarteiraState>(`/api/carteira/${id}`, next)
    setCarteiras((prev) => prev.map((c) => (c.id === id ? updated : c)))
    return updated
  }, [])

  const removeItem = useCallback((carteiraId: number, itemId: string) => {
    setCarteiras((prev) =>
      prev.map((c) => (c.id === carteiraId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c)),
    )
    api.delete<CarteiraState>(`/api/carteira/${carteiraId}/items/${encodeURIComponent(itemId)}`).catch(console.error)
  }, [])

  const deleteCarteira = useCallback((id: number) => {
    setCarteiras((prev) => prev.filter((c) => c.id !== id))
    api.delete(`/api/carteira/${id}`).catch(console.error)
  }, [])

  return { carteiras, loading, refetch, createCarteira, updateCarteira, removeItem, deleteCarteira }
}
