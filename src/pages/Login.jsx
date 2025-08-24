import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import PasswordInput from '../components/auth/PasswordInput'

const DEMOS = [
  { label: 'Test User 1', email: 'testuser1@gmail.com', password: 'test@123' },
  { label: 'Test User 2', email: 'testuser2@gmail.com', password: 'test@123' },
]

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const { push } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e?.preventDefault?.()
    setLoading(true)
    try {
      await login(email, password) // AuthContext persists token & user
      push('Welcome back!')
      nav('/')
    } catch (err) {
      push(err?.response?.data?.message || 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (d) => {
    setEmail(d.email)
    setPassword(d.password)
  }

  const loginDemo = async (d) => {
    setEmail(d.email)
    setPassword(d.password)
    setLoading(true)
    try {
      await login(d.email, d.password)
      push(`Logged in as ${d.label}`)
      nav('/')
    } catch (err) {
      push(err?.response?.data?.message || 'Demo login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-violet-50 to-fuchsia-50 text-slate-800">
      {/* soft background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -top-10 -left-12 h-40 w-40 rounded-full bg-gradient-to-tr from-sky-300/30 to-indigo-300/30 blur-3xl" />
        <span className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gradient-to-tr from-fuchsia-300/30 to-pink-300/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Login form */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 transition"
          >
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Login
            </h1>

            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              type="email"
              inputMode="email"
              required
            />

            {/* Password (wrapped so it looks consistent even if PasswordInput lacks className prop) */}
            <div className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Password"
                required
              />
            </div>

            <button
              className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium text-white bg-gradient-to-r from-sky-400 to-indigo-400 hover:from-sky-300 hover:to-indigo-300 active:scale-[.98] shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>

            <div className="text-sm flex items-center justify-between pt-1">
              <Link
                to="/register"
                className="text-indigo-700 hover:text-indigo-800 underline underline-offset-4 decoration-indigo-300 hover:decoration-sky-400 transition"
              >
                Create account
              </Link>
              <Link
                to="/forgot"
                className="text-indigo-700 hover:text-indigo-800 underline underline-offset-4 decoration-indigo-300 hover:decoration-sky-400 transition"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          {/* Demo users panel */}
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Demo Users</h2>
            <p className="text-sm text-slate-600">
              Use these test accounts to explore the app quickly.
            </p>

            <div className="space-y-3">
              {DEMOS.map((d) => (
                <div
                  key={d.email}
                  className="rounded-xl border border-slate-200 p-3 bg-white"
                >
                  <div className="font-medium">{d.label}</div>
                  <div className="text-xs text-slate-500 break-all">
                    {d.email} • <span className="font-mono">{d.password}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
                      onClick={() => fillDemo(d)}
                    >
                      Fill form
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow transition disabled:opacity-60"
                      onClick={() => loginDemo(d)}
                      disabled={loading}
                    >
                      {loading ? 'Please wait…' : `Login as ${d.label}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-slate-500">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
