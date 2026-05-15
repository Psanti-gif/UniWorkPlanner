import { useEffect, useState } from 'react'

let _addToast = null
export const toast = {
  success: (msg) => _addToast?.({ msg, type: 'success' }),
  error:   (msg) => _addToast?.({ msg, type: 'error' }),
  info:    (msg) => _addToast?.({ msg, type: 'info' }),
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = ({ msg, type }) => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, msg, type }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }
    return () => { _addToast = null }
  }, [])

  const colors = {
    success: 'bg-emerald-600 text-white',
    error:   'bg-red-600 text-white',
    info:    'bg-primary text-white',
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id}
          className={`animate-toast-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[260px] max-w-sm text-sm font-medium ${colors[t.type]}`}>
          <span className="text-base">{icons[t.type]}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}
