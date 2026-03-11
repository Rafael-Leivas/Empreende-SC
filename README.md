# Empreende SC

Aplicação full-stack CRUD para gerenciamento de empreendimentos catarinenses, desenvolvida como desafio técnico do processo seletivo **SCTEC — Trilha IA para DEVs** (SENAI/SC LAB365).

## Sobre o Projeto

O **Empreende SC** é um sistema web completo que permite cadastrar, consultar, editar e remover informações sobre empreendimentos do estado de Santa Catarina. A aplicação organiza dados como nome do empreendimento, empreendedor responsável, município, segmento de atuação, contato e status (ativo/inativo).

Além das operações básicas de CRUD, o sistema conta com funcionalidades extras que enriquecem a experiência:

- **Dashboard interativo** com KPIs, gráficos de distribuição por segmento, taxa de atividade, ranking de municípios e últimos cadastros
- **Drill-down nos gráficos** — clicar em qualquer elemento do dashboard (card de segmento, barra de gráfico, município do ranking) abre um modal com os empreendimentos correspondentes
- **Busca e filtros avançados** — pesquisa por nome com debounce, filtros por segmento, município e status
- **Duas visualizações** — alternância entre tabela e cards na listagem
- **Paginação** com navegação intuitiva
- **Modais** para cadastro, edição e confirmação de exclusão
- **Autocomplete de municípios** com os 295 municípios de SC pré-cadastrados
- **Dark mode / Light mode** com detecção automática da preferência do sistema e persistência no localStorage
- **Animações** — fade-in, staggered animations nos cards, transições suaves entre temas
- **Design responsivo** com glassmorphism na navbar e visual moderno

## Tecnologias Utilizadas

### Back-end
- **Node.js** + **Express** — servidor HTTP e rotas da API REST
- **TypeScript** — tipagem estática em todo o projeto
- **Prisma ORM** — mapeamento objeto-relacional e migrations
- **SQLite** — banco de dados relacional leve (sem necessidade de instalação externa)
- **Zod** — validação de schemas nos endpoints

### Front-end
- **React 19** — biblioteca para construção da interface
- **TypeScript** — tipagem estática nos componentes
- **Vite** — bundler e dev server com HMR
- **Tailwind CSS v4** — estilização utility-first com custom properties
- **shadcn/ui** — componentes acessíveis baseados em Radix UI
- **Lucide React** — ícones SVG consistentes
- **React Router** — navegação SPA entre Dashboard e Empreendimentos

## Estrutura do Projeto

```
Empreende-SC/
├── server/                     # Back-end (API REST)
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos: Empreendimento e Municipio
│   │   ├── seed.ts             # Seed com 295 municípios de SC
│   │   └── migrations/         # Migrations do banco de dados
│   └── src/
│       ├── app.ts              # Configuração do Express (CORS, JSON, rotas)
│       ├── server.ts           # Inicialização do servidor (porta 3000)
│       ├── controllers/        # Lógica de negócio (CRUD + stats)
│       ├── routes/             # Definição das rotas da API
│       └── validators/         # Schemas Zod para validação
│
├── client/                     # Front-end (SPA React)
│   └── src/
│       ├── components/
│       │   ├── ui/             # Componentes base shadcn/ui
│       │   ├── Navbar.tsx      # Navegação com dark mode toggle
│       │   ├── Filters.tsx     # Barra de filtros e busca
│       │   ├── EmpreendimentoTable.tsx
│       │   ├── EmpreendimentoCards.tsx
│       │   ├── EmpreendimentoModal.tsx  # Modal de cadastro/edição
│       │   ├── DashboardModal.tsx       # Modal drill-down dos gráficos
│       │   └── ...
│       ├── pages/
│       │   ├── Dashboard.tsx   # Dashboard com KPIs e gráficos
│       │   └── EmpreendimentoList.tsx   # Listagem com CRUD completo
│       ├── hooks/              # Custom hooks (dados, tema, municípios)
│       ├── services/           # Camada de comunicação com a API
│       └── types/              # Interfaces e enums TypeScript
│
├── docs/                       # Documentação técnica
│   ├── specs/                  # Especificação de design
│   └── plans/                  # Plano de implementação
│
└── package.json                # Scripts de orquestração do monorepo
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/empreendimentos` | Lista paginada com filtros (busca, segmento, município, ativo) |
| GET | `/api/empreendimentos/stats` | Estatísticas: KPIs, por segmento, top municípios, últimos cadastros |
| GET | `/api/empreendimentos/:id` | Busca por ID |
| POST | `/api/empreendimentos` | Cria novo empreendimento |
| PUT | `/api/empreendimentos/:id` | Atualiza empreendimento |
| DELETE | `/api/empreendimentos/:id` | Remove empreendimento |
| GET | `/api/municipios?busca=` | Autocomplete de municípios de SC |

## Como Executar

### Pré-requisitos
- **Node.js** 18+ instalado

### Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/Rafael-Leivas/Empreende-SC.git
cd Empreende-SC

# 2. Instale as dependências (raiz, server e client)
npm install

# 3. Configure o banco de dados (migrations + seed com municípios de SC)
cd server
npx prisma migrate dev --name init
npx prisma db seed
cd ..

# 4. Rode o projeto (server + client simultaneamente)
npm run dev
```

O servidor estará em `http://localhost:3000` e o client em `http://localhost:5173`.

> O Vite está configurado com proxy reverso, então todas as chamadas `/api/*` do front-end são redirecionadas automaticamente para o back-end.

## Vídeo Pitch

[Link do vídeo pitch aqui]

## Autor

**Rafael Bortnik Leivas**

Desenvolvido como parte do processo seletivo SCTEC — Trilha IA para DEVs (SENAI/SC LAB365).
