import type { Empreendimento, EmpreendimentoInput, PaginatedResponse, ListFilters, Stats, Municipio } from '../types'

const BASE = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  empreendimentos: {
    list(filters: ListFilters = {}): Promise<PaginatedResponse<Empreendimento>> {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v))
      })
      return request(`${BASE}/empreendimentos?${params}`)
    },
    getById(id: number): Promise<Empreendimento> {
      return request(`${BASE}/empreendimentos/${id}`)
    },
    create(data: EmpreendimentoInput): Promise<Empreendimento> {
      return request(`${BASE}/empreendimentos`, { method: 'POST', body: JSON.stringify(data) })
    },
    update(id: number, data: EmpreendimentoInput): Promise<Empreendimento> {
      return request(`${BASE}/empreendimentos/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    },
    delete(id: number): Promise<void> {
      return request(`${BASE}/empreendimentos/${id}`, { method: 'DELETE' })
    },
    stats(): Promise<Stats> {
      return request(`${BASE}/empreendimentos/stats`)
    },
  },
  municipios: {
    search(busca: string): Promise<Municipio[]> {
      return request(`${BASE}/municipios?busca=${encodeURIComponent(busca)}`)
    },
  },
}
