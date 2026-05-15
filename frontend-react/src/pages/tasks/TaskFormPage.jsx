import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  const isEdit  = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm]       = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    if (!isEdit) return
    taskService.getById(id)
      .then(t => setForm({
        ...t,
        fechaVencimiento: fmt(t.fechaVencimiento),
      }))
      .catch(e => { toast.error(e.message); navigate('/tasks') })
      .finally(() => setLoading(false))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.titulo.trim()) { toast.error('El título es obligatorio.'); return }
    if (!form.prioridad)     { toast.error('Selecciona una prioridad.'); return }

    setSaving(true)
    try {
      const payload = {
        ...form,
        fechaVencimiento: form.fechaVencimiento ? new Date(form.fechaVencimiento).getTime() : null,
      }
      if (isEdit) {
        await taskService.update(payload)
        toast.success('Tarea actualizada.')
        navigate(`/tasks/${id}`)
      } else {
        await taskService.create(payload)
        toast.success('Tarea creada.')
        navigate('/tasks')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-fg mb-4 flex gap-2 items-center font-mono">
        <a href="/tasks" className="hover:text-primary" onClick={e => { e.preventDefault(); navigate('/tasks') }}>Tareas</a>
        <span>/</span>
        <span className="text-foreground">{isEdit ? 'Editar' : 'Nueva'}</span>
      </nav>

      <div className="card p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6 text-foreground">
          {isEdit ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Título */}
          <div>
            <label className="label">Título <span className="text-red-500">*</span></label>
            <input className="input" value={form.titulo} maxLength={255}
                   onChange={e => set('titulo', e.target.value)}
                   placeholder="¿Qué hay que hacer?" />
          </div>

          {/* Descripción */}
          <div>
            <label className="label">Descripción</label>
            <textarea className="input resize-none" rows={3} value={form.descripcion || ''}
                      onChange={e => set('descripcion', e.target.value)}
                      placeholder="Detalles adicionales..." />
          </div>

          {/* Grid 2-col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Prioridad <span className="text-red-500">*</span></label>
              <select className="select" value={form.prioridad} onChange={e => set('prioridad', e.target.value)}>
                <option value="">Seleccionar...</option>
                <option value="ALTA">🔴 Alta</option>
                <option value="MEDIA">🟡 Media</option>
                <option value="BAJA">🟢 Baja</option>
              </select>
            </div>
            <div>
              <label className="label">Estado</label>
              <select className="select" value={form.estado} onChange={e => set('estado', e.target.value)}>
                <option value="PENDIENTE">⏳ Pendiente</option>
                <option value="EN_PROGRESO">🔵 En Progreso</option>
                <option value="COMPLETADA">✅ Completada</option>
                <option value="CANCELADA">❌ Cancelada</option>
              </select>
            </div>
            <div>
              <label className="label">Fecha de Vencimiento</label>
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

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 sm:flex-none justify-center">
              {saving ? '⏳ Guardando...' : isEdit ? 'Guardar cambios' : 'Crear Tarea'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
