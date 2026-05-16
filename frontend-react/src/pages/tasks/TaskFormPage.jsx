import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { taskService } from '../../services/taskService'
import { PageLoader } from '../../components/LoadingSpinner'
import { toast } from '../../components/Toast'

const EMPTY = {
  titulo: '', descripcion: '', prioridad: '', estado: 'PENDIENTE',
  categoria: '', fechaVencimiento: '',
}

function fmt(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

export function TaskFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm]       = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    if (!isEdit) return
    taskService.getById(id)
      .then(t => setForm({ ...t, fechaVencimiento: fmt(t.fechaVencimiento) }))
      .catch(e => { toast.error(e.message); navigate('/tasks') })
      .finally(() => setLoading(false))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.titulo.trim()) { toast.error('El título es obligatorio'); return }
    if (!form.prioridad)     { toast.error('Selecciona una prioridad'); return }

    setSaving(true)
    try {
      const payload = {
        ...form,
        fechaVencimiento: form.fechaVencimiento ? (() => {
          const [y, m, d] = form.fechaVencimiento.split('-').map(Number)
          return new Date(y, m - 1, d).getTime()
        })() : null,
      }
      if (isEdit) {
        await taskService.update(payload); toast.success('Tarea actualizada'); navigate(`/tasks/${id}`)
      } else {
        await taskService.create(payload); toast.success('Tarea creada'); navigate('/tasks')
      }
    } catch (err) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <PageLoader />

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <nav className="text-2xs text-ink-faint flex items-center gap-1.5 font-mono">
        <Link to="/tasks" className="hover:text-foreground transition-colors">Tareas</Link>
        <span>/</span>
        <span className="text-muted-fg">{isEdit ? 'Editar' : 'Nueva'}</span>
      </nav>

      <div>
        <h1 className="text-foreground">{isEdit ? 'Editar tarea' : 'Nueva tarea'}</h1>
        <p className="text-sm text-muted-fg mt-1">{isEdit ? 'Modifica los detalles de tu tarea' : 'Crea una nueva tarea para empezar'}</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
        onSubmit={handleSubmit}
        className="card p-5 sm:p-6 space-y-4"
      >
        <div>
          <label className="label">Título <span className="text-danger">*</span></label>
          <input className="input" value={form.titulo} maxLength={255}
            onChange={e => set('titulo', e.target.value)}
            placeholder="¿Qué hay que hacer?" autoFocus />
        </div>

        <div>
          <label className="label">Descripción</label>
          <textarea className="input resize-none" rows={3} value={form.descripcion || ''}
            onChange={e => set('descripcion', e.target.value)}
            placeholder="Detalles adicionales..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Prioridad <span className="text-danger">*</span></label>
            <select className="select" value={form.prioridad} onChange={e => set('prioridad', e.target.value)}>
              <option value="">Seleccionar...</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
          </div>
          <div>
            <label className="label">Estado</label>
            <select className="select" value={form.estado} onChange={e => set('estado', e.target.value)}>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROGRESO">En progreso</option>
              <option value="COMPLETADA">Completada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>
          <div>
            <label className="label">Fecha de vencimiento</label>
            <input type="date" className="input" value={form.fechaVencimiento || ''}
              onChange={e => set('fechaVencimiento', e.target.value)} />
          </div>
          <div>
            <label className="label">Categoría</label>
            <select className="select" value={form.categoria || ''} onChange={e => set('categoria', e.target.value)}>
              <option value="">Sin categoría</option>
              <option value="UNIVERSIDAD">Universidad</option>
              <option value="TRABAJO">Trabajo</option>
              <option value="PERSONAL">Personal</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-border">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear tarea'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
        </div>
      </motion.form>
    </div>
  )
}
