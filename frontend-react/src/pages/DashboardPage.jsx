import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { taskService } from '../services/taskService'
import { PrioridadBadge } from '../components/Badge'
import { PageLoader } from '../components/LoadingSpinner'
import { toast } from '../components/Toast'

function StatCard({ label, value, accent, hint, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      className="stat-card"
    >
      <p className="text-2xs uppercase tracking-wider text-ink-faint font-medium">{label}</p>
      <p className={`text-3xl font-bold font-mono tracking-tight ${accent || 'text-foreground'}`}>{value}</p>
      {hint && <p className="text-2xs text-ink-faint mt-auto pt-1">{hint}</p>}
    </motion.div>
  )
}

const list = {
  show: { transition: { staggerChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 6 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
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
  const limitDay = new Date(today); limitDay.setDate(today.getDate() + 3)

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

  const ESTADOS_ORDER = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-fg mt-1">Resumen de tus pendientes — {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Link to="/tasks/new" className="btn-primary">+ Nueva tarea</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total"        value={tareas.length}              delay={0.00} hint={`${tareas.length === 1 ? 'tarea' : 'tareas'} totales`} />
        <StatCard label="Completadas"  value={completadas}                delay={0.05} hint={`${pct}% del total`} accent="text-success" />
        <StatCard label="En progreso"  value={byEstado['EN_PROGRESO']||0} delay={0.10} accent="text-info" />
        <StatCard label="Vencidas"     value={vencidas.length}            delay={0.15} accent={vencidas.length > 0 ? 'text-danger' : 'text-foreground'} hint={vencidas.length > 0 ? 'requieren atención' : 'todo al día'} />
      </div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="card p-5">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="text-sm font-medium text-foreground">Progreso general</p>
            <p className="text-2xs text-ink-faint mt-0.5">{completadas} de {tareas.length} tareas completadas</p>
          </div>
          <span className="text-2xl font-mono font-bold text-foreground tracking-tight">{pct}<span className="text-base text-muted-fg">%</span></span>
        </div>
        <div className="w-full bg-muted-2 rounded-full h-1.5 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="bg-foreground h-full rounded-full" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Próximas a vencer */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }} className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Próximas a vencer</h3>
            <span className="text-2xs text-ink-faint font-mono">{proximasVencer.length} en 3 días</span>
          </div>
          <motion.div variants={list} initial="hidden" animate="show" className="divide-y divide-border">
            {proximasVencer.length === 0 ? (
              <div className="px-5 py-10 text-center text-muted-fg text-sm">Sin tareas urgentes</div>
            ) : proximasVencer.map(t => (
              <motion.div key={t.idTarea} variants={item} className="px-5 py-3 flex items-center justify-between hover:bg-muted/60 transition-colors">
                <div className="min-w-0 flex-1">
                  <Link to={`/tasks/${t.idTarea}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors block truncate">{t.titulo}</Link>
                  <p className="text-2xs text-warning font-mono mt-0.5">{new Date(t.fechaVencimiento).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <PrioridadBadge value={t.prioridad} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Distribución por estado */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-semibold">Distribución por estado</h3>
          </div>
          <div className="p-5 space-y-3">
            {tareas.length === 0 ? (
              <p className="text-center text-muted-fg text-sm py-6">No hay tareas aún</p>
            ) : ESTADOS_ORDER.filter(e => byEstado[e]).map((estado, i) => {
              const count = byEstado[estado]
              const pctEst = (count / tareas.length) * 100
              const labelMap = { PENDIENTE: 'Pendientes', EN_PROGRESO: 'En progreso', COMPLETADA: 'Completadas', CANCELADA: 'Canceladas' }
              const colorMap = { PENDIENTE: 'bg-warning', EN_PROGRESO: 'bg-info', COMPLETADA: 'bg-success', CANCELADA: 'bg-ink-faint' }
              return (
                <motion.div key={estado} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-foreground font-medium">{labelMap[estado]}</span>
                    <span className="text-2xs font-mono text-muted-fg">{count}</span>
                  </div>
                  <div className="w-full bg-muted-2 rounded h-1 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pctEst}%` }} transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }} className={`h-full rounded ${colorMap[estado]}`} />
                  </div>
                </motion.div>
              )
            })}
            <Link to="/tasks/kanban" className="btn-secondary w-full justify-center mt-4">Ver tablero Kanban →</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
