import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Building2, Sun, Moon, Rocket } from 'lucide-react'

interface Props {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Navbar({ theme, onToggleTheme }: Props) {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, match: (p: string) => p === '/' },
    { to: '/empreendimentos', label: 'Empreendimentos', icon: Building2, match: (p: string) => p.startsWith('/empreendimentos') },
  ]

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-card/80 border-b border-border/50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-foreground text-base tracking-tight">Empreende SC</span>
            <span className="hidden sm:block text-[10px] text-muted-foreground leading-none -mt-0.5">Ecossistema Catarinense</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon, match }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                match(pathname)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
              {match(pathname) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </nav>
  )
}
