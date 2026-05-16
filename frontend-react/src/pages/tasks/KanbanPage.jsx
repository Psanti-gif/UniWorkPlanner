import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { taskService } from '../../services/taskService'
import { PrioridadBadge } from '../../components/Badge'
import { PageLoader } from '../../components/LoadingSpinner'
import { toast } from '../../components/Toast'

const COLS = [
  { id: 'PENDIENTE',   label: 'Pendiente',    dot: 'bg-warning' },
  { id: 'EN_PROGRESO', label: 'En progreso',  dot: 'bg-info' },
  { id: 'COMPLETADA',  label: 'Completada',   dot: 'bg-success' },
  { id: 'CANCELADA',   label: 'Cancelada',    dot: 'bg-ink-faint' },
]

const PRIORITY_BAR = { ALTA: 'bg-danger', MEDIA: 'bg-warning', BAJA: 'bg-success' }

export function KanbanPage() {
  const [tareas, setTareas]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [dragOver, setDragOver] = useState(null)
  const draggingId = useRef(null)

  const load = () => {
    taskService.getAll()
      .then(setTareas)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const byCol = (colId) => tareas.filter(t => t.estado === colId)

  const onDragStart = (e, id) => {
    draggingId.current = id
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = async (e, colId) => {
    e.preventDefault(); setDragOver(null)
    const id = draggingId.current
    if (!id) return
    const tarea = tareas.find(t => t.idTarea === id)
    if (!tarea || tarea.estado === colId) return

    setTareas(prev => prev.map(t => t.idTarea === id ? { ...t, estado: colId } : t))
    try {
      await taskService.updateStatus(id, colId)
      toast.success(`Movido a ${colId.replace('_', ' ').toLowerCase()}`)
    } catch (err) {
      toast.error(err.message); load()
    }
    draggingId.current = null
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-foreground">Tablero Kanban</h1>
          <p className="text-sm text-muted-fg mt-1">Arrastra las tareas entre columnas</p>
        </div>
        <Link to="/tasks/new" className="btn-primary">+ Nueva tarea</Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 items-start">
        {COLS.map((col, colIdx) => {
          const items = byCol(col.id)
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: colIdx * 0.05 }}
              className={`kanban-col ${dragOver === col.id ? 'drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => onDrop(e, col.id)}
            >
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                  <span className="text-2xs font-semibold text-foreground uppercase tracking-wider">{col.label}</span>
                </div>
                <span className="text-2xs font-mono text-ink-faint">{items.length}</span>
              </div>

              <div className="space-y-1.5 min-h-[60px]">
                <AnimatePresence>
                  {items.map(t => {
                    const vc = t.fechaVencimiento ? new Date(t.fechaVencimiento) : null
                    const vencida = vc && vc < new Date() && t.estado !== 'COMPLETADA' && t.estado !== 'CANCELADA'
                    return (
                      <motion.div
                        key={t.idTarea}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="kanban-card"
                        draggable
                        onDragStart={e => onDragStart(e, t.idTarea)}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className={`w-0.5 h-4 mt-0.5 rounded-full flex-shrink-0 ${PRIORITY_BAR[t.prioridad] || 'bg-ink-faint'}`} />
                          <Link to={`/tasks/${t.idTarea}`} className="text-sm font-medium text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
                            {t.titulo}
                          </Link>
                        </div>
                        <div className="flex items-center justify-between pl-2.5">
                          <PrioridadBadge value={t.prioridad} />
                          {vc && (
                            <span className={`text-2xs font-mono ${vencida ? 'text-danger font-semibold' : 'text-ink-faint'}`}>
                              {vc.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                {items.length === 0 && (
                  <div className="rounded-md border border-dashed border-border-2 p-4 text-center text-2xs text-ink-faint">
                    Arrastrar aquí
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
