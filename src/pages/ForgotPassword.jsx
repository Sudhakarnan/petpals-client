import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { authApi } from '../api/apiClient'
import PasswordInput from '../components/auth/PasswordInput'

const maskEmail = (email) => {
  const [name, domain] = String(email).split('@')
  if (!domain) return email
  if (name.length <= 2) return `${name[0]}*${'@' + domain}`
  const first2 = name.slice(0, 2)
  const last1 = name.slice(-1)
  return `${first2}${'*'.repeat(Math.max(3, name.length - 3))}${last1}@${domain}`
}

export default function ForgotPassword() {
  const { push } = useToast()
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')          // for requesting the code
  const [confirmEmail, setConfirmEmail] = useState('') // for confirming on reset
  const [masked, setMasked] = useState('')
  const [otp, setOtp] = useState('')
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')
  const [loading, setLoading] = useState(false)

  const sendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authApi.forgot(email)
      setMasked(data?.maskedEmail || maskEmail(email))
      setConfirmEmail('') // require user to type full email now
      push('We sent a 6-digit code if the email exists.')
      setStep(2)
    } catch (err) {
      push(err?.response?.data?.message || 'Failed to send code', 'error')
    } finally {
      setLoading(false)
    }
  }

  const reset = async (e) => {
    e.preventDefault()
    if (pw1 !== pw2) return push('Passwords do not match', 'error')
    // optional early client-side check (server enforces anyway)
    if (confirmEmail.trim().toLowerCase() !== email.trim().toLowerCase()) {
      return push('Email must match the address we sent the code to.', 'error')
    }
    setLoading(true)
    try {
      await authApi.reset({ email: confirmEmail, otp, password: pw1 })
      push('Password reset successful. Please log in.')
      nav('/login')
    } catch (err) {
      push(err?.response?.data?.message || 'Invalid code or expired', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12 
  bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 
  rounded-2xl shadow-xl border border-cyan-100/70 backdrop-blur">
  
  {step === 1 ? (
    <form
      onSubmit={sendCode}
      className="rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur-md p-6 space-y-4 shadow-lg shadow-cyan-200/40 hover:shadow-cyan-300/50 transition-all"
    >
      <h1 className="text-2xl font-bold text-slate-900">Forgot password</h1>
      <p className="text-sm text-slate-600">
        Enter your email. We’ll send a <span className="font-medium text-cyan-700">6-digit code</span>.
      </p>
      <input
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="email"
      />
      <button
        className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium text-white bg-gradient-to-r from-cyan-500 to-sky-500 shadow-md shadow-cyan-400/40 hover:from-cyan-400 hover:to-sky-400 active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Sending…' : 'Send code'}
      </button>
    </form>
  ) : (
    <form
      onSubmit={reset}
      className="rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur-md p-6 space-y-4 shadow-lg shadow-cyan-200/40 hover:shadow-cyan-300/50 transition-all"
    >
      <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
      <p className="text-sm text-slate-600">
        Code sent to <span className="font-medium text-cyan-700">{masked}</span>. 
        Type your full email to confirm.
      </p>
      <input
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        placeholder="Your email (full)"
        value={confirmEmail}
        onChange={e => setConfirmEmail(e.target.value)}
        autoComplete="email"
      />
      <input
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        placeholder="6-digit code"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        maxLength={6}
      />
      <PasswordInput
        value={pw1}
        onChange={e => setPw1(e.target.value)}
        placeholder="New password"
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
      />
      <PasswordInput
        value={pw2}
        onChange={e => setPw2(e.target.value)}
        placeholder="Confirm new password"
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
      />
      <button
        className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium text-white bg-gradient-to-r from-cyan-500 to-sky-500 shadow-md shadow-cyan-400/40 hover:from-cyan-400 hover:to-sky-400 active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Resetting…' : 'Reset password'}
      </button>
    </form>
  )}
</div>

  )
}
