import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AutoComplete } from '@/components/AutoComplete'
import { SEGMENTO_LABELS } from '@/components/Badge'
import { useMunicipios } from '@/hooks/useMunicipios'
import { api } from '@/services/api'
import { Segmento } from '@/types'
import type { Empreendimento } from '@/types'
import { cn } from '@/lib/utils'
import { Loader2, Building2, User, MapPin, Tag, Phone, Power } from 'lucide-react'

interface Props {
  open: boolean
  empreendimento?: Empreendimento | null
  onClose: () => void
  onSaved: () => void
}

export function EmpreendimentoModal({ open, empreendimento, onClose, onSaved }: Props) {
  const isEdit = !!empreendimento
  const { options, loading: munLoading, search: searchMunicipios } = useMunicipios()

  const [form, setForm] = useState({
    nome: '', empreendedor: '', municipio: '', segmento: '' as string, contato: '', ativo: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && empreendimento) {
      setForm({
        nome: empreendimento.nome,
        empreendedor: empreendimento.empreendedor,
        municipio: empreendimento.municipio,
        segmento: empreendimento.segmento,
        contato: empreendimento.contato,
        ativo: empreendimento.ativo,
      })
    } else if (open) {
      setForm({ nome: '', empreendedor: '', municipio: '', segmento: '', contato: '', ativo: true })
    }
    setErrors({})
  }, [open, empreendimento])

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
      if (isEdit && empreendimento) {
        await api.empreendimentos.update(empreendimento.id, data)
      } else {
        await api.empreendimentos.create(data)
      }
      onSaved()
      onClose()
    } catch (err: any) {
      setErrors({ form: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-lg border-border/50 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 animate-scale-in">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{isEdit ? 'Editar Empreendimento' : 'Novo Empreendimento'}</DialogTitle>
              <DialogDescription>
                {isEdit ? 'Altere os dados do empreendimento.' : 'Preencha os dados para cadastrar.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {errors.form && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg animate-fade-in">{errors.form}</div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              Nome do Empreendimento *
            </label>
            <Input
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: TechVale Solutions"
              className={cn('bg-background/50', errors.nome && 'border-destructive focus-visible:ring-destructive')}
            />
            {errors.nome && <p className="text-xs text-destructive animate-fade-in">{errors.nome}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Empreendedor Responsável *
            </label>
            <Input
              value={form.empreendedor}
              onChange={e => setForm({ ...form, empreendedor: e.target.value })}
              placeholder="Ex: Ana Souza"
              className={cn('bg-background/50', errors.empreendedor && 'border-destructive focus-visible:ring-destructive')}
            />
            {errors.empreendedor && <p className="text-xs text-destructive animate-fade-in">{errors.empreendedor}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Município *
              </label>
              <AutoComplete
                value={form.municipio}
                onChange={v => setForm({ ...form, municipio: v })}
                options={options}
                onSearch={searchMunicipios}
                loading={munLoading}
                placeholder="Digite o município..."
                error={errors.municipio}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                Segmento *
              </label>
              <Select value={form.segmento || undefined} onValueChange={v => setForm({ ...form, segmento: v })}>
                <SelectTrigger className={cn('bg-background/50', errors.segmento && 'border-destructive focus-visible:ring-destructive')}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Segmento).map(s => (
                    <SelectItem key={s} value={s}>{SEGMENTO_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.segmento && <p className="text-xs text-destructive animate-fade-in">{errors.segmento}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Contato *
            </label>
            <Input
              value={form.contato}
              onChange={e => setForm({ ...form, contato: e.target.value })}
              placeholder="(00) 00000-0000 ou email@exemplo.com"
              className={cn('bg-background/50', errors.contato && 'border-destructive focus-visible:ring-destructive')}
            />
            <p className="text-xs text-muted-foreground">Telefone ou e-mail de contato</p>
            {errors.contato && <p className="text-xs text-destructive animate-fade-in">{errors.contato}</p>}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Power className={cn('h-4 w-4', form.ativo ? 'text-emerald-500' : 'text-muted-foreground')} />
              <div>
                <label className="text-sm font-medium">Status</label>
                <p className="text-xs text-muted-foreground">{form.ativo ? 'Empreendimento ativo' : 'Empreendimento inativo'}</p>
              </div>
            </div>
            <Switch checked={form.ativo} onCheckedChange={v => setForm({ ...form, ativo: v })} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting} className="flex-1 shadow-sm">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-border/50">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
