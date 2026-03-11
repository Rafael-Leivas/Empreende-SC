import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { SegmentoBadge, StatusBadge } from '@/components/Badge'
import { api } from '@/services/api'
import type { Empreendimento, ListFilters } from '@/types'
import { Loader2, Building2, MapPin, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export interface DashboardFilter {
  label: string
  filters: ListFilters
}

interface Props {
  open: boolean
  filter: DashboardFilter | null
  onClose: () => void
}

export function DashboardModal({ open, filter, onClose }: Props) {
  const [data, setData] = useState<Empreendimento[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open || !filter) return
    setLoading(true)
    api.empreendimentos.list({ ...filter.filters, limit: 50 })
      .then(res => { setData(res.data); setTotal(res.total) })
      .catch(() => { setData([]); setTotal(0) })
      .finally(() => setLoading(false))
  }, [open, filter])

  function handleViewAll() {
    if (!filter) return
    const params = new URLSearchParams()
    Object.entries(filter.filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v))
    })
    onClose()
    navigate(`/empreendimentos?${params}`)
  }

  if (!filter) return null

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl border-border/50 shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 animate-scale-in">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{filter.label}</DialogTitle>
              <DialogDescription>
                {loading ? 'Carregando...' : `${total} empreendimento${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-auto flex-1 -mx-6 px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 animate-pulse-soft">
              <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
              <p className="text-sm text-muted-foreground mt-2">Carregando...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Nenhum empreendimento encontrado.
            </div>
          ) : (
            <div className="space-y-3 pb-2">
              {data.map((emp, i) => (
                <div
                  key={emp.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card border border-border/50 text-sm font-bold text-muted-foreground">
                    {emp.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-foreground text-sm">{emp.nome}</h4>
                      <SegmentoBadge segmento={emp.segmento} />
                      <StatusBadge ativo={emp.ativo} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{emp.empreendedor}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{emp.municipio}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{emp.contato}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && total > 0 && (
          <div className="pt-3 border-t border-border/50 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAll}
              className="border-border/50"
            >
              Ver todos em Empreendimentos
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
