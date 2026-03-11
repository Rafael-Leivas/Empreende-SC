import { useState, useEffect } from 'react'
import { useEmpreendimentos } from '@/hooks/useEmpreendimentos'
import { Filters } from '@/components/Filters'
import { EmpreendimentoTable } from '@/components/EmpreendimentoTable'
import { EmpreendimentoCards } from '@/components/EmpreendimentoCards'
import { Pagination } from '@/components/Pagination'
import { Modal } from '@/components/Modal'
import { EmpreendimentoModal } from '@/components/EmpreendimentoModal'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import type { Empreendimento } from '@/types'
import { Plus, Loader2, Building2 } from 'lucide-react'

export function EmpreendimentoList() {
  const [busca, setBusca] = useState('')
  const [segmento, setSegmento] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [ativo, setAtivo] = useState('')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [deleteTarget, setDeleteTarget] = useState<Empreendimento | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Empreendimento | null>(null)

  const [debouncedBusca, setDebouncedBusca] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedBusca(busca), 300)
    return () => clearTimeout(t)
  }, [busca])

  const { data, total, limit, loading, refetch } = useEmpreendimentos({
    busca: debouncedBusca, segmento, municipio, ativo, page,
  })

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

  function handleNew() {
    setEditTarget(null)
    setFormOpen(true)
  }

  function handleEdit(id: number) {
    const emp = data.find(e => e.id === id)
    if (emp) {
      setEditTarget(emp)
      setFormOpen(true)
    }
  }

  function handleSaved() {
    refetch()
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Empreendimentos</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Carregando...' : `${total} registro${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <Button onClick={handleNew} className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Empreendimento
        </Button>
      </div>

      <Filters
        busca={busca} segmento={segmento} municipio={municipio} ativo={ativo} viewMode={viewMode}
        onBuscaChange={setBusca} onSegmentoChange={setSegmento} onMunicipioChange={setMunicipio}
        onAtivoChange={setAtivo} onViewModeChange={setViewMode}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse-soft">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          <p className="text-sm text-muted-foreground mt-3">Carregando empreendimentos...</p>
        </div>
      ) : viewMode === 'table' ? (
        <EmpreendimentoTable data={data} onEdit={handleEdit} onDelete={setDeleteTarget} />
      ) : (
        <EmpreendimentoCards data={data} onEdit={handleEdit} onDelete={setDeleteTarget} />
      )}

      <Pagination page={page} total={total} limit={limit} onChange={setPage} />

      <Modal
        open={!!deleteTarget}
        title="Excluir empreendimento?"
        message={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <EmpreendimentoModal
        open={formOpen}
        empreendimento={editTarget}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  )
}
