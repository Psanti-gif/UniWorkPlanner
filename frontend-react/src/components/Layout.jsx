import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/tasks':        'Mis Tareas',
  '/tasks/kanban': 'Tablero Kanban',
  '/tasks/new':    'Nueva Tarea',
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  const title = PAGE_TITLES[pathname]
    || (pathname.includes('/edit') ? 'Editar Tarea'
    : pathname.match(/\/tasks\/\d+$/) ? 'Detalle de Tarea'
    : 'Gestor de Pendientes')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar — UI/UX Skill: sticky nav with proper padding compensation */}
        <header className="h-14 bg-white border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Abrir menú"
          >
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
