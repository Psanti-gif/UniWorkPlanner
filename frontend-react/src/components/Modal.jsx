import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Modal({ open, title, message, onConfirm, onCancel, danger = true, confirmLabel = 'Confirmar' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onCancel?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          className="fixed inset-0 z-[55] flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <div className="absolute inset-0 bg-foreground/35 backdrop-blur-[3px]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="relative bg-surface rounded-xl shadow-pop border border-border w-full max-w-sm p-5"
          >
            <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
            <p className="text-sm text-muted-fg mb-5 leading-relaxed">{message}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={onCancel} className="btn-secondary">Cancelar</button>
              <button onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary'}>{confirmLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
