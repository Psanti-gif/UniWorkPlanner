import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { taskService } from '../../services/taskService'
import { PrioridadBadge, EstadoBadge, CategoriaBadge } from '../../components/Badge'
import { Modal } from '../../components/Modal'
import { PageLoader } from '../../components/LoadingSpinner'
import { toast } from '../../components/Toast'

export function TaskListPage() {
  const [tareas, setTareas]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const estado    = searchParams.get('estado')    || ''
  const prioridad = searchParams.get('prioridad') || ''
  const q         = searchParams.get('q')         || ''

  const load = () => {
    setLoading(true)
    taskService.getAll()
      .then(setTareas)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = tareas.filter(t => {
    if (estado    && t.estado    !== estado)    return false
    if (prioridad && t.prioridad !== prioridad) return false
    if (q && !t.titulo?.toLowerCase().includes(q.toLowerCase())
          && !t.descripcion?.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    setSearchParams(p)
  }

  const handleDelete = async () => {
    try {
      await taskService.delete(deleteId)
      toast.success('Tarea eliminada')
      setDeleteId(null); load()
    } catch (e) { toast.error(e.message); setDeleteId(null) }
  }

  const hasFilters = estado || prioridad || q

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-foreground">Mis tareas</h1>
          <p className="text-sm text-muted-fg mt-1">
            <span className="font-mono">{filtered.length}</span> {filtered.length === 1 ? 'tarea' : 'tareas'}
            {hasFilters && tareas.length !== filtered.length && <span className="text-ink-faint"> de {tareas.length}</span>}
          </p>
        </div>
        <Link to="/tasks/new" className="btn-primary">+ Nueva tarea</Link>
      </div>

      {/* Filters */}
      <div className="card p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <input className="input" placeholder="Buscar..." value={q} onChange={e => setFilter('q', e.target.value)} />
          <select className="select" value={estado} onChange={e => setFilter('estado', e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROGRESO">En progreso</option>
            <option value="COMPLETADA">Completada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <select className="select" value={prioridad} onChange={e => setFilter('prioridad', e.target.value)}>
            <option value="">Todas las prioridades</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
          <button onClick={() => setSearchParams({})} disabled={!hasFilters} className="btn-secondary justify-center disabled:opacity-50 disabled:cursor-not-allowed">Limpiar</button>
        </div>
      </div>

      {loading ? <PageLoader /> : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-muted-fg">No hay tareas que coincidan.</p>
          <Link to="/tasks/new" className="btn-secondary mt-3 inline-flex">+ Crear una</Link>
        </div>
      ) : (
        <>
          {/* TABLE desktop */}
          <div className="card hidden sm:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-2xs uppercase tracking-wider text-ink-faint border-b border-border">
                    <th className="px-4 py-2.5 text-left font-medium w-12">#</th>
                    <th className="px-4 py-2.5 text-left font-medium">Título</th>
                    <th className="px-4 py-2.5 text-left font-medium">Prioridad</th>
                    <th className="px-4 py-2.5 text-left font-medium">Estado</th>
                    <th className="px-4 py-2.5 text-left font-medium">Categoría</th>
                    <th className="px-4 py-2.5 text-left font-medium">Vencimiento</th>
                    <th className="px-4 py-2.5 text-right font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((t, i) => {
                    const vc = t.fechaVencimiento ? new Date(t.fechaVencimiento) : null
                    const vencida = vc && vc < new Date() && t.estado !== 'COMPLETADA' && t.estado !== 'CANCELADA'
                    return (
                      <motion.tr
                        key={t.idTarea}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: Math.min(i * 0.015, 0.3) }}
                        className="table-row group"
                      >
                        <td className="px-4 py-2.5 font-mono text-ink-faint text-2xs">{t.idTarea}</td>
                        <td className="px-4 py-2.5">
                          <Link to={`/tasks/${t.idTarea}`} className="font-medium text-foreground hover:text-primary transition-colors">{t.titulo}</Link>
                          {t.descripcion && <p className="text-2xs text-ink-faint truncate max-w-md mt-0.5">{t.descripcion}</p>}
                        </td>
                        <td className="px-4 py-2.5"><PrioridadBadge value={t.prioridad} /></td>
                        <td className="px-4 py-2.5"><EstadoBadge value={t.estado} /></td>
                        <td className="px-4 py-2.5"><CategoriaBadge value={t.categoria} /></td>
                        <td className={`px-4 py-2.5 text-2xs font-mono ${vencida ? 'text-danger font-semibold' : 'text-muted-fg'}`}>
                          {vc ? vc.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/tasks/${t.idTarea}/edit`} className="btn-ghost btn-sm" title="Editar">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </Link>
                            <button onClick={() => setDeleteId(t.idTarea)} className="btn-ghost btn-sm hover:text-danger" title="Eliminar">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CARDS mobile */}
          <div className="sm:hidden space-y-2">
            {filtered.map((t, i) => (
              <motion.div key={t.idTarea}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: Math.min(i * 0.02, 0.2) }}
                className="card card-hover p-3"
              >
                <Link to={`/tasks/${t.idTarea}`} className="block mb-2">
                  <p className="font-medium text-foreground">{t.titulo}</p>
                  {t.descripcion && <p className="text-2xs text-ink-faint truncate mt-0.5">{t.descripcion}</p>}
                </Link>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <PrioridadBadge value={t.prioridad} />
                  <EstadoBadge value={t.estado} />
                  <CategoriaBadge value={t.categoria} />
                </div>
                <div className="flex gap-2">
                  <Link to={`/tasks/${t.idTarea}/edit`} className="btn-secondary btn-sm flex-1 justify-center">Editar</Link>
                  <button onClick={() => setDeleteId(t.idTarea)} className="btn-ghost btn-sm text-danger">Eliminar</button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <Modal open={!!deleteId} title="¿Eliminar tarea?" message="Esta acción no se puede deshacer." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
