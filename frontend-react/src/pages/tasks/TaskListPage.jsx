import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { taskService } from '../../services/taskService'
import { PrioridadBadge, EstadoBadge } from '../../components/Badge'
import { Modal } from '../../components/Modal'
import { PageLoader } from '../../components/LoadingSpinner'
import { toast } from '../../components/Toast'

export function TaskListPage() {
  const [tareas, setTareas] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const estado    = searchParams.get('estado')    || ''
  const prioridad = searchParams.get('prioridad') || ''
  const q         = searchParams.get('q')         || ''

  const load = () => {
    setLoading(true)
    taskService.getAll()
      .then(data => setTareas(data))
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
      toast.success('Tarea eliminada.')
      setDeleteId(null)
      load()
    } catch (e) {
      toast.error(e.message)
      setDeleteId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">Mis Tareas
          <span className="ml-2 text-sm font-mono font-normal text-muted-fg">({filtered.length})</span>
        </h2>
        <Link to="/tasks/new" className="btn-primary">+ Nueva</Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            className="input"
            placeholder="🔍 Buscar tareas..."
            value={q}
            onChange={e => setFilter('q', e.target.value)}
          />
          <select className="select" value={estado} onChange={e => setFilter('estado', e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="COMPLETADA">Completada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <select className="select" value={prioridad} onChange={e => setFilter('prioridad', e.target.value)}>
            <option value="">Todas las prioridades</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
          <button
            onClick={() => setSearchParams({})}
            className="btn-secondary"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {loading ? <PageLoader /> : (
        <>
          {/* TABLE — desktop */}
          <div className="card hidden sm:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted text-muted-fg text-xs uppercase tracking-wide font-mono">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Título</th>
                    <th className="px-4 py-3 text-left">Prioridad</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Categoría</th>
                    <th className="px-4 py-3 text-left">Vencimiento</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 && (
                    <tr><td colSpan="7" className="text-center py-12 text-muted-fg">
                      <p className="text-2xl mb-2">📭</p>
                      No hay tareas. <Link to="/tasks/new" className="text-primary hover:underline">Crea una</Link>
                    </td></tr>
                  )}
                  {filtered.map(t => {
                    const vc = t.fechaVencimiento ? new Date(t.fechaVencimiento) : null
                    const vencida = vc && vc < new Date() && t.estado !== 'COMPLETADA'
                    return (
                      <tr key={t.idTarea} className="table-row-hover">
                        <td className="px-4 py-3 font-mono text-muted-fg text-xs">#{t.idTarea}</td>
                        <td className="px-4 py-3">
                          <Link to={`/tasks/${t.idTarea}`} className="font-medium text-foreground hover:text-primary transition-colors">
                            {t.titulo}
                          </Link>
                          {t.descripcion && <p className="text-xs text-muted-fg truncate max-w-xs">{t.descripcion}</p>}
                        </td>
                        <td className="px-4 py-3"><PrioridadBadge value={t.prioridad} /></td>
                        <td className="px-4 py-3"><EstadoBadge value={t.estado} /></td>
                        <td className="px-4 py-3">
                          {t.categoria
                            ? <span className="badge bg-gray-100 text-gray-600">{t.categoria}</span>
                            : <span className="text-muted-fg">—</span>}
                        </td>
                        <td className={`px-4 py-3 text-xs font-mono ${vencida ? 'text-red-600 font-bold' : 'text-muted-fg'}`}>
                          {vc ? vc.toLocaleDateString('es-CO') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link to={`/tasks/${t.idTarea}`} className="btn-ghost btn-sm">Ver</Link>
                            <Link to={`/tasks/${t.idTarea}/edit`} className="btn-ghost btn-sm text-primary">Editar</Link>
                            <button onClick={() => setDeleteId(t.idTarea)} className="btn-ghost btn-sm text-red-500">Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CARDS — mobile */}
          <div className="sm:hidden space-y-3">
            {filtered.length === 0 && (
              <div className="card p-8 text-center text-muted-fg">
                <p className="text-2xl mb-2">📭</p>
                No hay tareas. <Link to="/tasks/new" className="text-primary">Crea una</Link>
              </div>
            )}
            {filtered.map(t => (
              <div key={t.idTarea} className="card p-4 border-l-4"
                   style={{ borderLeftColor: t.prioridad === 'ALTA' ? '#DC2626' : t.prioridad === 'MEDIA' ? '#D97706' : '#16A34A' }}>
                <Link to={`/tasks/${t.idTarea}`} className="block">
                  <p className="font-semibold text-foreground mb-2">{t.titulo}</p>
                </Link>
                <div className="flex flex-wrap gap-2 mb-3">
                  <PrioridadBadge value={t.prioridad} />
                  <EstadoBadge value={t.estado} />
                </div>
                <div className="flex gap-2">
                  <Link to={`/tasks/${t.idTarea}/edit`} className="btn-secondary btn-sm flex-1 justify-center">Editar</Link>
                  <button onClick={() => setDeleteId(t.idTarea)} className="btn-ghost btn-sm text-red-500">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={!!deleteId}
        title="¿Eliminar tarea?"
        message="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
