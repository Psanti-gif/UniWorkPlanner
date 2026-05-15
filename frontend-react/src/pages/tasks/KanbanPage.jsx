import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { taskService } from '../../services/taskService'
import { PrioridadBadge } from '../../components/Badge'
import { PageLoader } from '../../components/LoadingSpinner'
import { toast } from '../../components/Toast'

const COLS = [
  { id: 'PENDIENTE',   label: 'Pendiente',   color: 'border-amber-400',  bg: 'bg-amber-50',  dot: 'bg-amber-400' },
  { id: 'EN_PROGRESO', label: 'En Progreso',  color: 'border-blue-400',   bg: 'bg-blue-50',   dot: 'bg-blue-400' },
  { id: 'COMPLETADA',  label: 'Completada',   color: 'border-emerald-400', bg: 'bg-emerald-50',dot: 'bg-emerald-400' },
  { id: 'CANCELADA',   label: 'Cancelada',    color: 'border-red-400',    bg: 'bg-red-50',    dot: 'bg-red-400' },
]

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
    e.preventDefault()
    setDragOver(null)
    const id = draggingId.current
    if (!id) return
    const tarea = tareas.find(t => t.idTarea === id)
    if (!tarea || tarea.estado === colId) return

    // Optimistic update
    setTareas(prev => prev.map(t => t.idTarea === id ? { ...t, estado: colId } : t))
    try {
      await taskService.updateStatus(id, colId)
      toast.success(`Movido a ${colId.replace('_', ' ')}`)
    } catch (err) {
      toast.error(err.message)
      load() // revert
    }
    draggingId.current = null
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">Tablero Kanban</h2>
        <Link to="/tasks/new" className="btn-primary btn-sm">+ Nueva Tarea</Link>
      </div>

      {/* Kanban board — UI/UX Skill: horizontal scroll on mobile */}
      <div className="flex gap-4 overflow-x-auto pb-4 items-start">
        {COLS.map(col => {
          const items = byCol(col.id)
          return (
            <div
              key={col.id}
              className={`kanban-col flex-shrink-0 w-64 border-t-4 ${col.color} ${dragOver === col.id ? 'ring-2 ring-primary/40 bg-primary/5' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => onDrop(e, col.id)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-xs font-semibold font-mono text-foreground uppercase tracking-wide">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-mono bg-white rounded-full px-2 py-0.5 text-muted-fg shadow-sm">
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[80px]">
                {items.map(t => {
                  const vc = t.fechaVencimiento ? new Date(t.fechaVencimiento) : null
                  const vencida = vc && vc < new Date() && t.estado !== 'COMPLETADA'
                  return (
                    <div
                      key={t.idTarea}
                      className={`kanban-card border-l-4 ${
                        t.prioridad === 'ALTA'  ? 'border-l-red-400' :
                        t.prioridad === 'MEDIA' ? 'border-l-amber-400' :
                        t.prioridad === 'BAJA'  ? 'border-l-emerald-400' : 'border-l-gray-300'
                      }`}
                      draggable
                      onDragStart={e => onDragStart(e, t.idTarea)}
                      onDragEnd={e => { e.currentTarget.style.opacity = '1' }}
                    >
                      <Link to={`/tasks/${t.idTarea}`} className="block mb-2">
                        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                          {t.titulo}
                        </p>
                      </Link>
                      <div className="flex items-center justify-between">
                        <PrioridadBadge value={t.prioridad} />
                        {vc && (
                          <span className={`text-xs font-mono ${vencida ? 'text-red-500 font-bold' : 'text-muted-fg'}`}>
                            {vc.toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
                {items.length === 0 && (
                  <div className={`rounded-lg border-2 border-dashed border-gray-200 p-4 text-center text-xs text-muted-fg ${col.bg}`}>
                    Arrastrar aquí
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
