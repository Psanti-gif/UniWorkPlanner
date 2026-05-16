import api from './api'

const BASE = '/archivos'

export const fileService = {
  listar: (idTarea) =>
    api.get(`${BASE}/listar/${idTarea}`).then(r => r.data),

  subir: (idTarea, file) => {
    const fd = new FormData()
    fd.append('archivo', file)
    return api.post(`${BASE}/subir/${idTarea}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },

  descargar: (id, nombre) =>
    api.get(`${BASE}/descargar/${id}`, { responseType: 'blob' }).then(r => {
      const url = URL.createObjectURL(r.data)
      const a = document.createElement('a')
      a.href = url
      a.download = nombre
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }),

  eliminar: (id) =>
    api.delete(`${BASE}/eliminar/${id}`).then(r => r.data),
}
