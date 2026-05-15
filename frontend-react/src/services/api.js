import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8090/uniworkplanner',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor: 5xx → generic message, 4xx → backend message
api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status
    const backendMsg = err.response?.data?.message || err.response?.data?.error
    if (status >= 500) {
      return Promise.reject(new Error('Error del servidor, intenta de nuevo.'))
    }
    if (backendMsg) {
      return Promise.reject(new Error(backendMsg))
    }
    return Promise.reject(err)
  }
)

export default api
