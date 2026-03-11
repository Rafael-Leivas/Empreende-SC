import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStats } from '@/hooks/useStats'
import { SegmentoBadge, StatusBadge, SEGMENTO_LABELS } from '@/components/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardModal, type DashboardFilter } from '@/components/DashboardModal'
import { Segmento } from '@/types'
import { ArrowRight, Loader2, TrendingUp, Activity, MapPin, Trophy, BarChart3, Rocket } from 'lucide-react'

const SEGMENTO_COLORS: Record<Segmento, string> = {
  [Segmento.TECNOLOGIA]: '#6366f1',
  [Segmento.COMERCIO]: '#8b5cf6',
  [Segmento.INDUSTRIA]: '#f59e0b',
  [Segmento.SERVICOS]: '#10b981',
  [Segmento.AGRONEGOCIO]: '#ef4444',
}

const SEGMENTO_GRADIENT: Record<Segmento, string> = {
  [Segmento.TECNOLOGIA]: 'from-blue-500/20 to-indigo-500/5',
  [Segmento.COMERCIO]: 'from-purple-500/20 to-violet-500/5',
  [Segmento.INDUSTRIA]: 'from-amber-500/20 to-yellow-500/5',
  [Segmento.SERVICOS]: 'from-emerald-500/20 to-green-500/5',
  [Segmento.AGRONEGOCIO]: 'from-rose-500/20 to-red-500/5',
}

const SEGMENTO_ACCENT: Record<Segmento, string> = {
  [Segmento.TECNOLOGIA]: 'text-blue-600 dark:text-blue-400',
  [Segmento.COMERCIO]: 'text-purple-600 dark:text-purple-400',
  [Segmento.INDUSTRIA]: 'text-amber-600 dark:text-amber-400',
  [Segmento.SERVICOS]: 'text-emerald-600 dark:text-emerald-400',
  [Segmento.AGRONEGOCIO]: 'text-rose-600 dark:text-rose-400',
}

export function Dashboard() {
  const { stats, loading, error } = useStats()
  const [modalFilter, setModalFilter] = useState<DashboardFilter | null>(null)

  function openSegmento(seg: string) {
    setModalFilter({
      label: `Empreendimentos — ${SEGMENTO_LABELS[seg as Segmento]}`,
      filters: { segmento: seg },
    })
  }

  function openMunicipio(municipio: string) {
    setModalFilter({
      label: `Empreendimentos — ${municipio}`,
      filters: { municipio },
    })
  }

  function openAtivos() {
    setModalFilter({
      label: 'Empreendimentos Ativos',
      filters: { ativo: 'true' },
    })
  }

  function openInativos() {
    setModalFilter({
      label: 'Empreendimentos Inativos',
      filters: { ativo: 'false' },
    })
  }

  function openTodos() {
    setModalFilter({
      label: 'Todos os Empreendimentos',
      filters: {},
    })
  }

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-pulse-soft">
      <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      <p className="text-sm text-muted-foreground mt-3">Carregando dashboard...</p>
    </div>
  )
  if (error) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="p-8 text-center border-destructive/20">
        <p className="text-destructive font-medium">{error}</p>
      </Card>
    </div>
  )
  if (!stats || stats.total === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Comece agora</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">Nenhum empreendimento cadastrado ainda. Cadastre o primeiro para ver o dashboard.</p>
        <Button asChild size="lg" className="shadow-md">
          <Link to="/empreendimentos">Cadastrar Empreendimento</Link>
        </Button>
      </div>
    )
  }

  const maxSegmento = stats.porSegmento.reduce((a, b) => a.total > b.total ? a : b)
  const sortedSegmentos = [...stats.porSegmento].sort((a, b) => b.total - a.total)

  const kpis = [
    { label: 'Total de Empreendimentos', value: stats.total, sub: `+${stats.novosEsteMes} este mês`, subColor: 'text-emerald-600 dark:text-emerald-400', icon: TrendingUp, iconColor: 'text-primary bg-primary/10', onClick: openTodos },
    { label: 'Taxa de Atividade', value: `${stats.taxaAtividade}%`, sub: `${stats.ativos} ativos · ${stats.inativos} inativos`, subColor: 'text-muted-foreground', icon: Activity, iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10', onClick: openAtivos },
    { label: 'Municípios Alcançados', value: stats.municipiosAlcancados, sub: 'de 295 municípios de SC', subColor: 'text-muted-foreground', icon: MapPin, iconColor: 'text-blue-600 dark:text-blue-400 bg-blue-500/10', onClick: openTodos },
    { label: 'Segmento Líder', value: SEGMENTO_LABELS[maxSegmento.segmento as Segmento], sub: `${maxSegmento.total} empreendimentos (${stats.total > 0 ? Math.round(maxSegmento.total / stats.total * 100) : 0}%)`, subColor: 'text-muted-foreground', icon: Trophy, iconColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10', onClick: () => openSegmento(maxSegmento.segmento) },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Visão geral dos empreendimentos catarinenses</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <Card
            key={kpi.label}
            className="overflow-hidden border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            onClick={kpi.onClick}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{kpi.value}</p>
                  <p className={`text-xs mt-1 ${kpi.subColor}`}>{kpi.sub}</p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${kpi.iconColor}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Segment Cards */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-3 animate-fade-in">Por Segmento</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.porSegmento.map((seg, i) => (
            <Card
              key={seg.segmento}
              className="overflow-hidden border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${(i + 4) * 60}ms`, animationFillMode: 'both' }}
              onClick={() => openSegmento(seg.segmento)}
            >
              <div className={`h-1 bg-gradient-to-r ${SEGMENTO_GRADIENT[seg.segmento as Segmento]}`} />
              <CardContent className="p-4">
                <p className={`text-xs font-medium ${SEGMENTO_ACCENT[seg.segmento as Segmento]}`}>{SEGMENTO_LABELS[seg.segmento as Segmento]}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{seg.total}</p>
                <div className="flex justify-between mt-2 text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400">{seg.ativos} ativos</span>
                  <span className="text-rose-500 dark:text-rose-400">{seg.inativos} inativos</span>
                </div>
                <div className="bg-muted/50 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${stats.total > 0 ? (seg.total / stats.total * 100) : 0}%`,
                      backgroundColor: SEGMENTO_COLORS[seg.segmento as Segmento],
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">{stats.total > 0 ? Math.round(seg.total / stats.total * 100) : 0}% do total</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Distribution */}
        <Card className="border-border/50 shadow-sm animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Distribuição por Segmento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {sortedSegmentos.map(seg => (
                <div
                  key={seg.segmento}
                  className="flex items-center gap-3 cursor-pointer group rounded-lg p-1.5 -mx-1.5 hover:bg-muted/40 transition-colors"
                  onClick={() => openSegmento(seg.segmento)}
                >
                  <span className="text-xs text-muted-foreground group-hover:text-foreground w-20 shrink-0 transition-colors">{SEGMENTO_LABELS[seg.segmento as Segmento]}</span>
                  <div className="flex-1 bg-muted/30 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                      style={{
                        width: `${stats.total > 0 ? (seg.total / maxSegmento.total * 100) : 0}%`,
                        backgroundColor: SEGMENTO_COLORS[seg.segmento as Segmento],
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-6 text-right">{seg.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active vs Inactive */}
        <Card className="border-border/50 shadow-sm animate-fade-in-up" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Ativos vs Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {sortedSegmentos.map(seg => {
                const pct = seg.total > 0 ? Math.round(seg.ativos / seg.total * 100) : 0
                return (
                  <div
                    key={seg.segmento}
                    className="flex items-center gap-3 cursor-pointer group rounded-lg p-1.5 -mx-1.5 hover:bg-muted/40 transition-colors"
                    onClick={() => openSegmento(seg.segmento)}
                  >
                    <span className="text-xs text-muted-foreground group-hover:text-foreground w-20 shrink-0 transition-colors">{SEGMENTO_LABELS[seg.segmento as Segmento]}</span>
                    <div className="flex-1 flex h-5 rounded-full overflow-hidden bg-muted/30">
                      <div className="bg-emerald-500 transition-all duration-700 ease-out rounded-l-full" style={{ width: `${pct}%` }} />
                      <div className="bg-rose-400/60 transition-all duration-700 ease-out rounded-r-full" style={{ width: `${100 - pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right font-medium">{pct}%</span>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-5 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors" onClick={openAtivos}><span className="h-2.5 w-2.5 bg-emerald-500 rounded-full" />Ativos</span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors" onClick={openInativos}><span className="h-2.5 w-2.5 bg-rose-400/60 rounded-full" />Inativos</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Municipalities */}
        <Card className="border-border/50 shadow-sm animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Top Municípios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {stats.topMunicipios.map((m, i) => (
                <div
                  key={m.municipio}
                  className="flex justify-between items-center px-3 py-2.5 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => openMunicipio(m.municipio)}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold w-5 text-center ${i < 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{m.municipio}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{m.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Registrations */}
      <Card className="border-border/50 shadow-sm animate-fade-in-up" style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-semibold">Últimos Cadastros</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs text-primary hover:text-primary h-auto p-1">
              <Link to="/empreendimentos" className="flex items-center gap-1">
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Empreendimento</TableHead>
                  <TableHead className="font-semibold">Empreendedor</TableHead>
                  <TableHead className="font-semibold">Município</TableHead>
                  <TableHead className="font-semibold">Segmento</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.ultimosCadastros.map(emp => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{emp.empreendedor}</TableCell>
                    <TableCell className="text-muted-foreground">{emp.municipio}</TableCell>
                    <TableCell><SegmentoBadge segmento={emp.segmento} /></TableCell>
                    <TableCell><StatusBadge ativo={emp.ativo} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DashboardModal
        open={!!modalFilter}
        filter={modalFilter}
        onClose={() => setModalFilter(null)}
      />
    </div>
  )
}
