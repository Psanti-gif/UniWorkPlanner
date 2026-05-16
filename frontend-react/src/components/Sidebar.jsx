import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ICONS = {
  dashboard: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  list: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  kanban: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="6" height="14" /><rect x="11" y="3" width="6" height="10" />
      <rect x="19" y="3" width="2" height="7" />
    </svg>
  ),
  plus: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  collapse: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
    </svg>
  ),
}

const navItems = [
  { to: '/dashboard',    icon: 'dashboard', label: 'Dashboard' },
  { to: '/tasks',        icon: 'list',      label: 'Tareas',   end: true },
  { to: '/tasks/kanban', icon: 'kanban',    label: 'Kanban' },
]

export function Sidebar({ open, onClose, collapsed, onToggleCollapse, onOpenCommand }) {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-[2px] z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full bg-sidebar border-r border-border z-40 flex flex-col
                    transition-[width,transform] duration-300 ease-out
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:z-auto
                    ${collapsed ? 'w-[64px]' : 'w-[244px]'}`}
      >
        {/* Brand */}
        <div className={`flex items-center gap-2.5 px-3 h-12 border-b border-border ${collapsed ? 'justify-center px-2' : ''}`}>
          <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0">
            U
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-foreground font-semibold text-sm leading-tight truncate">UniWork</p>
              <p className="text-ink-faint text-2xs leading-tight">Planner</p>
            </div>
          )}
        </div>

        {/* Command palette trigger */}
        <button
          onClick={onOpenCommand}
          className={`mx-2 mt-3 flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-ink-faint hover:border-border-2 hover:text-muted-fg transition-colors ${collapsed ? 'justify-center px-0' : ''}`}
          title="Buscar (⌘K)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Buscar…</span>
              <span className="kbd">{isMac ? '⌘' : 'Ctrl'}K</span>
            </>
          )}
        </button>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {!collapsed && <p className="sidebar-section">Navegación</p>}
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0 opacity-80">{ICONS[item.icon]}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}

          {!collapsed && <p className="sidebar-section">Acciones</p>}
          <NavLink
            to="/tasks/new"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? 'Nueva tarea' : undefined}
          >
            <span className="flex-shrink-0 text-primary">{ICONS.plus}</span>
            {!collapsed && <span className="truncate">Nueva tarea</span>}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className={`px-3 py-3 border-t border-border flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <p className="text-2xs text-ink-faint font-mono">ITM · 2026</p>}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-ink-faint hover:bg-muted-2 hover:text-foreground transition-colors"
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <span className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>{ICONS.collapse}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
