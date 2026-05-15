import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { taskService } from '../services/taskService'
import { PrioridadBadge, EstadoBadge } from '../components/Badge'
import { PageLoader } from '../components/LoadingSpinner'
import { toast } from '../components/Toast'

function StatCard({ icon, label, value, colorClass, bgClass }) {
  return (
    <div className="stat-card">
      <div>
        <p className="text-xs text-muted-fg font-medium uppercase tracking-wide mb-1">{label}</p>
        {/* UI/UX Skill: Fira Code for numeric stats */}
        <p className={`text-3xl font-bold font-mono ${colorClass}`}>{value}</p>
      </div>
      <div className={`stat-icon ${bgClass}`}>{icon}</div>
    </div>
  )
}

export function DashboardPage() {
  const [tareas, setTareas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    taskService.getAll()
      .then(setTareas)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const byEstado = tareas.reduce((acc, t) => {
    const k = t.estado || 'SIN_ESTADO'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  const toDay = (v) => { const d = new Date(v); d.setHours(0, 0, 0, 0); return d }
  const today = toDay(new Date())
  const limitDay = new Date(today)
  limitDay.setDate(today.getDate() + 3)

  const proximasVencer = tareas
    .filter(t => {
      if (!t.fechaVencimiento || t.estado === 'COMPLETADA' || t.estado === 'CANCELADA') return false
      const vc = toDay(t.fechaVencimiento)
      return vc >= today && vc <= limitDay
    })
    .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento))
    .slice(0, 5)

  const vencidas = tareas.filter(t => {
    if (!t.fechaVencimiento || t.estado === 'COMPLETADA' || t.estado === 'CANCELADA') return false
    return toDay(t.fechaVencimiento) < today
  })

  const completadas = byEstado['COMPLETADA'] || 0
  const pct = tareas.length ? Math.round((completadas / tareas.length) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-fg mt-0.5">Resumen de tus pendientes</p>
        </div>
        <Link to="/tasks/new" className="btn-primary">
          + Nueva Tarea
        </Link>
      </div>

      {/* Stats — UI/UX Skill: Drill-Down Analytics, functional colors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📋" label="Total"       value={tareas.length}              colorClass="text-foreground"       bgClass="bg-primary/10 text-primary" />
        <StatCard icon="✅" label="Completadas"  value={completadas}                colorClass="text-emerald-700"      bgClass="bg-emerald-100 text-emerald-600" />
        <StatCard icon="🔵" label="En Progreso"  value={byEstado['EN_PROGRESO']||0} colorClass="text-blue-700"         bgClass="bg-blue-100 text-blue-600" />
        <StatCard icon="⚠️" label="Vencidas"    value={vencidas.length}            colorClass="text-red-700"          bgClass="bg-red-100 text-red-600" />
      </div>

      {/* Progress bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progreso general</span>
          <span className="text-sm font-mono font-bold text-primary">{pct}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-muted-fg mt-1.5">{completadas} de {tareas.length} tareas completadas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Próximas a vencer */}
        <div className="card">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <span className="text-amber-500">⏰</span>
            <h3 className="font-semibold text-sm">Próximas a vencer (3 días)</h3>
          </div>
          <div className="divide-y divide-border">
            {proximasVencer.length === 0 ? (
              <div className="px-5 py-8 text-center text-muted-fg text-sm">
                <p className="text-2xl mb-2">🎉</p>
                Sin tareas urgentes
              </div>
            ) : proximasVencer.map(t => (
              <div key={t.idTarea} className="px-5 py-3 flex items-center justify-between hover:bg-primary/5 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.titulo}</p>
                  <p className="text-xs text-amber-600 font-mono mt-0.5">
                    {new Date(t.fechaVencimiento).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <PrioridadBadge value={t.prioridad} />
                  <Link to={`/tasks/${t.idTarea}`} className="btn-ghost btn-sm">Ver →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estado breakdown — UI/UX Skill: bar chart style */}
        <div className="card">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <span>📊</span>
            <h3 className="font-semibold text-sm">Distribución por estado</h3>
          </div>
          <div className="p-5 space-y-3">
            {tareas.length === 0 ? (
              <p className="text-center text-muted-fg text-sm py-6">No hay tareas aún</p>
            ) : Object.entries(byEstado).map(([estado, count]) => (
              <div key={estado}>
                <div className="flex justify-between items-center mb-1">
                  <EstadoBadge value={estado} />
                  <span className="text-xs font-mono font-bold text-foreground">{count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(count / tareas.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-4">
            <Link to="/tasks/kanban" className="btn-secondary w-full justify-center">
              Ver Tablero Kanban →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
