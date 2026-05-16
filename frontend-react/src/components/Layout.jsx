import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { AIChatPanel } from './AIChatPanel'
import { CommandPalette } from './CommandPalette'
import { toast } from './Toast'
import { taskService } from '../services/taskService'

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/tasks':        'Mis Tareas',
  '/tasks/kanban': 'Tablero Kanban',
  '/tasks/new':    'Nueva Tarea',
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === '1')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  // Cmd/Ctrl+K global shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Notificaciones de vencimiento — una sola vez por sesión (lógica intacta)
  useEffect(() => {
    if (sessionStorage.getItem('expiry_notified')) return
    sessionStorage.setItem('expiry_notified', '1')
    taskService.getAll().then(tareas => {
      const toDay = (v) => { const d = new Date(v); d.setHours(0, 0, 0, 0); return d }
      const today    = toDay(new Date())
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)

      const urgentes = tareas.filter(t => {
        if (!t.fechaVencimiento || t.estado === 'COMPLETADA' || t.estado === 'CANCELADA') return false
        const vc = toDay(t.fechaVencimiento)
        return vc >= today && vc <= tomorrow
      })

      if (urgentes.length === 0) return
      setTimeout(() => {
        urgentes.forEach(t => {
          const isHoy = toDay(t.fechaVencimiento).getTime() === today.getTime()
          toast.error(`"${t.titulo}" vence ${isHoy ? 'hoy' : 'mañana'}`)
        })
      }, 1200)
    }).catch(() => {})
  }, [])

  const title = PAGE_TITLES[pathname]
    || (pathname.includes('/edit') ? 'Editar Tarea'
    : pathname.match(/\/tasks\/\d+$/) ? 'Detalle de Tarea'
    : 'UniWork Planner')

  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
        onOpenCommand={() => setPaletteOpen(true)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-12 bg-surface/80 backdrop-blur-md border-b border-border flex items-center px-3 lg:px-5 gap-3 flex-shrink-0 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-md text-muted-fg hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Abrir menú"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">{title}</h1>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md border border-border bg-surface text-xs text-ink-faint hover:border-border-2 hover:text-muted-fg transition-colors"
              title="Buscar"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Buscar</span>
              <span className="kbd">{isMac ? '⌘' : 'Ctrl'}K</span>
            </button>
          </div>
        </header>

        {/* Content with route transitions */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 md:p-8 max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <AIChatPanel />
    </div>
  )
}
