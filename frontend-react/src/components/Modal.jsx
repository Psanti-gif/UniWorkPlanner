import { useEffect } from 'react'

export function Modal({ open, title, message, onConfirm, onCancel, danger = true }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         onClick={onCancel}>
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      {/* dialog */}
      <div className="animate-fade-in relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
           onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-fg mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary">Cancelar</button>
          <button onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary'}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
