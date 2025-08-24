import { useState } from 'react'

export default function PasswordInput({ value, onChange, name = 'password', placeholder = 'Password', autoComplete = 'new-password' }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
  <input
    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 pr-10 text-slate-700 placeholder-slate-400
               shadow-inner focus:border-transparent focus:ring-2 focus:ring-sky-300 focus:outline-none transition"
    type={show ? "text" : "password"}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    autoComplete={autoComplete}
  />
  <button
    type="button"
    onClick={() => setShow((s) => !s)}
    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-200 rounded-r-xl transition"
    title={show ? "Hide password" : "Show password"}
    aria-label={show ? "Hide password" : "Show password"}
  >
    {show ? (
      // eye-off
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.53 2.47a.75.75 0 10-1.06 1.06l18 18a.75.75 0 001.06-1.06l-3.06-3.06A11.3 11.3 0 0021.75 12S18 4.5 12 4.5c-1.53 0-2.95.34-4.21.88L3.53 2.47zM12 6c4.49 0 7.82 3.12 9.17 6-.43.98-1.07 2.06-1.92 3L16.4 12.15c.06-.31.1-.64.1-.98A4.5 4.5 0 0012 6zm3.6 7.85L9.15 7.4A4.5 4.5 0 0012 16.5c.34 0 .67-.04.98-.1zM4.83 7.01c-.85.94-1.48 2.02-1.92 3 1.35 2.88 4.68 6 9.09 6 1.08 0 2.1-.19 3.04-.52l-1.2-1.2a5.98 5.98 0 01-1.84.29A6 6 0 019 9.9L7.79 8.7c-.5.45-.96.97-1.36 1.55L4.83 7z"/>
      </svg>
    ) : (
      // eye
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-2.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
      </svg>
    )}
  </button>
</div>

  )
}
