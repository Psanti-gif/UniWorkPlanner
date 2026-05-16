import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { taskService } from '../../services/taskService'
import { fileService } from '../../services/fileService'
import { PrioridadBadge, EstadoBadge, CategoriaBadge } from '../../components/Badge'
import { Modal } from '../../components/Modal'
import { PageLoader } from '../../components/LoadingSpinner'
import { toast } from '../../components/Toast'

const ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA']
const ESTADO_LABEL = { PENDIENTE: 'Pendiente', EN_PROGRESO: 'En progreso', COMPLETADA: 'Completada', CANCELADA: 'Cancelada' }

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

  const handleStatusChange = async (estado) => {
    if (estado === tarea.estado) return
    setUpdating(true)
    try {
      const updated = await taskService.updateStatus(id, estado)
      setTarea(updated)
      toast.success(`Estado: ${ESTADO_LABEL[estado]}`)
    } catch (e) { toast.error(e.message) }
    finally { setUpdating(false) }
  }

  const handleDelete = async () => {
    try { await taskService.delete(id); toast.success('Tarea eliminada'); navigate('/tasks') }
    catch (e) { toast.error(e.message) }
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      for (const f of files) {
        const nuevo = await fileService.subir(id, f)
        setArchivos(prev => [...prev, nuevo])
      }
      toast.success(files.length === 1 ? 'Archivo adjuntado' : `${files.length} archivos adjuntados`)
    } catch (err) { toast.error(err.message) }
    finally { setUploading(false); e.target.value = '' }
  }

  const handleFileDelete = async (idArchivo) => {
    try {
      await fileService.eliminar(idArchivo)
      setArchivos(prev => prev.filter(a => a.idArchivo !== idArchivo))
      toast.success('Archivo eliminado')
    } catch (err) { toast.error(err.message) }
  }

  if (loading) return <PageLoader />

  const vc = tarea.fechaVencimiento ? new Date(tarea.fechaVencimiento) : null
  const vencida = vc && vc < new Date() && tarea.estado !== 'COMPLETADA' && tarea.estado !== 'CANCELADA'

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <nav className="text-2xs text-ink-faint flex items-center gap-1.5 font-mono">
        <Link to="/tasks" className="hover:text-foreground transition-colors">Tareas</Link>
        <span>/</span>
        <span className="text-muted-fg truncate max-w-xs">{tarea.titulo}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="lg:col-span-2 card p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h1 className="text-foreground flex-1">{tarea.titulo}</h1>
            <div className="flex gap-1 flex-shrink-0">
              <Link to={`/tasks/${id}/edit`} className="btn-secondary btn-sm">Editar</Link>
              <button onClick={() => setDelOpen(true)} className="btn-ghost btn-sm hover:text-danger" title="Eliminar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            <PrioridadBadge value={tarea.prioridad} />
            <EstadoBadge value={tarea.estado} />
            <CategoriaBadge value={tarea.categoria} />
          </div>

          {tarea.descripcion ? (
            <p className="text-sm text-foreground leading-relaxed mb-6 whitespace-pre-wrap">{tarea.descripcion}</p>
          ) : (
            <p className="text-sm text-ink-faint italic mb-6">Sin descripción.</p>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-2xs uppercase tracking-wider text-ink-faint font-medium mb-1">Creada</p>
              <p className="text-sm font-mono text-foreground">
                {tarea.fechaCreacion ? new Date(tarea.fechaCreacion).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
              </p>
            </div>
            <div>
              <p className="text-2xs uppercase tracking-wider text-ink-faint font-medium mb-1">Vencimiento</p>
              <p className={`text-sm font-mono ${vencida ? 'text-danger font-semibold' : 'text-foreground'}`}>
                {vc ? vc.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                {vencida && <span className="ml-2 text-2xs text-danger">vencida</span>}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sidebar — change status */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }} className="card p-4 h-fit">
          <p className="text-2xs uppercase tracking-wider text-ink-faint font-medium mb-2.5">Cambiar estado</p>
          <div className="space-y-1">
            {ESTADOS.map(est => (
              <button
                key={est}
                onClick={() => handleStatusChange(est)}
                disabled={updating}
                className={`w-full px-2.5 py-1.5 rounded-md text-sm text-left font-medium transition-all duration-150 disabled:opacity-60
                  ${tarea.estado === est ? 'bg-foreground text-white' : 'text-foreground hover:bg-muted'}`}
              >
                {ESTADO_LABEL[est]}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Archivos adjuntos */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }} className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Archivos adjuntos</p>
            <p className="text-2xs text-ink-faint mt-0.5">PDF, imágenes, Excel, Word, ZIP — hasta 20MB</p>
          </div>
          <label className={`btn-secondary btn-sm cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? 'Subiendo…' : '+ Adjuntar'}
            <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleFileUpload} />
          </label>
        </div>
        {archivos.length === 0 ? (
          <p className="text-2xs text-ink-faint py-3">Sin archivos adjuntos.</p>
        ) : (
          <div className="space-y-1.5">
            {archivos.map((a, i) => (
              <motion.div
                key={a.idArchivo}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: i * 0.04 }}
                className="flex items-center justify-between bg-muted rounded-md px-3 py-2 group hover:bg-muted-2 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base flex-shrink-0">{fileIcon(a.tipo)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.nombre}</p>
                    <p className="text-2xs text-ink-faint font-mono">{formatSize(a.tamanio)}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => fileService.descargar(a.idArchivo, a.nombre)} className="btn-ghost btn-sm" title="Descargar">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                  <button onClick={() => handleFileDelete(a.idArchivo)} className="btn-ghost btn-sm hover:text-danger" title="Eliminar">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Modal open={delOpen} title="¿Eliminar esta tarea?" message={`"${tarea.titulo}" se eliminará permanentemente.`} onConfirm={handleDelete} onCancel={() => setDelOpen(false)} confirmLabel="Eliminar" />
    </div>
  )
}
