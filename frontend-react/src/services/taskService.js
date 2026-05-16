import api from './api'

// Backend real endpoints: /tareas-jpa/*
const BASE = '/tareas-jpa'

export const taskService = {
  getAll: () => api.get(`${BASE}/listar`).then(r => r.data),

  getById: (id) => api.get(`${BASE}/obtener/${id}`).then(r => r.data),

  create: (tarea) => api.post(`${BASE}/nuevo`, tarea).then(r => r.data),

  update: (tarea) => api.put(`${BASE}/actualizar`, tarea).then(r => r.data),

  updateStatus: (id, estado) =>
    taskService.getById(id).then(t =>
      taskService.update({ ...t, estado })
    ),

  delete: (id) => api.delete(`${BASE}/eliminar/${id}`).then(r => r.data),
}
