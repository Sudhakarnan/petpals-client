import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL // must end with /api

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // you use Authorization header, not cookies
})

// Always attach Bearer token if present
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})
// Auto-handle 401s
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      // Optionally redirect:
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/** Add this helper */
export const mediaUrl = (p) => {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  // Convert http://localhost:5000/api -> http://localhost:5000
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''
  const host = apiBase.replace(/\/api\/?$/, '')
  return `${host}${p.startsWith('/') ? p : `/${p}`}`
}

// ---- AUTH ----
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  forgot: (email) => api.post('/auth/forgot', { email }),
  reset: (payload) => api.post('/auth/reset', payload),
}

// ---- PETS ----
export const petsApi = {
  list: (params) => api.get('/pets', { params }),
  get: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post('/pets', data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  remove: (id) => api.delete(`/pets/${id}`),
}

export const applicationsApi = {
  create: (payload) => api.post('/applications', payload),
  listMine: () => api.get('/applications/mine'),       // sent by me
  byShelter: () => api.get('/applications/shelter'),   // received for my pets
  updateStatus: (id, status) => api.patch(`/applications/${id}`, { status }),
  remove: (id) => api.delete(`/applications/${id}`),
}
// ---- REVIEWS ----
export const reviewsApi = {
  list: (targetType, targetId) => api.get(`/reviews`, { params: { targetType, targetId } }),
  create: (data) => api.post('/reviews', data),
}

// ---- MESSAGES ----
export const messagesApi = {
  threads: () => api.get('/messages/threads'),
  get: (id) => api.get(`/messages/threads/${id}`),
  send: (payload) => api.post('/messages', payload), // {threadId|toUserId, text, petId?}
  start: (payload) => api.post('/messages/start', payload),
  deleteForMe: (threadId, messageId) =>
    api.patch(`/messages/threads/${threadId}/messages/${messageId}/delete-for-me`),
}
// ---- FAVORITES ----
export const favoritesApi = {
  list: () => api.get('/favorites'),
  toggle: (petId) => api.post('/favorites/toggle', { petId }),
}

// ---- SHELTERS ----
export const sheltersApi = {
  get: (id) => api.get(`/shelters/${id}`),
}

export default api