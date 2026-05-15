const PRIORIDAD_CLASS = {
  ALTA:  'badge-alta',
  MEDIA: 'badge-media',
  BAJA:  'badge-baja',
}
const ESTADO_CLASS = {
  PENDIENTE:   'badge-pendiente',
  EN_PROGRESO: 'badge-en_progreso',
  COMPLETADA:  'badge-completada',
  CANCELADA:   'badge-cancelada',
}

export function PrioridadBadge({ value }) {
  if (!value) return <span className="badge bg-gray-100 text-gray-500">—</span>
  return <span className={`badge ${PRIORIDAD_CLASS[value] || 'bg-gray-100 text-gray-600'}`}>{value}</span>
}

export function EstadoBadge({ value }) {
  if (!value) return <span className="badge bg-gray-100 text-gray-500">—</span>
  const label = value.replace('_', ' ')
  return <span className={`badge ${ESTADO_CLASS[value] || 'bg-gray-100 text-gray-600'}`}>{label}</span>
}
