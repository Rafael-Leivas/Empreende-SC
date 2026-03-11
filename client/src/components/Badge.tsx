import { Badge } from '@/components/ui/badge'
import { Segmento } from '@/types'
import { cn } from '@/lib/utils'

const SEGMENTO_COLORS: Record<Segmento, string> = {
  [Segmento.TECNOLOGIA]: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20',
  [Segmento.COMERCIO]: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20',
  [Segmento.INDUSTRIA]: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20',
  [Segmento.SERVICOS]: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20',
  [Segmento.AGRONEGOCIO]: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20',
}

export const SEGMENTO_LABELS: Record<Segmento, string> = {
  [Segmento.TECNOLOGIA]: 'Tecnologia',
  [Segmento.COMERCIO]: 'Comércio',
  [Segmento.INDUSTRIA]: 'Indústria',
  [Segmento.SERVICOS]: 'Serviços',
  [Segmento.AGRONEGOCIO]: 'Agronegócio',
}

export function SegmentoBadge({ segmento }: { segmento: Segmento | string }) {
  const seg = segmento as Segmento
  return (
    <Badge variant="outline" className={cn('border-0 font-medium transition-colors', SEGMENTO_COLORS[seg])}>
      {SEGMENTO_LABELS[seg]}
    </Badge>
  )
}

export function StatusBadge({ ativo }: { ativo: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0 font-medium gap-1.5 transition-colors',
        ativo
          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
          : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', ativo ? 'bg-emerald-500' : 'bg-rose-500')} />
      {ativo ? 'Ativo' : 'Inativo'}
    </Badge>
  )
}
