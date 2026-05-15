import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/tasks',     icon: '☰', label: 'Mis Tareas' },
  { to: '/tasks/kanban', icon: '⊞', label: 'Tablero Kanban' },
]
const secondary = [
  { to: '/tasks/new', icon: '+', label: 'Nueva Tarea' },
]

export function Sidebar({ open, onClose }) {
  return (
    <>
      {/* overlay mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar z-40 flex flex-col
                    transition-transform duration-250 ease-out
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm font-mono">
            GP
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Gestor</p>
            <p className="text-teal-400/70 text-xs">Pendientes ITM</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs text-white/30 uppercase tracking-widest px-3 mb-2 font-mono">Navegación</p>
          {links.map(l => (
            <NavLink
              key={l.to} to={l.to} end={l.to === '/tasks'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="w-5 text-center font-mono opacity-70">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}

          <p className="text-xs text-white/30 uppercase tracking-widest px-3 mt-5 mb-2 font-mono">Acciones</p>
          {secondary.map(l => (
            <NavLink
              key={l.to} to={l.to}
              onClick={onClose}
              className="sidebar-link text-accent hover:text-accent"
            >
              <span className="w-5 text-center text-accent font-bold">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/30 font-mono">ITM — Prog. Software 2026</p>
        </div>
      </aside>
    </>
  )
}
