import { Request, Response } from 'express'
import { PrismaClient, Segmento } from '@prisma/client'
import { createEmpreendimentoSchema, updateEmpreendimentoSchema } from '../validators/empreendimento'

const prisma = new PrismaClient()

export async function list(req: Request, res: Response) {
  const { busca, segmento, municipio, ativo, page = '1', limit = '10' } = req.query

  const pageNum = Math.max(1, Number(page))
  const limitNum = Math.max(1, Math.min(100, Number(limit)))
  const skip = (pageNum - 1) * limitNum

  const where: any = {}

  if (busca) {
    const termo = String(busca)
    where.OR = [
      { nome: { contains: termo } },
      { empreendedor: { contains: termo } },
    ]
  }
  if (segmento) where.segmento = String(segmento)
  if (municipio) where.municipio = { contains: String(municipio) }
  if (ativo !== undefined) where.ativo = ativo === 'true'

  const [data, total] = await Promise.all([
    prisma.empreendimento.findMany({ where, skip, take: limitNum, orderBy: { createdAt: 'desc' } }),
    prisma.empreendimento.count({ where }),
  ])

  res.json({ data, total, page: pageNum, limit: limitNum })
}

export async function getById(req: Request, res: Response) {
  const { id } = req.params
  const empreendimento = await prisma.empreendimento.findUnique({ where: { id: Number(id) } })
  if (!empreendimento) return res.status(404).json({ error: 'Empreendimento não encontrado' })
  res.json(empreendimento)
}

export async function create(req: Request, res: Response) {
  const parsed = createEmpreendimentoSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message })

  const empreendimento = await prisma.empreendimento.create({ data: parsed.data })
  res.status(201).json(empreendimento)
}

export async function update(req: Request, res: Response) {
  const { id } = req.params
  const existing = await prisma.empreendimento.findUnique({ where: { id: Number(id) } })
  if (!existing) return res.status(404).json({ error: 'Empreendimento não encontrado' })

  const parsed = updateEmpreendimentoSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message })

  const empreendimento = await prisma.empreendimento.update({ where: { id: Number(id) }, data: parsed.data })
  res.json(empreendimento)
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params
  const existing = await prisma.empreendimento.findUnique({ where: { id: Number(id) } })
  if (!existing) return res.status(404).json({ error: 'Empreendimento não encontrado' })

  await prisma.empreendimento.delete({ where: { id: Number(id) } })
  res.status(204).send()
}

export async function stats(_req: Request, res: Response) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [total, ativos, novosEsteMes, allSegmentos, topMunicipios, ultimosCadastros, municipiosAlcancados] = await Promise.all([
    prisma.empreendimento.count(),
    prisma.empreendimento.count({ where: { ativo: true } }),
    prisma.empreendimento.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.empreendimento.groupBy({ by: ['segmento'], _count: { _all: true } }),
    prisma.empreendimento.groupBy({
      by: ['municipio'],
      _count: { _all: true },
      orderBy: { _count: { municipio: 'desc' } },
      take: 5,
    }),
    prisma.empreendimento.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.empreendimento.groupBy({ by: ['municipio'], _count: { _all: true } }),
  ])

  const ativosPerSegmento = await prisma.empreendimento.groupBy({
    by: ['segmento'],
    where: { ativo: true },
    _count: { _all: true },
  })

  const ativosMap = Object.fromEntries(ativosPerSegmento.map(s => [s.segmento, s._count._all]))

  const allSegmentoValues: Segmento[] = ['TECNOLOGIA', 'COMERCIO', 'INDUSTRIA', 'SERVICOS', 'AGRONEGOCIO']
  const segmentoMap = Object.fromEntries(allSegmentos.map(s => [s.segmento, s._count._all]))

  const porSegmento = allSegmentoValues.map(seg => {
    const segTotal = segmentoMap[seg] || 0
    const segAtivos = ativosMap[seg] || 0
    return { segmento: seg, total: segTotal, ativos: segAtivos, inativos: segTotal - segAtivos }
  })

  const inativos = total - ativos
  const taxaAtividade = total > 0 ? Math.round((ativos / total) * 1000) / 10 : 0

  res.json({
    total,
    ativos,
    inativos,
    taxaAtividade,
    novosEsteMes,
    municipiosAlcancados: municipiosAlcancados.length,
    porSegmento,
    topMunicipios: topMunicipios.map(m => ({ municipio: m.municipio, total: m._count._all })),
    ultimosCadastros,
  })
}
