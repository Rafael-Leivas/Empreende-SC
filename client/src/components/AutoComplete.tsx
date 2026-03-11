import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Municipio } from '@/types'
import { Loader2 } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  options: Municipio[]
  onSearch: (busca: string) => void
  loading?: boolean
  placeholder?: string
  error?: string
}

export function AutoComplete({ value, onChange, options, onSearch, loading, placeholder, error }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Input
          value={value}
          onChange={e => { onChange(e.target.value); onSearch(e.target.value); setOpen(true) }}
          onFocus={() => options.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className={cn('bg-background/50', error && 'border-destructive focus-visible:ring-destructive')}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {error && <p className="text-xs text-destructive mt-1 animate-fade-in">{error}</p>}
      {open && options.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border/50 rounded-lg shadow-lg max-h-48 overflow-auto animate-fade-in-down">
          {options.map(m => (
            <div
              key={m.id}
              onClick={() => { onChange(m.nome); setOpen(false) }}
              className="px-3 py-2.5 text-sm cursor-pointer hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {m.nome}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
