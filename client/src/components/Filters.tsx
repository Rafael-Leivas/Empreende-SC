import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Search, LayoutList, LayoutGrid, X } from 'lucide-react'
import { Segmento } from '@/types'
import { SEGMENTO_LABELS } from '@/components/Badge'
import { cn } from '@/lib/utils'

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
  const hasFilters = busca || segmento || municipio || ativo

  return (
    <Card className="p-4 mb-5 animate-fade-in-up border-border/50 shadow-sm">
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={busca}
            onChange={e => onBuscaChange(e.target.value)}
            placeholder="Buscar por nome..."
            className="pl-9 bg-background/50"
          />
        </div>

        <Select value={segmento || undefined} onValueChange={v => onSegmentoChange(v === '_all' ? '' : v)}>
          <SelectTrigger className="min-w-[160px] w-auto bg-background/50">
            <SelectValue placeholder="Segmento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Todos os segmentos</SelectItem>
            {Object.values(Segmento).map(s => (
              <SelectItem key={s} value={s}>{SEGMENTO_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={municipio}
          onChange={e => onMunicipioChange(e.target.value)}
          placeholder="Município..."
          className="min-w-[140px] w-[160px] bg-background/50"
        />

        <Select value={ativo || undefined} onValueChange={v => onAtivoChange(v === '_all' ? '' : v)}>
          <SelectTrigger className="min-w-[120px] w-auto bg-background/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Todos os status</SelectItem>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { onBuscaChange(''); onSegmentoChange(''); onMunicipioChange(''); onAtivoChange('') }}
            className="text-muted-foreground hover:text-foreground h-9 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}

        <div className="flex rounded-lg border border-border overflow-hidden ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('table')}
            className={cn(
              'rounded-none h-9 px-3 border-0',
              viewMode === 'table'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm'
                : 'hover:bg-accent'
            )}
          >
            <LayoutList className="h-4 w-4 mr-1.5" />
            Tabela
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('cards')}
            className={cn(
              'rounded-none h-9 px-3 border-0',
              viewMode === 'cards'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm'
                : 'hover:bg-accent'
            )}
          >
            <LayoutGrid className="h-4 w-4 mr-1.5" />
            Cards
          </Button>
        </div>
      </div>
    </Card>
  )
}
