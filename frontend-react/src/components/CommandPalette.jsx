import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { taskService } from '../services/taskService'

const STATIC_COMMANDS = [
  { id: 'nav-dashboard', label: 'Ir al Dashboard',    hint: 'Navegación', to: '/dashboard' },
  { id: 'nav-tasks',     label: 'Ver Mis Tareas',     hint: 'Navegación', to: '/tasks' },
  { id: 'nav-kanban',    label: 'Ver Tablero Kanban', hint: 'Navegación', to: '/tasks/kanban' },
  { id: 'act-new',       label: 'Crear nueva tarea',  hint: 'Acción',     to: '/tasks/new' },
]

export function CommandPalette({ open, onClose }) {
  const [q, setQ]           = useState('')
  const [tareas, setTareas] = useState([])
  const [sel, setSel]       = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setQ(''); setSel(0)
    taskService.getAll().then(setTareas).catch(() => {})
    setTimeout(() => inputRef.current?.focus(), 60)
  }, [open])

  const items = useMemo(() => {
    const norm = (s) => (s || '').toLowerCase()
    const query = norm(q)

    const tareaItems = tareas.map(t => ({
      id: `task-${t.idTarea}`,
      label: t.titulo,
      hint: `#${t.idTarea} · ${t.estado?.replace('_', ' ') || ''}`,
      to: `/tasks/${t.idTarea}`,
    }))

    const all = [...STATIC_COMMANDS, ...tareaItems]
    if (!query) return all.slice(0, 12)
    return all.filter(it =>
      norm(it.label).includes(query) || norm(it.hint).includes(query)
    ).slice(0, 12)
  }, [q, tareas])

  useEffect(() => { setSel(0) }, [q])

  const choose = (it) => { if (!it) return; navigate(it.to); onClose() }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, items.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter')   { e.preventDefault(); choose(items[sel]) }
    else if (e.key === 'Escape')  { e.preventDefault(); onClose() }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[3px]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-xl bg-surface rounded-xl shadow-pop border border-border overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-faint">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Buscar tareas, ir a página..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-faint"
              />
              <span className="kbd">ESC</span>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto py-1">
              {items.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-ink-faint">Sin resultados</div>
              )}
              {items.map((it, i) => (
                <button
                  key={it.id}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => choose(it)}
                  className={`w-full px-4 py-2 flex items-center gap-3 text-left text-sm transition-colors ${
                    i === sel ? 'bg-muted-2' : 'hover:bg-muted'
                  }`}
                >
                  <span className="flex-1 truncate text-foreground">{it.label}</span>
                  <span className="text-2xs text-ink-faint font-mono flex-shrink-0">{it.hint}</span>
                </button>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-border flex items-center gap-3 text-2xs text-ink-faint">
              <span className="flex items-center gap-1"><span className="kbd">↑</span><span className="kbd">↓</span> navegar</span>
              <span className="flex items-center gap-1"><span className="kbd">↵</span> abrir</span>
              <span className="ml-auto font-mono">{tareas.length} tareas indexadas</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
