import { z } from 'zod'

export const createEmpreendimentoSchema = z.object({
  nome: z.string().min(2).max(200),
  empreendedor: z.string().min(2).max(200),
  municipio: z.string().min(1),
  segmento: z.enum(['TECNOLOGIA', 'COMERCIO', 'INDUSTRIA', 'SERVICOS', 'AGRONEGOCIO']),
  contato: z.string().min(5).max(200),
  ativo: z.boolean().optional().default(true),
})

export const updateEmpreendimentoSchema = z.object({
  nome: z.string().min(2).max(200),
  empreendedor: z.string().min(2).max(200),
  municipio: z.string().min(1),
  segmento: z.enum(['TECNOLOGIA', 'COMERCIO', 'INDUSTRIA', 'SERVICOS', 'AGRONEGOCIO']),
  contato: z.string().min(5).max(200),
  ativo: z.boolean(),
})

export type CreateEmpreendimentoInput = z.infer<typeof createEmpreendimentoSchema>
