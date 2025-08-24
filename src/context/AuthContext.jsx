import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/apiClient'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  // Attach token on boot
  useEffect(() => {
    if (token) {
      // axios interceptor in apiClient will add Authorization header
      ; (async () => {
        try {
          const { data } = await api.get('/auth/me')
          setUser(data.user)
        } catch (e) {
          // token invalid → clear
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        } finally {
          setLoading(false)
        }
      })()
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const payload = {
      email: String(email || '').trim().toLowerCase(),
      password: String(password || ''),
    }
    if (!payload.email || !payload.password) {
      const err = new Error('Email and password are required')
      err.status = 400
      throw err
    }
    const { data } = await api.post('/auth/login', payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const body = { ...payload, email: String(payload.email || '').trim().toLowerCase() }
    const { data } = await api.post('/auth/register', body, {
      headers: { 'Content-Type': 'application/json' }
    })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch { }
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  // Keep sessions synced across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') {
        setToken(e.newValue)
        if (!e.newValue) setUser(null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => ({
    user, token, loading, isAuthenticated: !!user, login, register, logout
  }), [user, token, loading])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
