import { createContext, useContext, useMemo, useRef, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const remove = (id) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((t) => t.filter((x) => x.id !== id))
  }

  const push = (message, type = 'success', { timeout = 3500 } = {}) => {
    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, message, type }])
    const timer = setTimeout(() => remove(id), timeout)
    timers.current.set(id, timer)
    return id
  }

  const value = useMemo(() => ({ push, remove }), [])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {/* viewport */}
      <div className="fixed z-[1000] top-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              `flex items-start gap-3 rounded-xl border px-4 py-3 shadow-md max-w-xs
               ${t.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : t.type === 'info'
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`
            }
          >
            <div className="mt-0.5">
              {t.type === 'error' ? '⚠️' : t.type === 'info' ? 'ℹ️' : '✅'}
            </div>
            <div className="text-sm leading-snug">{t.message}</div>
            <button
              onClick={() => remove(t.id)}
              className="ml-auto -mr-1 text-xs opacity-70 hover:opacity-100"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  // no-op fallback so destructuring never crashes
  return ctx || { push: () => {}, remove: () => {} }
}
