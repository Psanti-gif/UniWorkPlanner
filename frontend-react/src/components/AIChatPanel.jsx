import { useEffect, useRef, useState } from 'react'
import { taskService } from '../services/taskService'
import { aiService } from '../services/aiService'

const CONFIRM_WORDS = ['aceptar', 'sí', 'si', 'ok', 'confirmar', 'yes', 'ejecutar', 'dale', 'claro', 'hazlo']
const CANCEL_WORDS  = ['no', 'cancelar', 'cancel', 'nope', 'olvidalo', 'olvídalo']

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
        text: '¡Hola! Soy tu asistente con acceso a tus tareas. Puedo modificarlas por ti.\n\nEjemplos:\n• "Cambia la tarea #2 a completada"\n• "Sube la prioridad de [nombre] a alta"\n• "Crea una tarea para estudiar mañana"\n• "¿Qué debería priorizar hoy?"\n\n¿En qué te ayudo?',
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
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `✅ Listo — ${action.descripcion}.`,
      }])
    } catch (e) {
      setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, executing: false } : m))
      setMessages(prev => [...prev, { role: 'assistant', text: `❌ Error al ejecutar: ${e.message}` }])
    }
  }

  const cancelAction = (msgIndex) => {
    setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, cancelled: true } : m))
    setMessages(prev => [...prev, { role: 'assistant', text: 'Acción cancelada.' }])
  }

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return

    // Find last pending action (text-based confirm/cancel)
    let pendingIdx = -1
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m.role === 'action' && !m.confirmed && !m.cancelled && !m.executing) {
        pendingIdx = i
        break
      }
    }

    if (pendingIdx !== -1) {
      const lower = msg.toLowerCase()
      if (CONFIRM_WORDS.includes(lower)) {
        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: msg }])
        await confirmAction(pendingIdx)
        return
      }
      if (CANCEL_WORDS.includes(lower)) {
        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: msg }])
        cancelAction(pendingIdx)
        return
      }
    }

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const rawResp = await aiService.chat(msg, tareas)
      try {
        // Remove possible markdown code block wrapping Claude sometimes adds
        const clean = rawResp.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
        const parsed = JSON.parse(clean)
        if (parsed.accion) {
          setMessages(prev => [...prev, {
            role: 'action',
            text: parsed.mensaje || 'Propongo la siguiente acción:',
            accion: parsed.accion,
            confirmed: false,
            cancelled: false,
            executing: false,
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
        text: '❌ Error al conectar con la IA. Verifica la API key en application-dev.yaml.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all duration-150 flex items-center justify-center text-2xl z-50"
        title="Asistente IA"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-sidebar rounded-t-2xl flex items-center gap-2 flex-shrink-0">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-sm font-semibold text-white">Asistente UniWork</p>
              <p className="text-xs text-teal-300 font-mono">{tareas.length} tareas · puede ejecutar acciones</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => {
              if (m.role === 'user') return (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-br-sm text-sm leading-relaxed whitespace-pre-wrap bg-primary text-white">
                    {m.text}
                  </div>
                </div>
              )

              if (m.role === 'assistant') return (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap bg-muted text-foreground">
                    {m.text}
                  </div>
                </div>
              )

              if (m.role === 'action') return (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[92%] bg-amber-50 border border-amber-200 rounded-xl rounded-bl-sm p-3 text-sm">
                    <p className="text-foreground mb-2 leading-relaxed">{m.text}</p>
                    <div className="bg-white rounded-lg px-2.5 py-1.5 mb-3 text-xs text-foreground border border-amber-100 font-medium">
                      🔧 {m.accion.descripcion}
                    </div>
                    {!m.confirmed && !m.cancelled && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmAction(i)}
                          disabled={m.executing}
                          className="btn-primary btn-sm flex-1 justify-center text-xs disabled:opacity-60"
                        >
                          {m.executing ? '⏳ Ejecutando...' : '✅ Aceptar'}
                        </button>
                        <button
                          onClick={() => cancelAction(i)}
                          disabled={m.executing}
                          className="btn-secondary btn-sm flex-1 justify-center text-xs"
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    )}
                    {m.confirmed && <p className="text-emerald-600 text-xs font-semibold">✅ Ejecutado correctamente</p>}
                    {m.cancelled && <p className="text-muted-fg text-xs italic">Cancelado</p>}
                  </div>
                </div>
              )

              return null
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl rounded-bl-sm px-3 py-2 text-sm text-muted-fg animate-pulse">
                  Pensando...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2 flex-shrink-0">
            <input
              className="input flex-1 text-sm py-1.5"
              placeholder="Mensaje o escribe 'aceptar'..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="btn-primary btn-sm px-3 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
