import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

let _addToast = null
export const toast = {
  success: (msg) => _addToast?.({ msg, type: 'success' }),
  error:   (msg) => _addToast?.({ msg, type: 'error' }),
  info:    (msg) => _addToast?.({ msg, type: 'info' }),
}

const STYLE = {
  success: { bg: 'bg-surface border-success/30', icon: <span className="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center text-2xs font-bold">✓</span> },
  error:   { bg: 'bg-surface border-danger/30',  icon: <span className="w-5 h-5 rounded-full bg-danger/15  text-danger  flex items-center justify-center text-2xs font-bold">!</span> },
  info:    { bg: 'bg-surface border-info/30',    icon: <span className="w-5 h-5 rounded-full bg-info/15    text-info    flex items-center justify-center text-2xs font-bold">i</span> },
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = ({ msg, type }) => {
      const id = Date.now() + Math.random()
      setToasts(prev => [...prev, { id, msg, type }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800)
    }
    return () => { _addToast = null }
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`flex items-start gap-2.5 px-3.5 py-3 rounded-lg border shadow-pop min-w-[260px] text-sm font-medium text-foreground ${STYLE[t.type].bg}`}
          >
            {STYLE[t.type].icon}
            <span className="flex-1 leading-snug">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
