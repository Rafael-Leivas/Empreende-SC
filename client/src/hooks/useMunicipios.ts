import { useState, useRef } from 'react'
import { api } from '../services/api'
import type { Municipio } from '../types'

export function useMunicipios() {
  const [options, setOptions] = useState<Municipio[]>([])
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  function search(busca: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (busca.length < 2) { setOptions([]); return }

    setLoading(true)
    timeoutRef.current = window.setTimeout(async () => {
      try {
        const result = await api.municipios.search(busca)
        setOptions(result)
      } catch {
        setOptions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  return { options, loading, search, setOptions }
}
