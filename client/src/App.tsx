import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Dashboard } from '@/pages/Dashboard'
import { EmpreendimentoList } from '@/pages/EmpreendimentoList'
import { useTheme } from '@/hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/empreendimentos" element={<EmpreendimentoList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
