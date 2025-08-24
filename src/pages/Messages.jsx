// src/pages/Messages.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'      // <-- IMPORTANT
import { messagesApi } from '../api/apiClient'

function MessageThread({ thread, onDeleteForMe }) {
  const listRef = useRef(null)
  const msgs = Array.isArray(thread?.messages) ? thread.messages : []

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [msgs.length])

  return (
    <div ref={listRef} className="card p-4 h-80 overflow-y-auto space-y-2">
      {msgs.map((m, i) => {
        const mine = !!m.fromSelf
        const key = m._id || i
        return (
          <div key={key} className={`max-w-[80%] ${mine ? 'ml-auto text-right' : ''}`}>
            <div className={`inline-block px-3 py-2 rounded-xl shadow-sm border
                ${mine ? 'bg-sky-50 border-sky-200' : 'bg-white border-gray-200'}`}>
              <div className="whitespace-pre-wrap text-sm">{m.text}</div>
              <div className="mt-1 flex items-center gap-3 text-[10px] text-gray-500">
                <time>{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</time>
                {onDeleteForMe && m._id && (
                  <button
                    type="button"
                    className="hover:text-rose-600"
                    title="Delete for me"
                    onClick={() => onDeleteForMe(m._id)}
                  >
                    Delete for me
                  </button>
                )}
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
  const { isAuthenticated, loading: authLoading } = useAuth()   // <-- use it here
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
      setError(e?.response?.data?.message || 'Failed to load conversations')
      setThreads([])
      return []
    }
  }

  // Only fetch once auth context is ready & the user is logged in
  useEffect(() => {
    if (authLoading || !isAuthenticated) return
    (async () => {
      setLoading(true)
      const items = await loadThreads()
      const qThread = sp.get('thread')
      const to = sp.get('to')
      const petId = sp.get('pet')

      try {
        if (qThread) {
          const found = items.find(t => t._id === qThread)
          if (found) setActive(found)
          else {
            const { data } = await messagesApi.get(qThread)
            if (data) {
              setActive(data)
              setThreads(prev => prev.some(t => t._id === data._id) ? prev : [data, ...prev])
            }
          }
        } else if (to) {
          const { data } = await messagesApi.start({ toUserId: to, petId })
          const items2 = await loadThreads()
          const found2 = items2.find(t => t._id === data?._id)
          setActive(found2 || data || null)
        } else {
          setActive(items[0] || null)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [authLoading, isAuthenticated]) // re-run if auth state changes

  const send = async (text) => {
    if (!active) return
    try {
      const { data } = await messagesApi.send({ threadId: active._id, text })
      const msg = data || { text, fromSelf: true, createdAt: new Date().toISOString() }
      setActive(prev => prev ? { ...prev, messages: [...(prev.messages || []), msg] } : prev)
      setThreads(prev => {
        const list = [...prev]
        const idx = list.findIndex(t => t._id === active._id)
        const updated = { ...(list[idx] || active), lastMessage: msg, pet: (list[idx] || active).pet }
        if (idx >= 0) { list.splice(idx, 1); return [updated, ...list] }
        return [updated, ...list]
      })
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to send message')
    }
  }

  const deleteForMe = async (messageId) => {
    if (!active || !messageId) return
    try {
      await messagesApi.deleteForMe?.(active._id, messageId) // only if your API supports it
      setActive(prev => prev
        ? { ...prev, messages: (prev.messages || []).filter(m => m._id !== messageId) }
        : prev)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete message')
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mx-auto max-w-6xl px-4 py-10">
      <aside className="card p-3 h-[520px] overflow-y-auto">
        <h2 className="font-semibold mb-2">Conversations</h2>
        {error && <div className="mb-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded p-2">{error}</div>}
        {sortedThreads.map(t => (
          <button
            key={t._id}
            className={`block w-full text-left px-3 py-2 rounded transition
              ${activeId === t._id ? 'bg-brand text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setActive(t)}
          >
            <div className="font-medium">{t.otherParty?.name || 'Chat'}</div>
            <div className="text-[11px] opacity-70">
              {t.pet?.name ? `For ${t.pet.name}` : 'General chat'}
            </div>
            <div className="text-[10px] opacity-70 truncate">
              {t.lastMessage?.text || 'No messages yet'}
            </div>
          </button>
        ))}
        {!loading && sortedThreads.length === 0 && (
          <div className="text-sm text-gray-500">No conversations yet.</div>
        )}
      </aside>

      <section className="md:col-span-2 space-y-3">
        {active ? (
          <>
            <div className="px-1 text-sm text-gray-500">
              {active.otherParty?.name}{' '}
              <span className="opacity-80">
                {active.pet?.name ? `• For ${active.pet.name}` : '• General chat'}
              </span>
            </div>
            <MessageThread thread={active} onDeleteForMe={deleteForMe} />
            <MessageInput onSend={send} disabled={loading} />
          </>
        ) : (
          <div className="card p-6">Select a conversation</div>
        )}
      </section>
    </div>
  )
}
