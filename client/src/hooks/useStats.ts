import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { Stats } from '../types'

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.empreendimentos.stats()
      .then(setStats)
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading, error }
}
