const PRIORIDAD_CLASS = { ALTA: 'badge-alta', MEDIA: 'badge-media', BAJA: 'badge-baja' }
const ESTADO_CLASS = {
  PENDIENTE:   'badge-pendiente',
  EN_PROGRESO: 'badge-en_progreso',
  COMPLETADA:  'badge-completada',
  CANCELADA:   'badge-cancelada',
}

const DOTS = {
  ALTA: 'bg-danger', MEDIA: 'bg-warning', BAJA: 'bg-success',
  PENDIENTE: 'bg-warning', EN_PROGRESO: 'bg-info', COMPLETADA: 'bg-success', CANCELADA: 'bg-ink-faint',
}

function Dot({ value }) {
  const c = DOTS[value]
  if (!c) return null
  return <span className={`w-1.5 h-1.5 rounded-full ${c}`} />
}

export function PrioridadBadge({ value }) {
  if (!value) return <span className="badge badge-neutral">—</span>
  const label = value.charAt(0) + value.slice(1).toLowerCase()
  return <span className={`badge ${PRIORIDAD_CLASS[value] || 'badge-neutral'}`}><Dot value={value} />{label}</span>
}

export function EstadoBadge({ value }) {
  if (!value) return <span className="badge badge-neutral">—</span>
  const label = value.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  return <span className={`badge ${ESTADO_CLASS[value] || 'badge-neutral'}`}><Dot value={value} />{label}</span>
}

export function CategoriaBadge({ value }) {
  if (!value) return null
  const label = value.charAt(0) + value.slice(1).toLowerCase()
  return <span className="badge badge-neutral">{label}</span>
}
