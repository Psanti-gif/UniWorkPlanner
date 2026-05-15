import api from './api'

export const aiService = {
  chat: (mensaje, tareas) =>
    api.post('/ia/chat', { mensaje, tareas }).then(r => r.data.respuesta),
}
