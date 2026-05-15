import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { taskService } from '../../services/taskService'
import { fileService } from '../../services/fileService'
import { PrioridadBadge, EstadoBadge } from '../../components/Badge'
import { Modal } from '../../components/Modal'
import { PageLoader } from '../../components/LoadingSpinner'
import { toast } from '../../components/Toast'

const FILE_ICONS = {
  'application/pdf': '📄',
  'image/png': '🖼️', 'image/jpeg': '🖼️', 'image/gif': '🖼️', 'image/webp': '🖼️',
  'application/vnd.ms-excel': '📊',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'application/zip': '🗜️',
}
const fileIcon = (tipo) => FILE_ICONS[tipo] || '📎'
const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA']

export function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tarea, setTarea]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [delOpen, setDelOpen]     = useState(false)
  const [updating, setUpdating]   = useState(false)
  const [archivos, setArchivos]   = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    taskService.getById(id)
      .then(setTarea)
      .catch(e => { toast.error(e.message); navigate('/tasks') })
      .finally(() => setLoading(false))
    fileService.listar(id).then(setArchivos).catch(() => {})
  }, [id])

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      for (const f of files) {
        const nuevo = await fileService.subir(id, f)
        setArchivos(prev => [...prev, nuevo])
      }
      toast.success(`${files.length === 1 ? 'Archivo adjuntado' : `${files.length} archivos adjuntados`}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleFileDelete = async (idArchivo) => {
    try {
      await fileService.eliminar(idArchivo)
      setArchivos(prev => prev.filter(a => a.idArchivo !== idArchivo))
      toast.success('Archivo eliminado.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleStatusChange = async (estado) => {
    if (estado === tarea.estado) return
    setUpdating(true)
    try {
      const updated = await taskService.updateStatus(id, estado)
      setTarea(updated)
      toast.success(`Estado → ${estado.replace('_', ' ')}`)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      await taskService.delete(id)
      toast.success('Tarea eliminada.')
      navigate('/tasks')
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (loading) return <PageLoader />

  const vc = tarea.fechaVencimiento ? new Date(tarea.fechaVencimiento) : null
  const vencida = vc && vc < new Date() && tarea.estado !== 'COMPLETADA'

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-fg mb-4 flex gap-2 items-center font-mono">
        <Link to="/tasks" className="hover:text-primary">Tareas</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{tarea.titulo}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main card */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-foreground">{tarea.titulo}</h2>
            <div className="flex gap-2 flex-shrink-0">
              <Link to={`/tasks/${id}/edit`} className="btn-secondary btn-sm">✏️ Editar</Link>
              <button onClick={() => setDelOpen(true)} className="btn-ghost btn-sm text-red-500">🗑️</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <PrioridadBadge value={tarea.prioridad} />
            <EstadoBadge value={tarea.estado} />
            {tarea.categoria && <span className="badge bg-gray-100 text-gray-600">{tarea.categoria}</span>}
          </div>

          {tarea.descripcion ? (
            <p className="text-sm text-foreground leading-relaxed bg-muted rounded-lg p-3 mb-5">
              {tarea.descripcion}
            </p>
          ) : (
            <p className="text-sm text-muted-fg italic mb-5">Sin descripción.</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-fg uppercase font-mono tracking-wide mb-1">Creada</p>
              <p className="font-medium font-mono text-foreground">
                {tarea.fechaCreacion ? new Date(tarea.fechaCreacion).toLocaleDateString('es-CO') : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase font-mono tracking-wide mb-1">Vencimiento</p>
              <p className={`font-medium font-mono ${vencida ? 'text-red-600' : 'text-foreground'}`}>
                {vc ? vc.toLocaleDateString('es-CO') : '—'}
                {vencida && <span className="ml-1 text-xs">⚠️ Vencida</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Estado panel */}
        <div className="card p-4">
          <p className="text-xs text-muted-fg uppercase font-mono tracking-wide mb-3">Cambiar Estado</p>
          <div className="space-y-2">
            {ESTADOS.map(est => (
              <button
                key={est}
                onClick={() => handleStatusChange(est)}
                disabled={updating}
                className={`w-full px-3 py-2 rounded-lg text-sm text-left font-medium transition-all duration-150
                  ${tarea.estado === est
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-muted text-foreground hover:bg-primary/10 hover:text-primary'}`}
              >
                {est.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <Link to="/tasks" className="text-xs text-muted-fg hover:text-primary flex items-center gap-1">
              ← Volver a la lista
            </Link>
          </div>
        </div>
      </div>

      {/* Archivos adjuntos */}
      <div className="card p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">Archivos adjuntos</p>
          <label className={`btn-secondary btn-sm cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? '⏳ Subiendo...' : '📎 Adjuntar'}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />
          </label>
        </div>
        {archivos.length === 0 ? (
          <p className="text-xs text-muted-fg py-2">Sin archivos adjuntos.</p>
        ) : (
          <div className="space-y-2">
            {archivos.map(a => (
              <div key={a.idArchivo} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg flex-shrink-0">{fileIcon(a.tipo)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.nombre}</p>
                    <p className="text-xs text-muted-fg font-mono">{formatSize(a.tamanio)}</p>
                  </div>
                </div>
                <div className="flex gap-1 ml-3 flex-shrink-0">
                  <button
                    onClick={() => fileService.descargar(a.idArchivo, a.nombre)}
                    className="btn-ghost btn-sm"
                    title="Descargar"
                  >⬇️</button>
                  <button
                    onClick={() => handleFileDelete(a.idArchivo)}
                    className="btn-ghost btn-sm text-red-500"
                    title="Eliminar"
                  >🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={delOpen}
        title="¿Eliminar esta tarea?"
        message={`"${tarea.titulo}" será eliminada permanentemente.`}
        onConfirm={handleDelete}
        onCancel={() => setDelOpen(false)}
      />
    </div>
  )
}
