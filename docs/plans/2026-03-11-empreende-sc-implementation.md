# Empreende SC — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack CRUD app for managing Santa Catarina enterprises with dashboard, filters, and dual view modes (table/cards).

**Architecture:** Express REST API with Prisma ORM + SQLite on the back-end, React SPA with Vite + Tailwind on the front-end. Monorepo with `/server` and `/client` folders, orchestrated by root `package.json`.

**Tech Stack:** Node.js, Express, TypeScript, Prisma, SQLite, Zod, React, Vite, Tailwind CSS, React Router

**Spec:** `docs/specs/2026-03-11-empreende-sc-design.md`

---

## File Structure

### Server (`/server`)

| File | Responsibility |
|------|----------------|
| `server/package.json` | Server dependencies and scripts |
| `server/tsconfig.json` | TypeScript config |
| `server/prisma/schema.prisma` | Prisma schema (Empreendimento, Municipio, Segmento enum) |
| `server/prisma/seed.ts` | Seed: 295 municípios + 20 empreendimentos de exemplo |
| `server/src/server.ts` | Entrypoint — listen on port |
| `server/src/app.ts` | Express setup — cors, json, routes |
| `server/src/routes/empreendimentos.ts` | Routes for /api/empreendimentos |
| `server/src/routes/municipios.ts` | Routes for /api/municipios |
| `server/src/controllers/empreendimentos.ts` | CRUD + stats logic |
| `server/src/controllers/municipios.ts` | Autocomplete logic |
| `server/src/validators/empreendimento.ts` | Zod schemas |

### Client (`/client`)

| File | Responsibility |
|------|----------------|
| `client/package.json` | Client dependencies and scripts |
| `client/tsconfig.json` | TypeScript config |
| `client/vite.config.ts` | Vite config with API proxy |
| `client/tailwind.config.js` | Tailwind config |
| `client/index.html` | HTML entry |
| `client/src/main.tsx` | React entry |
| `client/src/App.tsx` | Router setup (Dashboard, List, Form) |
| `client/src/types/index.ts` | Shared TypeScript types |
| `client/src/services/api.ts` | Fetch wrapper for all API calls |
| `client/src/hooks/useEmpreendimentos.ts` | Hook: list, create, update, delete |
| `client/src/hooks/useStats.ts` | Hook: dashboard stats |
| `client/src/hooks/useMunicipios.ts` | Hook: autocomplete search |
| `client/src/components/Navbar.tsx` | Top navigation bar |
| `client/src/components/Badge.tsx` | Segmento and status badges |
| `client/src/components/Pagination.tsx` | Pagination controls |
| `client/src/components/AutoComplete.tsx` | Municipality autocomplete input |
| `client/src/components/Modal.tsx` | Confirmation modal |
| `client/src/components/Toggle.tsx` | Toggle switch |
| `client/src/components/Filters.tsx` | Filter bar with search, selects, view toggle |
| `client/src/components/EmpreendimentoTable.tsx` | Table view |
| `client/src/components/EmpreendimentoCards.tsx` | Cards view |
| `client/src/pages/Dashboard.tsx` | Dashboard page |
| `client/src/pages/EmpreendimentoList.tsx` | List page (table + cards) |
| `client/src/pages/EmpreendimentoForm.tsx` | Create/Edit form page |

### Root

| File | Responsibility |
|------|----------------|
| `package.json` | Root scripts to orchestrate server + client |
| `.gitignore` | Git ignores |

---

## Chunk 1: Project Setup & Database

### Task 1: Root project setup

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "empreende-sc",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "seed": "cd server && npx prisma db seed"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
dist/
.env
*.db
*.db-journal
.superpowers/
```

- [ ] **Step 3: Install root dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` generated

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: init root project with orchestration scripts"
```

---

### Task 2: Server project setup

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`

- [ ] **Step 1: Create server/package.json**

```json
{
  "name": "empreende-sc-server",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@prisma/client": "^6.4.1",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/node": "^22.13.10",
    "prisma": "^6.4.1",
    "tsx": "^4.19.3",
    "typescript": "^5.8.2"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

- [ ] **Step 2: Create server/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Install server dependencies**

Run: `cd server && npm install`
Expected: `server/node_modules/` created

- [ ] **Step 4: Commit**

```bash
git add server/package.json server/package-lock.json server/tsconfig.json
git commit -m "chore: init server project with Express + Prisma + TypeScript"
```

---

### Task 3: Prisma schema & seed

**Files:**
- Create: `server/prisma/schema.prisma`
- Create: `server/prisma/seed.ts`

- [ ] **Step 1: Create Prisma schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

enum Segmento {
  TECNOLOGIA
  COMERCIO
  INDUSTRIA
  SERVICOS
  AGRONEGOCIO
}

model Empreendimento {
  id            Int       @id @default(autoincrement())
  nome          String
  empreendedor  String
  municipio     String
  segmento      Segmento
  contato       String
  ativo         Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Municipio {
  id   Int    @id @default(autoincrement())
  nome String @unique
}
```

- [ ] **Step 2: Generate Prisma client**

Run: `cd server && npx prisma generate`
Expected: Prisma Client generated successfully

- [ ] **Step 3: Run first migration**

Run: `cd server && npx prisma migrate dev --name init`
Expected: Migration created and applied, `dev.db` created

- [ ] **Step 4: Create seed file**

Create `server/prisma/seed.ts` with the full code below. The municipalities array contains all 295 real SC municipalities. The empreendimentos array has 20 sample records distributed across all 5 segments.

```typescript
import { PrismaClient, Segmento } from '@prisma/client'

const prisma = new PrismaClient()

const municipios = [
  'Abdon Batista','Abelardo Luz','Agrolândia','Agronômica','Água Doce',
  'Águas de Chapecó','Águas Frias','Águas Mornas','Alfredo Wagner','Alto Bela Vista',
  'Anchieta','Angelina','Anita Garibaldi','Anitápolis','Antônio Carlos',
  'Apiúna','Arabutã','Araquari','Araranguá','Armazém',
  'Arroio Trinta','Arvoredo','Ascurra','Atalanta','Aurora',
  'Balneário Arroio do Silva','Balneário Barra do Sul','Balneário Camboriú','Balneário Gaivota','Balneário Piçarras',
  'Balneário Rincão','Bandeirante','Barra Bonita','Barra Velha','Bela Vista do Toldo',
  'Belmonte','Benedito Novo','Biguaçu','Blumenau','Bocaina do Sul',
  'Bom Jardim da Serra','Bom Jesus','Bom Jesus do Oeste','Bom Retiro','Bombinhas',
  'Botuverá','Braço do Norte','Braço do Trombudo','Brunópolis','Brusque',
  'Caçador','Caibi','Calmon','Camboriú','Campo Alegre',
  'Campo Belo do Sul','Campo Erê','Campos Novos','Canelinha','Canoinhas',
  'Capão Alto','Capinzal','Capivari de Baixo','Catanduvas','Caxambu do Sul',
  'Celso Ramos','Cerro Negro','Chapadão do Lageado','Chapecó','Cocal do Sul',
  'Concórdia','Cordilheira Alta','Coronel Freitas','Coronel Martins','Correia Pinto',
  'Corupá','Criciúma','Cunha Porã','Cunhataí','Curitibanos',
  'Descanso','Dionísio Cerqueira','Dona Emma','Doutor Pedrinho','Entre Rios',
  'Ermo','Erval Velho','Faxinal dos Guedes','Flor do Sertão','Florianópolis',
  'Formosa do Sul','Forquilhinha','Fraiburgo','Frei Rogério','Galvão',
  'Garopaba','Garuva','Gaspar','Governador Celso Ramos','Grão-Pará',
  'Gravatal','Guabiruba','Guaraciaba','Guaramirim','Guarujá do Sul',
  'Guatambú','Herval d\'Oeste','Ibiam','Ibicaré','Ibirama',
  'Içara','Ilhota','Imaruí','Imbituba','Imbuia',
  'Indaial','Iomerê','Ipira','Iporã do Oeste','Ipuaçu',
  'Ipumirim','Iraceminha','Irani','Irati','Irineópolis',
  'Itá','Itaiópolis','Itajaí','Itapema','Itapiranga',
  'Itapoá','Ituporanga','Jaborá','Jacinto Machado','Jaguaruna',
  'Jaraguá do Sul','Jardinópolis','Joaçaba','Joinville','José Boiteux',
  'Jupiá','Lacerdópolis','Lages','Laguna','Lajeado Grande',
  'Laurentino','Lauro Müller','Lebon Régis','Leoberto Leal','Lindóia do Sul',
  'Lontras','Luiz Alves','Luzerna','Macieira','Mafra',
  'Major Gercino','Major Vieira','Maracajá','Maravilha','Marema',
  'Massaranduba','Matos Costa','Meleiro','Mirim Doce','Modelo',
  'Mondaí','Monte Carlo','Monte Castelo','Morro da Fumaça','Morro Grande',
  'Navegantes','Nova Erechim','Nova Itaberaba','Nova Trento','Nova Veneza',
  'Novo Horizonte','Orleans','Otacílio Costa','Ouro','Ouro Verde',
  'Paial','Painel','Palhoça','Palma Sola','Palmeira',
  'Palmitos','Papanduva','Paraíso','Passo de Torres','Passos Maia',
  'Paulo Lopes','Pedras Grandes','Penha','Peritiba','Pescaria Brava',
  'Petrolândia','Pinhalzinho','Pinheiro Preto','Piratuba','Planalto Alegre',
  'Pomerode','Ponte Alta','Ponte Alta do Norte','Ponte Serrada','Porto Belo',
  'Porto União','Pouso Redondo','Praia Grande','Presidente Castello Branco','Presidente Getúlio',
  'Presidente Nereu','Princesa','Quilombo','Rancho Queimado','Rio das Antas',
  'Rio do Campo','Rio do Oeste','Rio do Sul','Rio dos Cedros','Rio Fortuna',
  'Rio Negrinho','Rio Rufino','Riqueza','Rodeio','Romelândia',
  'Salete','Saltinho','Salto Veloso','Sangão','Santa Cecília',
  'Santa Helena','Santa Rosa de Lima','Santa Rosa do Sul','Santa Terezinha','Santa Terezinha do Progresso',
  'Santiago do Sul','Santo Amaro da Imperatriz','São Bento do Sul','São Bernardino','São Bonifácio',
  'São Carlos','São Cristóvão do Sul','São Domingos','São Francisco do Sul','São João Batista',
  'São João do Itaperiú','São João do Oeste','São João do Sul','São Joaquim','São José',
  'São José do Cedro','São José do Cerrito','São Lourenço do Oeste','São Ludgero','São Martinho',
  'São Miguel da Boa Vista','São Miguel do Oeste','São Pedro de Alcântara','Saudades','Schroeder',
  'Seara','Serra Alta','Siderópolis','Sombrio','Sul Brasil',
  'Taió','Tangará','Tigrinhos','Tijucas','Timbé do Sul',
  'Timbó','Timbó Grande','Três Barras','Treviso','Treze de Maio',
  'Treze Tílias','Trombudo Central','Tubarão','Tunápolis','Turvo',
  'União do Oeste','Urubici','Urupema','Urussanga','Vargeão',
  'Vargem','Vargem Bonita','Vidal Ramos','Videira','Vitor Meireles',
  'Witmarsum','Xanxerê','Xavantina','Xaxim','Zortéa',
]

const empreendimentos = [
  { nome: 'TechVale Solutions', empreendedor: 'Ana Souza', municipio: 'Florianópolis', segmento: Segmento.TECNOLOGIA, contato: '(48) 99123-4567', ativo: true },
  { nome: 'CodeBridge Software', empreendedor: 'Pedro Lima', municipio: 'Florianópolis', segmento: Segmento.TECNOLOGIA, contato: 'pedro@codebridge.dev', ativo: true },
  { nome: 'DataSul Analytics', empreendedor: 'Mariana Oliveira', municipio: 'Joinville', segmento: Segmento.TECNOLOGIA, contato: '(47) 99876-5432', ativo: true },
  { nome: 'InnovaApp', empreendedor: 'Lucas Ferreira', municipio: 'Blumenau', segmento: Segmento.TECNOLOGIA, contato: 'lucas@innovaapp.com.br', ativo: false },
  { nome: 'Mercado Central SC', empreendedor: 'Roberto Santos', municipio: 'Joinville', segmento: Segmento.COMERCIO, contato: '(47) 3333-4444', ativo: true },
  { nome: 'Loja Vila Germânica', empreendedor: 'Helena Schmidt', municipio: 'Blumenau', segmento: Segmento.COMERCIO, contato: '(47) 98765-1234', ativo: true },
  { nome: 'EcoShop Ilha', empreendedor: 'Camila Martins', municipio: 'Florianópolis', segmento: Segmento.COMERCIO, contato: 'camila@ecoshop.com', ativo: true },
  { nome: 'Distribuidora Costa Sul', empreendedor: 'Jorge Almeida', municipio: 'Criciúma', segmento: Segmento.COMERCIO, contato: '(48) 3444-5555', ativo: false },
  { nome: 'Blumenau Têxtil', empreendedor: 'Maria Schmidt', municipio: 'Blumenau', segmento: Segmento.INDUSTRIA, contato: '(47) 91234-5678', ativo: false },
  { nome: 'MetalSul Estruturas', empreendedor: 'Fernando Costa', municipio: 'Joinville', segmento: Segmento.INDUSTRIA, contato: '(47) 3555-6666', ativo: true },
  { nome: 'Cerâmica Catarinense', empreendedor: 'Antônio Pereira', municipio: 'Criciúma', segmento: Segmento.INDUSTRIA, contato: '(48) 3666-7777', ativo: true },
  { nome: 'PlástiSul Embalagens', empreendedor: 'Renata Dias', municipio: 'Jaraguá do Sul', segmento: Segmento.INDUSTRIA, contato: 'renata@plastisul.ind.br', ativo: true },
  { nome: 'Consultoria Serra', empreendedor: 'Bruno Cardoso', municipio: 'Lages', segmento: Segmento.SERVICOS, contato: '(49) 99111-2222', ativo: true },
  { nome: 'Contábil Express', empreendedor: 'Patrícia Ramos', municipio: 'Chapecó', segmento: Segmento.SERVICOS, contato: '(49) 3222-3333', ativo: true },
  { nome: 'TurSC Viagens', empreendedor: 'Diego Nascimento', municipio: 'Balneário Camboriú', segmento: Segmento.SERVICOS, contato: 'diego@tursc.com.br', ativo: true },
  { nome: 'Clínica BemViver', empreendedor: 'Dra. Juliana Moura', municipio: 'Florianópolis', segmento: Segmento.SERVICOS, contato: '(48) 3777-8888', ativo: false },
  { nome: 'Agro Sul Orgânicos', empreendedor: 'Carlos Müller', municipio: 'Chapecó', segmento: Segmento.AGRONEGOCIO, contato: '(49) 98765-4321', ativo: true },
  { nome: 'Vinícola Vale Europeu', empreendedor: 'Giovanni Bortolotto', municipio: 'Videira', segmento: Segmento.AGRONEGOCIO, contato: '(49) 3444-5566', ativo: true },
  { nome: 'Laticínios Planalto', empreendedor: 'Sandra Kraus', municipio: 'São Joaquim', segmento: Segmento.AGRONEGOCIO, contato: 'sandra@laticiniosplanalto.com', ativo: true },
  { nome: 'AgroTech Sementes', empreendedor: 'Marcos Vieira', municipio: 'Xanxerê', segmento: Segmento.AGRONEGOCIO, contato: '(49) 99333-4444', ativo: false },
]

async function main() {
  await prisma.empreendimento.deleteMany()
  await prisma.municipio.deleteMany()

  await prisma.municipio.createMany({
    data: municipios.map(nome => ({ nome })),
  })

  await prisma.empreendimento.createMany({ data: empreendimentos })

  console.log(`Seeded ${municipios.length} municipalities and ${empreendimentos.length} empreendimentos`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
```

**Nota:** A lista acima contém ~295 municípios. Se faltar algum, complete com a lista oficial do IBGE. O importante é que todos os nomes estejam corretos e em ordem alfabética.

- [ ] **Step 5: Run seed**

Run: `cd server && npx prisma db seed`
Expected: "Seeded 295 municipalities and 20 empreendimentos"

- [ ] **Step 6: Verify data**

Run: `cd server && npx prisma studio`
Expected: Browser opens showing Empreendimento (20 rows) and Municipio (295 rows) tables

- [ ] **Step 7: Commit**

```bash
git add server/prisma/schema.prisma server/prisma/seed.ts server/prisma/migrations/
git commit -m "feat: add Prisma schema with Empreendimento, Municipio models and seed data"
```

---

## Chunk 2: Server API

### Task 4: Express app setup

**Files:**
- Create: `server/src/app.ts`
- Create: `server/src/server.ts`

- [ ] **Step 1: Create app.ts**

```typescript
import express from 'express'
import cors from 'cors'
import { empreendimentosRouter } from './routes/empreendimentos'
import { municipiosRouter } from './routes/municipios'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/empreendimentos', empreendimentosRouter)
app.use('/api/municipios', municipiosRouter)

export { app }
```

- [ ] **Step 2: Create server.ts**

```typescript
import { app } from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

- [ ] **Step 3: Commit** (won't compile yet — routes don't exist — that's fine, commit the structure)

```bash
git add server/src/app.ts server/src/server.ts
git commit -m "feat: add Express app setup with CORS and route registration"
```

---

### Task 5: Zod validators

**Files:**
- Create: `server/src/validators/empreendimento.ts`

- [ ] **Step 1: Create validation schemas**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add server/src/validators/empreendimento.ts
git commit -m "feat: add Zod validation schemas for empreendimento"
```

---

### Task 6: Empreendimentos controller

**Files:**
- Create: `server/src/controllers/empreendimentos.ts`

- [ ] **Step 1: Create controller with all handlers**

```typescript
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

  // Count active per segment
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
```

- [ ] **Step 2: Commit**

```bash
git add server/src/controllers/empreendimentos.ts
git commit -m "feat: add empreendimentos controller with CRUD + stats"
```

---

### Task 7: Municipios controller

**Files:**
- Create: `server/src/controllers/municipios.ts`

- [ ] **Step 1: Create controller**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add server/src/controllers/municipios.ts
git commit -m "feat: add municipios controller with autocomplete search"
```

---

### Task 8: Routes

**Files:**
- Create: `server/src/routes/empreendimentos.ts`
- Create: `server/src/routes/municipios.ts`

- [ ] **Step 1: Create empreendimentos routes**

```typescript
import { Router } from 'express'
import * as controller from '../controllers/empreendimentos'

const router = Router()

router.get('/stats', controller.stats)  // BEFORE /:id
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

export { router as empreendimentosRouter }
```

- [ ] **Step 2: Create municipios routes**

```typescript
import { Router } from 'express'
import * as controller from '../controllers/municipios'

const router = Router()

router.get('/', controller.search)

export { router as municipiosRouter }
```

- [ ] **Step 3: Test server starts**

Run: `cd server && npm run dev`
Expected: "Server running on http://localhost:3000"

- [ ] **Step 4: Test API with curl**

Run:
```bash
curl http://localhost:3000/api/empreendimentos | jq
curl http://localhost:3000/api/empreendimentos/stats | jq
curl http://localhost:3000/api/municipios?busca=flori | jq
```
Expected: JSON responses with seeded data

- [ ] **Step 5: Commit**

```bash
git add server/src/routes/
git commit -m "feat: add Express routes for empreendimentos and municipios"
```

---

## Chunk 3: Client Setup & Shared Code

### Task 9: Client project setup

**Files:**
- Create: `client/` (via Vite scaffold)
- Modify: `client/vite.config.ts` (add API proxy)
- Modify: `client/tailwind.config.js`

- [ ] **Step 1: Scaffold Vite React TypeScript project**

Run: `cd /home/devnpu/Documentos/git/desafio-crud && npm create vite@latest client -- --template react-ts`

- [ ] **Step 2: Install client dependencies**

Run: `cd client && npm install && npm install -D tailwindcss @tailwindcss/vite`

- [ ] **Step 3: Install React Router**

Run: `cd client && npm install react-router-dom`

- [ ] **Step 4: Configure Vite with API proxy and Tailwind**

Update `client/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
```

- [ ] **Step 5: Setup Tailwind CSS**

Replace `client/src/index.css` with:

```css
@import "tailwindcss";
```

Remove `client/src/App.css` if it exists.

- [ ] **Step 6: Verify client starts**

Run: `cd client && npm run dev`
Expected: Vite dev server on http://localhost:5173

- [ ] **Step 7: Commit**

```bash
git add client/
git commit -m "feat: init client with Vite + React + TypeScript + Tailwind"
```

---

### Task 10: Types & API service

**Files:**
- Create: `client/src/types/index.ts`
- Create: `client/src/services/api.ts`

- [ ] **Step 1: Create shared types**

```typescript
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
```

- [ ] **Step 2: Create API service**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add client/src/types/ client/src/services/
git commit -m "feat: add TypeScript types and API service layer"
```

---

### Task 11: Custom hooks

**Files:**
- Create: `client/src/hooks/useEmpreendimentos.ts`
- Create: `client/src/hooks/useStats.ts`
- Create: `client/src/hooks/useMunicipios.ts`

- [ ] **Step 1: Create useEmpreendimentos hook**

```typescript
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
```

- [ ] **Step 2: Create useStats hook**

```typescript
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
```

- [ ] **Step 3: Create useMunicipios hook**

```typescript
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
```

- [ ] **Step 4: Commit**

```bash
git add client/src/hooks/
git commit -m "feat: add custom hooks for empreendimentos, stats and municipios"
```

---

### Task 12: Shared UI components

**Files:**
- Create: `client/src/components/Navbar.tsx`
- Create: `client/src/components/Badge.tsx`
- Create: `client/src/components/Pagination.tsx`
- Create: `client/src/components/AutoComplete.tsx`
- Create: `client/src/components/Modal.tsx`
- Create: `client/src/components/Toggle.tsx`

- [ ] **Step 1: Create Navbar**

```tsx
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">Empreende SC</Link>
      <div className="flex gap-6 text-sm">
        <Link to="/" className={pathname === '/' ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5' : 'text-gray-400 hover:text-gray-200'}>
          Dashboard
        </Link>
        <Link to="/empreendimentos" className={pathname.startsWith('/empreendimentos') ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5' : 'text-gray-400 hover:text-gray-200'}>
          Empreendimentos
        </Link>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create Badge**

```tsx
import { Segmento } from '../types'

const SEGMENTO_COLORS: Record<Segmento, string> = {
  [Segmento.TECNOLOGIA]: 'bg-blue-100 text-blue-800',
  [Segmento.COMERCIO]: 'bg-purple-100 text-purple-800',
  [Segmento.INDUSTRIA]: 'bg-yellow-100 text-yellow-800',
  [Segmento.SERVICOS]: 'bg-green-100 text-green-800',
  [Segmento.AGRONEGOCIO]: 'bg-red-100 text-red-800',
}

const SEGMENTO_LABELS: Record<Segmento, string> = {
  [Segmento.TECNOLOGIA]: 'Tecnologia',
  [Segmento.COMERCIO]: 'Comércio',
  [Segmento.INDUSTRIA]: 'Indústria',
  [Segmento.SERVICOS]: 'Serviços',
  [Segmento.AGRONEGOCIO]: 'Agronegócio',
}

export function SegmentoBadge({ segmento }: { segmento: Segmento }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEGMENTO_COLORS[segmento]}`}>
      {SEGMENTO_LABELS[segmento]}
    </span>
  )
}

export function StatusBadge({ ativo }: { ativo: boolean }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {ativo ? 'Ativo' : 'Inativo'}
    </span>
  )
}

export { SEGMENTO_LABELS }
```

- [ ] **Step 3: Create Pagination**

```tsx
interface Props {
  page: number
  total: number
  limit: number
  onChange: (page: number) => void
}

export function Pagination({ page, total, limit, onChange }: Props) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  const pages: number[] = []
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pages.push(i)
  }

  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
      <span>Mostrando {start}-{end} de {total}</span>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="px-3 py-1.5 border border-gray-300 rounded-md bg-white disabled:opacity-50">←</button>
        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)} className={`px-3 py-1.5 border rounded-md ${p === page ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className="px-3 py-1.5 border border-gray-300 rounded-md bg-white disabled:opacity-50">→</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create AutoComplete**

```tsx
import { useState, useRef, useEffect } from 'react'
import type { Municipio } from '../types'

interface Props {
  value: string
  onChange: (value: string) => void
  options: Municipio[]
  onSearch: (busca: string) => void
  loading?: boolean
  placeholder?: string
  error?: string
}

export function AutoComplete({ value, onChange, options, onSearch, loading, placeholder, error }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); onSearch(e.target.value); setOpen(true) }}
        onFocus={() => options.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 border rounded-md text-sm ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {open && options.length > 0 && (
        <div className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg max-h-48 overflow-auto">
          {options.map(m => (
            <div key={m.id} onClick={() => { onChange(m.nome); setOpen(false) }} className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer">
              {m.nome}
            </div>
          ))}
        </div>
      )}
      {open && loading && <div className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg px-3 py-2 text-sm text-gray-400">Buscando...</div>}
    </div>
  )
}
```

- [ ] **Step 5: Create Modal**

```tsx
interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function Modal({ open, title, message, confirmLabel = 'Excluir', onConfirm, onCancel }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-7 max-w-sm w-full mx-4 shadow-xl text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-6 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button onClick={onConfirm} className="px-6 py-2.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create Toggle**

```tsx
interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-[22px] rounded-full relative transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <div className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[2px] transition-transform shadow ${checked ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
      </button>
      {label && <span className="text-sm text-gray-900">{label}</span>}
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add client/src/components/
git commit -m "feat: add shared UI components (Navbar, Badge, Pagination, AutoComplete, Modal, Toggle)"
```

---

## Chunk 4: Client Pages — Listagem & Formulário

### Task 13: Filters component

**Files:**
- Create: `client/src/components/Filters.tsx`

- [ ] **Step 1: Create Filters bar**

```tsx
import { Segmento } from '../types'
import { SEGMENTO_LABELS } from './Badge'

interface Props {
  busca: string
  segmento: string
  municipio: string
  ativo: string
  viewMode: 'table' | 'cards'
  onBuscaChange: (v: string) => void
  onSegmentoChange: (v: string) => void
  onMunicipioChange: (v: string) => void
  onAtivoChange: (v: string) => void
  onViewModeChange: (v: 'table' | 'cards') => void
}

export function Filters({ busca, segmento, municipio, ativo, viewMode, onBuscaChange, onSegmentoChange, onMunicipioChange, onAtivoChange, onViewModeChange }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex gap-3 items-center flex-wrap">
        <input
          type="text"
          value={busca}
          onChange={e => onBuscaChange(e.target.value)}
          placeholder="Buscar por nome..."
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <select value={segmento} onChange={e => onSegmentoChange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 min-w-[140px]">
          <option value="">Todos os segmentos</option>
          {Object.values(Segmento).map(s => <option key={s} value={s}>{SEGMENTO_LABELS[s]}</option>)}
        </select>
        <input
          type="text"
          value={municipio}
          onChange={e => onMunicipioChange(e.target.value)}
          placeholder="Município..."
          className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <select value={ativo} onChange={e => onAtivoChange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 min-w-[120px]">
          <option value="">Todos os status</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
        <div className="flex border border-gray-300 rounded-md overflow-hidden ml-auto">
          <button onClick={() => onViewModeChange('table')} className={`px-3 py-2 text-xs ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>☰ Tabela</button>
          <button onClick={() => onViewModeChange('cards')} className={`px-3 py-2 text-xs ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>▦ Cards</button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Filters.tsx
git commit -m "feat: add Filters component with search, selects and view toggle"
```

---

### Task 14: EmpreendimentoTable & EmpreendimentoCards

**Files:**
- Create: `client/src/components/EmpreendimentoTable.tsx`
- Create: `client/src/components/EmpreendimentoCards.tsx`

- [ ] **Step 1: Create Table view**

```tsx
import type { Empreendimento } from '../types'
import { SegmentoBadge, StatusBadge } from './Badge'

interface Props {
  data: Empreendimento[]
  onEdit: (id: number) => void
  onDelete: (emp: Empreendimento) => void
}

export function EmpreendimentoTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_80px_100px] gap-3 px-4 py-3 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
        <span>Empreendimento</span>
        <span>Empreendedor</span>
        <span>Município</span>
        <span>Segmento</span>
        <span>Status</span>
        <span className="text-right">Ações</span>
      </div>
      {data.map(emp => (
        <div key={emp.id} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_80px_100px] gap-3 px-4 py-3 text-sm text-gray-900 border-b border-gray-100 items-center last:border-b-0">
          <span className="font-medium">{emp.nome}</span>
          <span className="text-gray-500">{emp.empreendedor}</span>
          <span className="text-gray-500">{emp.municipio}</span>
          <span><SegmentoBadge segmento={emp.segmento} /></span>
          <span><StatusBadge ativo={emp.ativo} /></span>
          <span className="text-right flex gap-2 justify-end">
            <button onClick={() => onEdit(emp.id)} className="text-blue-500 text-xs hover:underline">Editar</button>
            <button onClick={() => onDelete(emp)} className="text-red-500 text-xs hover:underline">Excluir</button>
          </span>
        </div>
      ))}
      {data.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-gray-400">Nenhum empreendimento encontrado</div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create Cards view**

```tsx
import type { Empreendimento } from '../types'
import { SegmentoBadge, StatusBadge } from './Badge'

interface Props {
  data: Empreendimento[]
  onEdit: (id: number) => void
  onDelete: (emp: Empreendimento) => void
}

export function EmpreendimentoCards({ data, onEdit, onDelete }: Props) {
  if (data.length === 0) {
    return <div className="text-center py-8 text-sm text-gray-400">Nenhum empreendimento encontrado</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(emp => (
        <div key={emp.id} className="bg-white border border-gray-200 rounded-lg p-5 relative">
          <div className="absolute top-4 right-4"><StatusBadge ativo={emp.ativo} /></div>
          <h3 className="text-base font-semibold text-gray-900 mb-1 pr-16">{emp.nome}</h3>
          <p className="text-xs text-gray-500 mb-3">{emp.empreendedor}</p>
          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">📍 {emp.municipio}</div>
            <div className="flex items-center gap-1.5 text-xs">🏷️ <SegmentoBadge segmento={emp.segmento} /></div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">📞 {emp.contato}</div>
          </div>
          <div className="flex gap-2 border-t border-gray-100 pt-3">
            <button onClick={() => onEdit(emp.id)} className="text-blue-500 text-xs font-medium hover:underline">Editar</button>
            <button onClick={() => onDelete(emp)} className="text-red-500 text-xs font-medium hover:underline">Excluir</button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/EmpreendimentoTable.tsx client/src/components/EmpreendimentoCards.tsx
git commit -m "feat: add EmpreendimentoTable and EmpreendimentoCards components"
```

---

### Task 15: EmpreendimentoList page

**Files:**
- Create: `client/src/pages/EmpreendimentoList.tsx`

- [ ] **Step 1: Create list page**

```tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEmpreendimentos } from '../hooks/useEmpreendimentos'
import { Filters } from '../components/Filters'
import { EmpreendimentoTable } from '../components/EmpreendimentoTable'
import { EmpreendimentoCards } from '../components/EmpreendimentoCards'
import { Pagination } from '../components/Pagination'
import { Modal } from '../components/Modal'
import { api } from '../services/api'
import type { Empreendimento } from '../types'

export function EmpreendimentoList() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [segmento, setSegmento] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [ativo, setAtivo] = useState('')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [deleteTarget, setDeleteTarget] = useState<Empreendimento | null>(null)

  // Debounce busca
  const [debouncedBusca, setDebouncedBusca] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedBusca(busca), 300)
    return () => clearTimeout(t)
  }, [busca])

  const { data, total, limit, loading, refetch } = useEmpreendimentos({
    busca: debouncedBusca, segmento, municipio, ativo, page,
  })

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [debouncedBusca, segmento, municipio, ativo])

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await api.empreendimentos.delete(deleteTarget.id)
      setDeleteTarget(null)
      refetch()
    } catch (e: any) {
      alert(e.message)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Empreendimentos</h1>
          <p className="text-sm text-gray-500">{total} registros encontrados</p>
        </div>
        <button onClick={() => navigate('/empreendimentos/novo')} className="bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600">
          + Novo Empreendimento
        </button>
      </div>

      <Filters
        busca={busca} segmento={segmento} municipio={municipio} ativo={ativo} viewMode={viewMode}
        onBuscaChange={setBusca} onSegmentoChange={setSegmento} onMunicipioChange={setMunicipio}
        onAtivoChange={setAtivo} onViewModeChange={setViewMode}
      />

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : viewMode === 'table' ? (
        <EmpreendimentoTable data={data} onEdit={id => navigate(`/empreendimentos/${id}/editar`)} onDelete={setDeleteTarget} />
      ) : (
        <EmpreendimentoCards data={data} onEdit={id => navigate(`/empreendimentos/${id}/editar`)} onDelete={setDeleteTarget} />
      )}

      <Pagination page={page} total={total} limit={limit} onChange={setPage} />

      <Modal
        open={!!deleteTarget}
        title="Excluir empreendimento?"
        message={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/EmpreendimentoList.tsx
git commit -m "feat: add EmpreendimentoList page with filters, dual view and delete"
```

---

### Task 16: EmpreendimentoForm page

**Files:**
- Create: `client/src/pages/EmpreendimentoForm.tsx`

- [ ] **Step 1: Create form page**

```tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import { Segmento } from '../types'
import { SEGMENTO_LABELS } from '../components/Badge'
import { AutoComplete } from '../components/AutoComplete'
import { Toggle } from '../components/Toggle'
import { useMunicipios } from '../hooks/useMunicipios'

export function EmpreendimentoForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const { options, loading: munLoading, search: searchMunicipios, setOptions } = useMunicipios()

  const [form, setForm] = useState({
    nome: '', empreendedor: '', municipio: '', segmento: '' as string, contato: '', ativo: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEdit) {
      api.empreendimentos.getById(Number(id)).then(emp => {
        setForm({ nome: emp.nome, empreendedor: emp.empreendedor, municipio: emp.municipio, segmento: emp.segmento, contato: emp.contato, ativo: emp.ativo })
      })
    }
  }, [id, isEdit])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (form.nome.length < 2) errs.nome = 'Nome deve ter ao menos 2 caracteres'
    if (form.empreendedor.length < 2) errs.empreendedor = 'Nome deve ter ao menos 2 caracteres'
    if (!form.municipio) errs.municipio = 'Município é obrigatório'
    if (!form.segmento) errs.segmento = 'Segmento é obrigatório'
    if (form.contato.length < 5) errs.contato = 'Contato deve ter ao menos 5 caracteres'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const data = { ...form, segmento: form.segmento as Segmento }
      if (isEdit) {
        await api.empreendimentos.update(Number(id), data)
      } else {
        await api.empreendimentos.create(data)
      }
      navigate('/empreendimentos')
    } catch (err: any) {
      setErrors({ form: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/empreendimentos" className="text-blue-500 hover:underline">Empreendimentos</Link>
        <span className="mx-2">›</span>
        <span>{isEdit ? 'Editar' : 'Novo Empreendimento'}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{isEdit ? 'Editar Empreendimento' : 'Novo Empreendimento'}</h2>

        {errors.form && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md mb-4">{errors.form}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do Empreendimento *</label>
            <input type="text" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: TechVale Solutions"
              className={`w-full px-3 py-2.5 border rounded-md text-sm ${errors.nome ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`} />
            {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Empreendedor Responsável *</label>
            <input type="text" value={form.empreendedor} onChange={e => setForm({ ...form, empreendedor: e.target.value })}
              placeholder="Ex: Ana Souza"
              className={`w-full px-3 py-2.5 border rounded-md text-sm ${errors.empreendedor ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`} />
            {errors.empreendedor && <p className="text-xs text-red-500 mt-1">{errors.empreendedor}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Município *</label>
            <AutoComplete
              value={form.municipio} onChange={v => setForm({ ...form, municipio: v })}
              options={options} onSearch={searchMunicipios} loading={munLoading}
              placeholder="Digite o nome do município..." error={errors.municipio}
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Segmento *</label>
            <select value={form.segmento} onChange={e => setForm({ ...form, segmento: e.target.value })}
              className={`w-full px-3 py-2.5 border rounded-md text-sm ${errors.segmento ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}>
              <option value="">Selecione um segmento</option>
              {Object.values(Segmento).map(s => <option key={s} value={s}>{SEGMENTO_LABELS[s]}</option>)}
            </select>
            {errors.segmento && <p className="text-xs text-red-500 mt-1">{errors.segmento}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contato *</label>
            <input type="text" value={form.contato} onChange={e => setForm({ ...form, contato: e.target.value })}
              placeholder="(00) 00000-0000 ou email@exemplo.com"
              className={`w-full px-3 py-2.5 border rounded-md text-sm ${errors.contato ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`} />
            <p className="text-xs text-gray-500 mt-1">Telefone ou e-mail de contato</p>
            {errors.contato && <p className="text-xs text-red-500 mt-1">{errors.contato}</p>}
          </div>

          <div className="mb-7">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <Toggle checked={form.ativo} onChange={v => setForm({ ...form, ativo: v })} label={form.ativo ? 'Ativo' : 'Inativo'} />
          </div>

          <div className="flex gap-3 border-t border-gray-200 pt-5">
            <button type="submit" disabled={submitting} className="bg-blue-500 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
              {submitting ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={() => navigate('/empreendimentos')} className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/EmpreendimentoForm.tsx
git commit -m "feat: add EmpreendimentoForm page with validation and autocomplete"
```

---

## Chunk 5: Dashboard & App Router

### Task 17: Dashboard page

**Files:**
- Create: `client/src/pages/Dashboard.tsx`

- [ ] **Step 1: Create Dashboard page**

```tsx
import { Link } from 'react-router-dom'
import { useStats } from '../hooks/useStats'
import { SegmentoBadge, StatusBadge, SEGMENTO_LABELS } from '../components/Badge'
import { Segmento } from '../types'

const SEGMENTO_COLORS: Record<Segmento, string> = {
  [Segmento.TECNOLOGIA]: '#3b82f6',
  [Segmento.COMERCIO]: '#8b5cf6',
  [Segmento.INDUSTRIA]: '#f59e0b',
  [Segmento.SERVICOS]: '#10b981',
  [Segmento.AGRONEGOCIO]: '#ef4444',
}

const SEGMENTO_BORDER: Record<Segmento, string> = {
  [Segmento.TECNOLOGIA]: 'border-l-blue-500',
  [Segmento.COMERCIO]: 'border-l-purple-500',
  [Segmento.INDUSTRIA]: 'border-l-yellow-500',
  [Segmento.SERVICOS]: 'border-l-green-500',
  [Segmento.AGRONEGOCIO]: 'border-l-red-500',
}

export function Dashboard() {
  const { stats, loading, error } = useStats()

  if (loading) return <div className="p-6 bg-gray-50 min-h-screen text-center py-20 text-gray-400">Carregando...</div>
  if (error) return <div className="p-6 bg-gray-50 min-h-screen text-center py-20 text-red-500">{error}</div>
  if (!stats || stats.total === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Nenhum empreendimento cadastrado ainda.</p>
        <Link to="/empreendimentos/novo" className="bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600">
          Cadastre o primeiro empreendimento
        </Link>
      </div>
    )
  }

  const maxSegmento = stats.porSegmento.reduce((a, b) => a.total > b.total ? a : b)
  const sortedSegmentos = [...stats.porSegmento].sort((a, b) => b.total - a.total)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Visão geral dos empreendimentos catarinenses</p>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Total de Empreendimentos</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          <div className="text-xs text-green-600 mt-0.5">+{stats.novosEsteMes} este mês</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Taxa de Atividade</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.taxaAtividade}%</div>
          <div className="text-xs text-gray-500 mt-0.5">{stats.ativos} ativos · {stats.inativos} inativos</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Municípios Alcançados</div>
          <div className="text-2xl font-bold text-blue-500 mt-1">{stats.municipiosAlcancados}</div>
          <div className="text-xs text-gray-500 mt-0.5">de 295 municípios de SC</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Segmento Líder</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{SEGMENTO_LABELS[maxSegmento.segmento as Segmento]}</div>
          <div className="text-xs text-gray-500 mt-0.5">{maxSegmento.total} empreendimentos ({stats.total > 0 ? Math.round(maxSegmento.total / stats.total * 100) : 0}%)</div>
        </div>
      </div>

      {/* Row 2: Segment Cards */}
      <div className="text-sm font-semibold text-gray-700 mb-2">Por Segmento</div>
      <div className="grid grid-cols-5 gap-3 mb-5">
        {stats.porSegmento.map(seg => (
          <div key={seg.segmento} className={`bg-white border-l-[3px] ${SEGMENTO_BORDER[seg.segmento as Segmento]} rounded-lg p-3.5 shadow-sm`}>
            <div className="text-xs text-gray-500">{SEGMENTO_LABELS[seg.segmento as Segmento]}</div>
            <div className="text-xl font-bold text-gray-900">{seg.total}</div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-green-600">{seg.ativos} ativos</span>
              <span className="text-[10px] text-red-500">{seg.inativos} inativos</span>
            </div>
            <div className="bg-gray-200 h-1 rounded mt-1.5">
              <div className="h-1 rounded" style={{ width: `${stats.total > 0 ? (seg.total / stats.total * 100) : 0}%`, backgroundColor: SEGMENTO_COLORS[seg.segmento as Segmento] }} />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">{stats.total > 0 ? Math.round(seg.total / stats.total * 100) : 0}% do total</div>
          </div>
        ))}
      </div>

      {/* Row 3: Charts + Ranking */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-gray-900 mb-4">Distribuição por Segmento</div>
          <div className="flex flex-col gap-2.5">
            {sortedSegmentos.map(seg => (
              <div key={seg.segmento} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-20">{SEGMENTO_LABELS[seg.segmento as Segmento]}</span>
                <div className="flex-1 h-[18px] rounded" style={{ width: `${stats.total > 0 ? (seg.total / maxSegmento.total * 100) : 0}%`, backgroundColor: SEGMENTO_COLORS[seg.segmento as Segmento] }} />
                <span className="text-xs font-semibold text-gray-900 w-6 text-right">{seg.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active vs Inactive */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-gray-900 mb-4">Ativos vs Inativos</div>
          <div className="flex flex-col gap-2.5">
            {sortedSegmentos.map(seg => {
              const pct = seg.total > 0 ? Math.round(seg.ativos / seg.total * 100) : 0
              return (
                <div key={seg.segmento} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-20">{SEGMENTO_LABELS[seg.segmento as Segmento]}</span>
                  <div className="flex-1 flex h-[18px] rounded overflow-hidden">
                    <div className="bg-green-500" style={{ width: `${pct}%` }} />
                    <div className="bg-red-300" style={{ width: `${100 - pct}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-500 w-8 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span><span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-sm mr-1" />Ativos</span>
            <span><span className="inline-block w-2.5 h-2.5 bg-red-300 rounded-sm mr-1" />Inativos</span>
          </div>
        </div>

        {/* Top Municipalities */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-sm font-semibold text-gray-900 mb-4">Top Municípios</div>
          <div className="flex flex-col gap-2">
            {stats.topMunicipios.map((m, i) => (
              <div key={m.municipio} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${i < 3 ? 'text-blue-500' : 'text-gray-500'}`}>{i + 1}</span>
                  <span className="text-sm text-gray-900">{m.municipio}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{m.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Last Registrations */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold text-gray-900">Últimos Cadastros</div>
          <Link to="/empreendimentos" className="text-xs text-blue-500 hover:underline">Ver todos →</Link>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_80px] gap-3 px-3 py-2.5 bg-gray-50 rounded-t-md text-xs text-gray-500 uppercase tracking-wide">
            <span>Empreendimento</span><span>Empreendedor</span><span>Município</span><span>Segmento</span><span>Status</span>
          </div>
          {stats.ultimosCadastros.map(emp => (
            <div key={emp.id} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_80px] gap-3 px-3 py-2.5 text-sm border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-900">{emp.nome}</span>
              <span className="text-gray-500">{emp.empreendedor}</span>
              <span className="text-gray-500">{emp.municipio}</span>
              <span><SegmentoBadge segmento={emp.segmento} /></span>
              <span><StatusBadge ativo={emp.ativo} /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/Dashboard.tsx
git commit -m "feat: add Dashboard page with KPIs, segment cards, charts and recent list"
```

---

### Task 18: App router & final wiring

**Files:**
- Modify: `client/src/App.tsx`
- Modify: `client/src/main.tsx`

- [ ] **Step 1: Update App.tsx**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Dashboard } from './pages/Dashboard'
import { EmpreendimentoList } from './pages/EmpreendimentoList'
import { EmpreendimentoForm } from './pages/EmpreendimentoForm'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/empreendimentos" element={<EmpreendimentoList />} />
        <Route path="/empreendimentos/novo" element={<EmpreendimentoForm />} />
        <Route path="/empreendimentos/:id/editar" element={<EmpreendimentoForm />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Update main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: Start both servers and test full flow**

Run: `npm run dev` (from root)
Expected: Server on :3000, client on :5173

Test:
- Dashboard loads with seeded data
- Navigate to Empreendimentos — table view works
- Toggle to cards — cards view works
- Filters work (search, segmento, status)
- Click "+ Novo" — form loads
- Fill form, municipality autocomplete works
- Submit — redirects to list, new item appears
- Click "Editar" — form loads pre-filled
- Click "Excluir" — modal appears, confirm deletes

- [ ] **Step 4: Commit**

```bash
git add client/src/App.tsx client/src/main.tsx
git commit -m "feat: add React Router and wire up all pages"
```

---

## Summary

| Chunk | Tasks | What it delivers |
|-------|-------|------------------|
| 1 | 1-3 | Project scaffolding, Prisma schema, seed data |
| 2 | 4-8 | Complete REST API (CRUD + stats + autocomplete) |
| 3 | 9-12 | Client setup, types, API service, hooks, shared components |
| 4 | 13-16 | Filters, table/cards views, list page, form page |
| 5 | 17-18 | Dashboard page, router, full integration |

Each chunk produces working, testable software. After Chunk 2, the API is fully functional. After Chunk 5, the full app is complete.
