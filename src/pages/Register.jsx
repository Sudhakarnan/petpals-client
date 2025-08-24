import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import PasswordInput from '../components/auth/PasswordInput'

export default function Register() {
  const nav = useNavigate()
  const { register } = useAuth()
  const { push } = useToast()

  const [name, setName] = useState('')
  const [role, setRole] = useState('adopter')
  const [email, setEmail] = useState('')
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (pw1 !== pw2) return push('Passwords do not match', 'error')
    setLoading(true)
    try {
      await register({ name, role, email, password: pw1 }) // AuthContext persists & logs in
      push('Welcome!')
      nav('/')
    } catch (err) {
      push(err?.response?.data?.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
  <form
    onSubmit={onSubmit}
    className="rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur-sm p-6 space-y-4 shadow-md hover:shadow-lg transition"
  >
    <h1 className="text-2xl font-extrabold text-[#0f2f3f]">Create account</h1>

    <input
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
      placeholder="Full name"
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <input
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
      placeholder="Email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      autoComplete="email"
    />

    {/* Role selection */}
    <div className="flex gap-3">
      <label
        className={`flex-1 rounded-xl px-3 py-2 cursor-pointer border bg-white/70 backdrop-blur-sm shadow-sm transition
        ${role === 'adopter'
          ? 'border-cyan-400 ring-2 ring-cyan-300 text-cyan-700 font-medium'
          : 'border-cyan-200 hover:border-cyan-300 text-slate-600'}`}
      >
        <input
          type="radio"
          className="mr-2 accent-cyan-500"
          name="role"
          value="adopter"
          checked={role === 'adopter'}
          onChange={() => setRole('adopter')}
        />
        Adopter
      </label>
      <label
        className={`flex-1 rounded-xl px-3 py-2 cursor-pointer border bg-white/70 backdrop-blur-sm shadow-sm transition
        ${role === 'shelter'
          ? 'border-cyan-400 ring-2 ring-cyan-300 text-cyan-700 font-medium'
          : 'border-cyan-200 hover:border-cyan-300 text-slate-600'}`}
      >
        <input
          type="radio"
          className="mr-2 accent-cyan-500"
          name="role"
          value="shelter"
          checked={role === 'shelter'}
          onChange={() => setRole('shelter')}
        />
        Shelter
      </label>
    </div>

    <PasswordInput
      value={pw1}
      onChange={e => setPw1(e.target.value)}
      placeholder="Password (min 6 chars)"
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
    />
    <PasswordInput
      value={pw2}
      onChange={e => setPw2(e.target.value)}
      placeholder="Confirm password"
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
    />

    <button
      className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold text-white 
        bg-gradient-to-r from-cyan-500 to-sky-500 shadow-md hover:shadow-lg 
        hover:from-cyan-400 hover:to-sky-400 active:scale-[.98] 
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white 
        transition disabled:opacity-60"
      disabled={loading}
    >
      {loading ? 'Creating…' : 'Register'}
    </button>

    <div className="text-sm text-right">
      <Link
        to="/login"
        className="text-cyan-600 hover:text-cyan-700 hover:underline transition"
      >
        Already have an account?
      </Link>
    </div>
  </form>
</div>

  )
}
