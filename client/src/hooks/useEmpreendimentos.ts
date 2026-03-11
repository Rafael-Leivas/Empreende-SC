import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import type { Empreendimento, ListFilters, PaginatedResponse } from '../types'

export function useEmpreendimentos(filters: ListFilters) {
  const [data, setData] = useState<PaginatedResponse<Empreendimento>>({ data: [], total: 0, page: 1, limit: 10 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.empreendimentos.list(filters)
      setData(result)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { fetch() }, [fetch])

  return { ...data, loading, error, refetch: fetch }
}
