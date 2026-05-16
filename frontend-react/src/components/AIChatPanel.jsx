import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { taskService } from '../services/taskService'
import { aiService } from '../services/aiService'

const CONFIRM_WORDS = ['aceptar', 'sí', 'si', 'ok', 'confirmar', 'yes', 'ejecutar', 'dale', 'claro', 'hazlo']
const CANCEL_WORDS  = ['no', 'cancelar', 'cancel', 'nope', 'olvidalo', 'olvídalo']

const Icon = ({ children }) => <span className="inline-flex items-center justify-center w-5 h-5">{children}</span>

export function AIChatPanel() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [tareas, setTareas]     = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    taskService.getAll().then(setTareas).catch(() => {})
  }, [])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        text: 'Hola, soy tu asistente. Tengo acceso a tus tareas y puedo ejecutar acciones por ti.\n\nEjemplos:\n• "Cambia la tarea #2 a completada"\n• "Sube la prioridad de [nombre] a alta"\n• "Crea una tarea para estudiar mañana"\n• "¿Qué debería priorizar hoy?"',
      }])
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const refreshTareas = () =>
    taskService.getAll().then(setTareas).catch(() => {})

  const executeAction = async (accion) => {
    switch (accion.tipo) {
      case 'CAMBIAR_ESTADO':
        await taskService.updateStatus(Number(accion.idTarea), accion.nuevoEstado)
        break
      case 'CAMBIAR_PRIORIDAD': {
        const t = await taskService.getById(Number(accion.idTarea))
        await taskService.update({ ...t, prioridad: accion.nuevaPrioridad })
        break
      }
      case 'CREAR_TAREA': {
        let fv = null
        if (accion.fechaVencimiento) {
          const match = String(accion.fechaVencimiento).match(/^(\d{4})-(\d{2})-(\d{2})/)
          if (match) fv = new Date(+match[1], +match[2] - 1, +match[3]).getTime()
        }
        await taskService.create({
          titulo: accion.titulo,
          descripcion: accion.descripcion || '',
          prioridad: accion.prioridad || 'MEDIA',
          estado: accion.estado || 'PENDIENTE',
          categoria: accion.categoria || 'PERSONAL',
          fechaVencimiento: fv,
        })
        break
      }
      case 'ELIMINAR_TAREA':
        await taskService.delete(Number(accion.idTarea))
        break
      default:
        throw new Error(`Tipo de acción desconocido: ${accion.tipo}`)
    }
    await refreshTareas()
  }

  const confirmAction = async (msgIndex) => {
    const action = messages[msgIndex]?.accion
    if (!action) return
    setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, executing: true } : m))
    try {
      await executeAction(action)
      setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, confirmed: true, executing: false } : m))
      setMessages(prev => [...prev, { role: 'assistant', text: `Listo — ${action.descripcion}.` }])
    } catch (e) {
      setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, executing: false } : m))
      setMessages(prev => [...prev, { role: 'assistant', text: `Error al ejecutar: ${e.message}` }])
    }
  }

  const cancelAction = (msgIndex) => {
    setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, cancelled: true } : m))
    setMessages(prev => [...prev, { role: 'assistant', text: 'Acción cancelada.' }])
  }

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return

    let pendingIdx = -1
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m.role === 'action' && !m.confirmed && !m.cancelled && !m.executing) { pendingIdx = i; break }
    }

    if (pendingIdx !== -1) {
      const lower = msg.toLowerCase()
      if (CONFIRM_WORDS.includes(lower)) {
        setInput(''); setMessages(prev => [...prev, { role: 'user', text: msg }])
        await confirmAction(pendingIdx); return
      }
      if (CANCEL_WORDS.includes(lower)) {
        setInput(''); setMessages(prev => [...prev, { role: 'user', text: msg }])
        cancelAction(pendingIdx); return
      }
    }

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const rawResp = await aiService.chat(msg, tareas)
      try {
        const clean = rawResp.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
        const parsed = JSON.parse(clean)
        if (parsed.accion) {
          setMessages(prev => [...prev, {
            role: 'action', text: parsed.mensaje || 'Propongo la siguiente acción:',
            accion: parsed.accion, confirmed: false, cancelled: false, executing: false,
          }])
        } else {
          setMessages(prev => [...prev, { role: 'assistant', text: parsed.mensaje || rawResp }])
        }
      } catch {
        setMessages(prev => [...prev, { role: 'assistant', text: rawResp }])
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Error al conectar con la IA. Verifica la API key en application-dev.yaml.',
      }])
    } finally { setLoading(false) }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-foreground text-white shadow-pop flex items-center justify-center z-40 transition-colors hover:bg-foreground/90"
        title="Asistente IA"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg key="bot" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><line x1="12" y1="7" x2="12" y2="11" />
              <line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-5 w-[340px] sm:w-[380px] h-[540px] bg-surface rounded-xl shadow-pop border border-border flex flex-col z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center gap-2.5 flex-shrink-0">
              <div className="w-7 h-7 rounded-md bg-foreground text-white flex items-center justify-center">
                <Icon>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><line x1="12" y1="7" x2="12" y2="11" />
                  </svg>
                </Icon>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Asistente</p>
                <p className="text-2xs text-ink-faint font-mono">{tareas.length} tareas · puede ejecutar acciones</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => {
                  if (m.role === 'user') return (
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="flex justify-end">
                      <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-br-sm text-sm leading-relaxed whitespace-pre-wrap bg-foreground text-white">{m.text}</div>
                    </motion.div>
                  )
                  if (m.role === 'assistant') return (
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="flex justify-start">
                      <div className="max-w-[88%] px-3 py-2 rounded-xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap bg-muted text-foreground border border-border">{m.text}</div>
                    </motion.div>
                  )
                  if (m.role === 'action') return (
                    <motion.div key={i} initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.22 }} className="flex justify-start">
                      <div className="max-w-[92%] bg-warning-soft border border-warning/25 rounded-xl rounded-bl-sm p-3 text-sm">
                        <p className="text-foreground mb-2 leading-relaxed">{m.text}</p>
                        <div className="bg-surface rounded-md px-2.5 py-1.5 mb-2.5 text-xs text-foreground border border-warning/15 font-medium">
                          {m.accion.descripcion}
                        </div>
                        {!m.confirmed && !m.cancelled && (
                          <div className="flex gap-2">
                            <button onClick={() => confirmAction(i)} disabled={m.executing} className="btn-primary btn-sm flex-1 justify-center disabled:opacity-60">
                              {m.executing ? 'Ejecutando…' : 'Aceptar'}
                            </button>
                            <button onClick={() => cancelAction(i)} disabled={m.executing} className="btn-secondary btn-sm flex-1 justify-center">Cancelar</button>
                          </div>
                        )}
                        {m.confirmed && <p className="text-success text-xs font-semibold">✓ Ejecutado</p>}
                        {m.cancelled && <p className="text-muted-fg text-xs italic">Cancelado</p>}
                      </div>
                    </motion.div>
                  )
                  return null
                })}
              </AnimatePresence>
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted border border-border rounded-xl rounded-bl-sm px-3 py-2 text-sm text-muted-fg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-fg rounded-full animate-pulse" />
                    <span className="w-1.5 h-1.5 bg-muted-fg rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-muted-fg rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-2.5 border-t border-border flex gap-1.5 flex-shrink-0">
              <input
                className="input flex-1 text-sm"
                placeholder="Pregunta o di 'aceptar'..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                disabled={loading}
              />
              <button onClick={send} disabled={loading || !input.trim()} className="btn-primary btn-sm px-3 disabled:opacity-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
