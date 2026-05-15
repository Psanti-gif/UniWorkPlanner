import { useEffect, useRef, useState } from 'react'
import { taskService } from '../services/taskService'
import { aiService } from '../services/aiService'

export function AIChatPanel() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [tareas, setTareas]   = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    taskService.getAll().then(setTareas).catch(() => {})
  }, [])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        text: '¡Hola! Soy tu asistente de productividad. Tengo acceso a tus tareas actuales. ¿En qué te puedo ayudar? Puedes preguntarme por prioridades, recomendaciones o qué hacer hoy.',
      }])
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const respuesta = await aiService.chat(msg, tareas)
      setMessages(prev => [...prev, { role: 'assistant', text: respuesta }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '❌ Error al conectar con la IA. Verifica que la API key esté configurada en application-dev.yaml.',
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
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[480px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-sidebar rounded-t-2xl flex items-center gap-2 flex-shrink-0">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-sm font-semibold text-white">Asistente UniWork</p>
              <p className="text-xs text-teal-300 font-mono">{tareas.length} tareas en contexto</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
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
              placeholder="Escribe un mensaje..."
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
