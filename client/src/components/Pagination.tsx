import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  page: number
  total: number
  limit: number
  onChange: (page: number) => void
}

export function Pagination({ page, total, limit, onChange }: Props) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  const pages: number[] = []
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pages.push(i)
  }

  return (
    <div className="flex justify-between items-center mt-5 animate-fade-in">
      <span className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium text-foreground">{start}-{end}</span> de <span className="font-medium text-foreground">{total}</span>
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="icon" onClick={() => onChange(page - 1)} disabled={page === 1} className="h-9 w-9 border-border/50">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages[0] > 1 && (
          <>
            <Button variant="outline" size="sm" onClick={() => onChange(1)} className="h-9 w-9 p-0 border-border/50">1</Button>
            {pages[0] > 2 && <span className="flex items-center px-1 text-muted-foreground">...</span>}
          </>
        )}
        {pages.map(p => (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(p)}
            className={cn(
              'h-9 w-9 p-0',
              p === page ? 'pointer-events-none shadow-sm' : 'border-border/50'
            )}
          >
            {p}
          </Button>
        ))}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="flex items-center px-1 text-muted-foreground">...</span>}
            <Button variant="outline" size="sm" onClick={() => onChange(totalPages)} className="h-9 w-9 p-0 border-border/50">{totalPages}</Button>
          </>
        )}
        <Button variant="outline" size="icon" onClick={() => onChange(page + 1)} disabled={page === totalPages} className="h-9 w-9 border-border/50">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
