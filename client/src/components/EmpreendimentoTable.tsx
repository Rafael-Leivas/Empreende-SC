import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { SegmentoBadge, StatusBadge } from '@/components/Badge'
import { Pencil, Trash2, Inbox } from 'lucide-react'
import type { Empreendimento } from '@/types'

interface Props {
  data: Empreendimento[]
  onEdit: (id: number) => void
  onDelete: (emp: Empreendimento) => void
}

export function EmpreendimentoTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm animate-fade-in-up">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold">Empreendimento</TableHead>
            <TableHead className="font-semibold">Empreendedor</TableHead>
            <TableHead className="font-semibold">Município</TableHead>
            <TableHead className="font-semibold">Segmento</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="text-center py-16">
                <div className="flex flex-col items-center gap-2">
                  <Inbox className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">Nenhum empreendimento encontrado</p>
                  <p className="text-muted-foreground/60 text-xs">Tente ajustar os filtros de busca</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((emp, i) => (
              <TableRow
                key={emp.id}
                className="group transition-colors"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <TableCell>
                  <div>
                    <span className="font-medium text-foreground">{emp.nome}</span>
                    <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">{emp.empreendedor}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{emp.empreendedor}</TableCell>
                <TableCell className="text-muted-foreground">{emp.municipio}</TableCell>
                <TableCell><SegmentoBadge segmento={emp.segmento} /></TableCell>
                <TableCell><StatusBadge ativo={emp.ativo} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end opacity-50 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(emp.id)} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(emp)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
