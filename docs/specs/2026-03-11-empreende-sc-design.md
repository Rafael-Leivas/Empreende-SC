# Empreende SC — Design Spec

## Visão Geral

Aplicação full-stack CRUD para gerenciar empreendimentos catarinenses. Desafio técnico do processo seletivo SCTEC / IA para DEVs do SENAI/SC LAB365.

**Stack:** Node.js + Express + TypeScript + Prisma + SQLite (back) | React + TypeScript + Vite + Tailwind CSS (front)

**Acesso:** Aberto, sem autenticação.

## Modelo de Dados

### Empreendimento

| Campo         | Tipo     | Detalhes                                                        |
|---------------|----------|-----------------------------------------------------------------|
| id            | Int      | PK, auto-increment                                              |
| nome          | String   | Nome do empreendimento                                           |
| empreendedor  | String   | Nome do responsável                                              |
| municipio     | String   | Município de SC (texto livre, alimentado via autocomplete)       |
| segmento      | Enum     | TECNOLOGIA, COMERCIO, INDUSTRIA, SERVICOS, AGRONEGOCIO          |
| contato       | String   | Telefone ou e-mail                                               |
| ativo         | Boolean  | Default: true                                                    |
| createdAt     | DateTime | Auto                                                             |
| updatedAt     | DateTime | Auto                                                             |

### Municipio

| Campo | Tipo   | Detalhes                              |
|-------|--------|---------------------------------------|
| id    | Int    | PK, auto-increment                    |
| nome  | String | Unique, nome do município             |

Pré-populada via seed com os 295 municípios de SC. Usada para alimentar o autocomplete — o campo `municipio` no empreendimento é string (não FK).

Segmento como enum do Prisma (lista fixa e pequena, não justifica tabela separada).

### Validação de Campos

| Campo         | Regras                                           |
|---------------|--------------------------------------------------|
| nome          | Obrigatório, 2-200 caracteres                    |
| empreendedor  | Obrigatório, 2-200 caracteres                    |
| municipio     | Obrigatório, não-vazio                           |
| segmento      | Obrigatório, deve ser um dos 5 valores do enum   |
| contato       | Obrigatório, 5-200 caracteres (sem validação de formato — aceita telefone ou e-mail) |
| ativo         | Opcional, default true                           |

### Seed

- **Municípios:** seed com os 295 municípios de SC (obrigatório)
- **Empreendimentos:** seed com 15-20 registros de exemplo para demonstração, distribuídos entre os 5 segmentos e vários municípios

## API REST

### Empreendimentos

| Método | Rota                          | Descrição                                                            |
|--------|-------------------------------|----------------------------------------------------------------------|
| GET    | /api/empreendimentos          | Listar com filtros: `busca`, `segmento`, `municipio`, `ativo`, `page`, `limit` |
| GET    | /api/empreendimentos/stats    | Métricas para o dashboard (registrar ANTES de /:id)                  |
| GET    | /api/empreendimentos/:id      | Detalhe de um empreendimento                                         |
| POST   | /api/empreendimentos          | Criar novo                                                           |
| PUT    | /api/empreendimentos/:id      | Atualizar                                                            |
| DELETE | /api/empreendimentos/:id      | Deletar                                                              |

### Municípios

| Método | Rota                          | Descrição                              |
|--------|-------------------------------|----------------------------------------|
| GET    | /api/municipios?busca=flori   | Busca para autocomplete (top 10)       |

**Paginação:** `page` e `limit` (default: 10 por página). Resposta paginada:

```json
{ "data": [...], "total": 46, "page": 1, "limit": 10 }
```

**Validação:** Zod nos controllers.

**Busca:** O parâmetro `busca` faz substring match case-insensitive nos campos `nome` e `empreendedor`.

**Erros:** Formato padrão de erro:

```json
{ "error": "Mensagem descritiva" }
```

HTTP status codes: 400 (validação), 404 (não encontrado), 500 (erro interno).

**DELETE:** Hard delete — remove o registro do banco. O campo `ativo` é toggle de status de negócio, não soft-delete.

**CORS:** Express configurado com `cors()` para aceitar requests do Vite dev server.

### Endpoint de Stats — Resposta

O GET `/api/empreendimentos/stats` retorna todos os dados necessários para o dashboard:

```json
{
  "total": 46,
  "ativos": 38,
  "inativos": 8,
  "taxaAtividade": 82.6,
  "novosEsteMes": 3,
  "municipiosAlcancados": 18,
  "porSegmento": [
    { "segmento": "TECNOLOGIA", "total": 12, "ativos": 10, "inativos": 2 },
    { "segmento": "COMERCIO", "total": 8, "ativos": 7, "inativos": 1 },
    { "segmento": "INDUSTRIA", "total": 5, "ativos": 4, "inativos": 1 },
    { "segmento": "SERVICOS", "total": 15, "ativos": 12, "inativos": 3 },
    { "segmento": "AGRONEGOCIO", "total": 6, "ativos": 5, "inativos": 1 }
  ],
  "topMunicipios": [
    { "municipio": "Florianópolis", "total": 14 },
    { "municipio": "Joinville", "total": 9 },
    { "municipio": "Blumenau", "total": 7 },
    { "municipio": "Chapecó", "total": 5 },
    { "municipio": "Criciúma", "total": 4 }
  ],
  "ultimosCadastros": [
    { "id": 46, "nome": "TechVale Solutions", "empreendedor": "Ana Souza", "municipio": "Florianópolis", "segmento": "TECNOLOGIA", "ativo": true },
    { "id": 45, "nome": "Agro Sul Orgânicos", "empreendedor": "Carlos Müller", "municipio": "Chapecó", "segmento": "AGRONEGOCIO", "ativo": true },
    { "id": 44, "nome": "Blumenau Têxtil", "empreendedor": "Maria Schmidt", "municipio": "Blumenau", "segmento": "INDUSTRIA", "ativo": false }
  ]
}
```

**Notas sobre stats:**
- `novosEsteMes`: conta registros onde `createdAt` cai no mês calendário atual
- `ultimosCadastros`: até 3 registros, ordenados por `createdAt` desc
- `topMunicipios`: até 5 municípios, ranking por total (ativos + inativos)
- `porSegmento`: sempre retorna todos os 5 segmentos (mesmo com total 0)

## Estrutura de Pastas

```
/server
  /src
    /routes          # Definição das rotas Express
    /controllers     # Lógica dos endpoints
    /validators      # Schemas Zod
    app.ts           # Setup do Express (middlewares, rotas)
    server.ts        # Entrypoint (listen)
  /prisma
    schema.prisma
    seed.ts          # Seed de municípios + empreendimentos de exemplo
  package.json
  tsconfig.json

/client
  /src
    /components      # Table, Card, Filters, AutoComplete, Modal, Toggle, Pagination...
    /pages           # Dashboard, EmpreendimentoList, EmpreendimentoForm
    /hooks           # useEmpreendimentos, useMunicipios, useStats
    /services        # API client (fetch wrapper)
    /types           # Tipos TypeScript
    App.tsx
    main.tsx
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.js

package.json          # Raiz — scripts para rodar ambos
```

## Telas

### 1. Dashboard

- **KPIs gerais (4 cards):** total de empreendimentos (+novos no mês), taxa de atividade (% ativos), municípios alcançados (de 295), segmento líder
- **Cards por segmento (5 cards):** cada um com total, ativos/inativos, barra de progresso com % do total
- **3 painéis:** distribuição por segmento (barras horizontais ordenadas), ativos vs inativos (barras empilhadas com %), top 5 municípios (ranking)
- **Últimos cadastros:** mini-tabela com os 3 mais recentes, badges de segmento e status, link "Ver todos"
- **Estados:** loading (spinner), vazio (mensagem + CTA "Cadastre o primeiro empreendimento")

### 2. Listagem de Empreendimentos

- **Filtros:** busca por nome (input), segmento (select), município (input autocomplete), status (select)
- **Toggle de visualização:** tabela ou cards
- **Modo tabela:** colunas nome, empreendedor, município, segmento (badge), status (badge), ações (editar/excluir)
- **Modo cards:** grid 3 colunas com nome, empreendedor, localização, segmento, contato, status no canto, ações no rodapé
- **Paginação:** "Mostrando X-Y de Z" com navegação numérica
- **Botão:** "+ Novo Empreendimento" no header

### 3. Formulário (Criar/Editar)

- **Campos:** nome (text), empreendedor (text), município (autocomplete), segmento (select), contato (text com hint), status (toggle switch, default ativo)
- **Breadcrumb:** Empreendimentos > Novo/Editar
- **Validação:** campos obrigatórios com feedback visual (borda vermelha + mensagem de erro)
- **Ações:** Salvar e Cancelar
- **Edição:** mesma tela pré-preenchida com dados existentes

### 4. Modal de Exclusão

- Confirmação com nome do empreendimento destacado em bold
- Ícone de alerta
- Mensagem "Esta ação não pode ser desfeita"
- Botões Cancelar e Excluir (vermelho)

## Estilo Visual

- **Minimalista corporativo:** tons neutros (cinza/branco), tipografia limpa
- **Navbar:** fundo escuro (#1f2937), navegação Dashboard | Empreendimentos
- **Background:** #f9fafb
- **Cards/containers:** fundo branco, borda #e5e7eb, border-radius 8px
- **Badges de segmento:** cores distintas por segmento (azul=Tecnologia, roxo=Comércio, amarelo=Indústria, verde=Serviços, vermelho=Agronegócio)
- **Badges de status:** verde=Ativo, vermelho=Inativo
- **Fonte de destaque:** azul #3b82f6

## Abordagem Técnica

- **Arquitetura:** API REST clássica — rotas → controllers → Prisma direto (sem camada de serviço)
- **Validação back-end:** Zod
- **Front-end:** React Router para navegação, custom hooks para chamadas à API, fetch nativo (sem axios)
- **Gráficos do dashboard:** barras HTML/CSS puro (sem biblioteca de gráficos — mantém simples)
- **Responsividade:** Tailwind breakpoints para adaptar grid de cards e tabela

## Decisões e Trade-offs

| Decisão | Justificativa |
|---------|---------------|
| Sem autenticação | Escopo do desafio, simplifica implementação |
| Município como string (não FK) | Flexibilidade — autocomplete sugere, mas não força |
| Segmento como enum (não tabela) | Lista fixa e pequena de 5 itens |
| Fetch nativo (sem axios) | Menos dependências, API suficiente para o escopo |
| Gráficos em HTML/CSS | Sem overhead de Chart.js/Recharts para barras simples |
| SQLite | Requisito do desafio, zero config |
