export enum Segmento {
  TECNOLOGIA = 'TECNOLOGIA',
  COMERCIO = 'COMERCIO',
  INDUSTRIA = 'INDUSTRIA',
  SERVICOS = 'SERVICOS',
  AGRONEGOCIO = 'AGRONEGOCIO',
}

export interface Empreendimento {
  id: number
  nome: string
  empreendedor: string
  municipio: string
  segmento: Segmento
  contato: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export interface EmpreendimentoInput {
  nome: string
  empreendedor: string
  municipio: string
  segmento: Segmento
  contato: string
  ativo: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface Municipio {
  id: number
  nome: string
}

export interface SegmentoStats {
  segmento: Segmento
  total: number
  ativos: number
  inativos: number
}

export interface MunicipioRank {
  municipio: string
  total: number
}

export interface Stats {
  total: number
  ativos: number
  inativos: number
  taxaAtividade: number
  novosEsteMes: number
  municipiosAlcancados: number
  porSegmento: SegmentoStats[]
  topMunicipios: MunicipioRank[]
  ultimosCadastros: Empreendimento[]
}

export interface ListFilters {
  busca?: string
  segmento?: string
  municipio?: string
  ativo?: string
  page?: number
  limit?: number
}
