import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SegmentoBadge, StatusBadge } from '@/components/Badge'
import { MapPin, Tag, Phone, Pencil, Trash2, Inbox } from 'lucide-react'
import type { Empreendimento } from '@/types'

interface Props {
  data: Empreendimento[]
  onEdit: (id: number) => void
  onDelete: (emp: Empreendimento) => void
}

export function EmpreendimentoCards({ data, onEdit, onDelete }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <Inbox className="h-10 w-10 text-muted-foreground/40 mb-2" />
        <p className="text-muted-foreground text-sm">Nenhum empreendimento encontrado</p>
        <p className="text-muted-foreground/60 text-xs mt-1">Tente ajustar os filtros de busca</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((emp, i) => (
        <Card
          key={emp.id}
          className="group relative overflow-hidden border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2">
            <div className="absolute top-4 right-4"><StatusBadge ativo={emp.ativo} /></div>
            <h3 className="text-base font-semibold text-foreground pr-20 leading-snug">{emp.nome}</h3>
            <p className="text-xs text-muted-foreground">{emp.empreendedor}</p>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> <span>{emp.municipio}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> <SegmentoBadge segmento={emp.segmento} />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" /> <span>{emp.contato}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 pt-3 gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(emp.id)} className="text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(emp)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Excluir
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
