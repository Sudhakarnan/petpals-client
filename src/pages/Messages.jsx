import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { messagesApi } from '../api/apiClient'

function MessageThread({ thread, onDeleteForMe }) {
  const listRef = useRef(null)
  const msgs = Array.isArray(thread?.messages) ? thread.messages : []

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [msgs.length])

  return (
    <div ref={listRef} className="card p-4 h-80 overflow-y-auto space-y-2">
      {msgs.map((m, i) => {
        const key = m._id || i
        const mine = !!m.fromSelf
        return (
          <div key={key} className={`max-w-[80%] ${mine ? 'ml-auto text-right' : ''}`}>
            <div className={`inline-block px-3 py-2 rounded-xl shadow-sm border
              ${mine ? 'bg-sky-50 border-sky-200' : 'bg-white border-gray-200'}`}>
              <div className="whitespace-pre-wrap text-sm">{m.text}</div>
              <div className="mt-1 flex items-center gap-3 text-[10px] text-gray-500">
                <time>{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</time>
                <button
                  type="button"
                  className="hover:text-rose-600"
                  title="Delete for me"
                  onClick={() => onDeleteForMe?.(m._id)}
                >
                  Delete for me
                </button>
              </div>
            </div>
          </div>
        )
      })}
      {msgs.length === 0 && (
        <div className="text-xs text-gray-500">No messages yet. Say hi 👋</div>
      )}
    </div>
  )
}

function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const submit = (e) => {
    e?.preventDefault?.()
    const t = text.trim()
    if (!t) return
    onSend?.(t)
    setText('')
  }
  return (
    <form className="flex gap-2" onSubmit={submit}>
      <input
        className="input flex-1"
        placeholder="Type a message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) submit(e) }}
        disabled={disabled}
      />
      <button className="btn-primary" disabled={disabled}>Send</button>
    </form>
  )
}

export default function Messages() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [threads, setThreads] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sp] = useSearchParams()

  const activeId = active?._id
  const sortedThreads = useMemo(() => threads, [threads])

  const loadThreads = async () => {
    setError('')
    try {
      const { data } = await messagesApi.threads()
      const items = Array.isArray(data?.items) ? data.items : []
      setThreads(items)
      return items
    } catch (e) {
      console.error('threads load failed', e?.response?.data || e.message)
      setError(e?.response?.data?.message || 'Failed to load conversations')
      setThreads([])
      return []
    }
  }

  useEffect(() => {
    if (authLoading || !isAuthenticated) return
    (async () => { /* load threads */ })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated])


  const send = async (text) => {
    if (!active) return
    try {
      const { data } = await messagesApi.send({ threadId: active._id, text })
      const msg = data || { text, fromSelf: true, createdAt: new Date().toISOString() }
      setActive(prev => prev ? { ...prev, messages: [...(prev.messages || []), msg] } : prev)
      setThreads(prev => {
        const list = [...prev]
        const idx = list.findIndex(t => t._id === active._id)
        const updated = {
          ...(list[idx] || active),
          lastMessage: msg,
          pet: (list[idx] || active).pet, // keep pet reference
        }
        if (idx >= 0) {
          list.splice(idx, 1)
          return [updated, ...list]
        }
        return [updated, ...list]
      })
    } catch (e) {
      console.error('send failed', e?.response?.data || e.message)
      setError(e?.response?.data?.message || 'Failed to send message')
    }
  }

  const deleteForMe = async (messageId) => {
    if (!active || !messageId) return
    try {
      await messagesApi.deleteForMe(active._id, messageId)
      setActive(prev => prev
        ? { ...prev, messages: (prev.messages || []).filter(m => m._id !== messageId) }
        : prev)
    } catch (e) {
      console.error('delete-for-me failed', e?.response?.data || e.message)
      setError(e?.response?.data?.message || 'Failed to delete message')
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mx-auto max-w-6xl px-4 py-10 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 rounded-2xl border border-cyan-100/70 shadow-2xl backdrop-blur">
      <aside className="rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur-md p-3 h-[520px] overflow-y-auto shadow-md">
        <h2 className="font-semibold mb-3 text-slate-900">Conversations</h2>
        {error && (
          <div className="mb-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-2">
            {error}
          </div>
        )}
        {sortedThreads.map(t => (
          <button
            key={t._id}
            className={`block w-full text-left px-3 py-2 rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${activeId === t._id
                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-sm'
                : 'hover:bg-sky-50 text-slate-700'
              }`}
            onClick={() => setActive(t)}
          >
            <div className="font-medium">{t.otherParty?.name || 'Chat'}</div>
            {/* Tiny pet label */}
            <div className="text-[11px] opacity-70">
              {t.pet?.name ? `For ${t.pet.name}` : 'General chat'}
            </div>
            <div className="text-[10px] opacity-70 truncate">
              {t.lastMessage?.text || 'No messages yet'}
            </div>
          </button>
        ))}
        {!loading && sortedThreads.length === 0 && (
          <div className="text-sm text-slate-500">No conversations yet.</div>
        )}
      </aside>

      <section className="md:col-span-2 space-y-3">
        {active ? (
          <>
            {/* Chat header with tiny pet text */}
            <div className="px-1 text-sm text-slate-600">
              {active.otherParty?.name}{' '}
              <span className="opacity-80">
                {active.pet?.name ? `• For ${active.pet.name}` : '• General chat'}
              </span>
            </div>
            <MessageThread thread={active} onDeleteForMe={deleteForMe} />
            <MessageInput onSend={send} disabled={loading} />
          </>
        ) : (
          <div className="rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur-md p-6 shadow-md">
            Select a conversation
          </div>
        )}
      </section>
    </div>

  )
}
