import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function search(req: Request, res: Response) {
  const { busca = '' } = req.query

  const municipios = await prisma.municipio.findMany({
    where: { nome: { contains: String(busca) } },
    take: 10,
    orderBy: { nome: 'asc' },
  })

  res.json(municipios)
}
