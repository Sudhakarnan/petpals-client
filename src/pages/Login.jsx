import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import PasswordInput from '../components/auth/PasswordInput'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const { push } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-violet-50 to-fuchsia-50 text-slate-800">
      {/* soft background glows (pure tailwind, optional) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -top-10 -left-12 h-40 w-40 rounded-full bg-gradient-to-tr from-sky-300/30 to-indigo-300/30 blur-3xl" />
        <span className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gradient-to-tr from-fuchsia-300/30 to-pink-300/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm px-4 py-12">
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
          />

          {/* Works even if PasswordInput doesn't accept className */}
          <div className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Password"
            // If PasswordInput supports className, you can pass this instead of the wrapper:
            // className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400"
            />
          </div>

          <button
            className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium text-white bg-gradient-to-r from-sky-400 to-indigo-400 hover:from-sky-300 hover:to-indigo-300 active:scale-[.98] shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
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
      </div>
    </div>

  )
}
