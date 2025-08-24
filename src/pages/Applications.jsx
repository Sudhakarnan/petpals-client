import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi, messagesApi } from '../api/apiClient'
import { useToast } from '../context/ToastContext'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import StatusBadge from '../components/common/StatusBadge'
import StatusSelect from '../components/common/StatusSelect'

const photoUrl = (p) =>
  (p && (p.startsWith('/uploads/')
    ? `${new URL(import.meta.env.VITE_API_BASE_URL).origin}${p}`
    : p)) || 'https://placehold.co/96x96?text=🐾'

export default function Applications() {
  const { push } = useToast()
  const nav = useNavigate()
  const qc = useQueryClient()
  const socket = useSocket()

  const { data: sentData } = useQuery({
    queryKey: ['applications', 'sent'],
    queryFn: async () => (await applicationsApi.listMine()).data,
  })
  const { data: recvData } = useQuery({
    queryKey: ['applications', 'received'],
    queryFn: async () => (await applicationsApi.byShelter()).data,
  })

  const sent = sentData?.items ?? []
  const received = recvData?.items ?? []

  // optimistic withdraw
  const withdrawMut = useMutation({
    mutationFn: (id) => applicationsApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['applications', 'sent'] })
      const prev = qc.getQueryData(['applications', 'sent'])
      qc.setQueryData(['applications', 'sent'], (old) => ({
        ...(old || { items: [] }),
        items: (old?.items || []).filter(x => x._id !== id)
      }))
      return { prev }
    },
    onError: (_err, _id, ctx) => { qc.setQueryData(['applications', 'sent'], ctx.prev) },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['applications', 'sent'] }) }
  })

  // optimistic status set
  const statusMut = useMutation({
    mutationFn: ({ id, status }) => applicationsApi.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['applications', 'received'] })
      const prev = qc.getQueryData(['applications', 'received'])
      qc.setQueryData(['applications', 'received'], (old) => ({
        ...(old || { items: [] }),
        items: (old?.items || []).map(x => x._id === id ? { ...x, status } : x)
      }))
      return { prev }
    },
    onError: (_e, _v, ctx) => { qc.setQueryData(['applications', 'received'], ctx.prev) },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['applications', 'received'] }) }
  })

  // optimistic remove (received)
  const removeRecvMut = useMutation({
    mutationFn: (id) => applicationsApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['applications', 'received'] })
      const prev = qc.getQueryData(['applications', 'received'])
      qc.setQueryData(['applications', 'received'], (old) => ({
        ...(old || { items: [] }),
        items: (old?.items || []).filter(x => x._id !== id)
      }))
      return { prev }
    },
    onError: (_e, _v, ctx) => { qc.setQueryData(['applications', 'received'], ctx.prev) },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['applications', 'received'] }) }
  })

  const startThread = async (toUserId, petId) => {
    try {
      const { data } = await messagesApi.start({ toUserId, petId })
      nav('/messages?thread=' + data._id)
    } catch { nav('/messages') }
  }

  // LIVE: socket handlers
  useEffect(() => {
    if (!socket) return
    const onNew = (app) => {
      qc.setQueryData(['applications', 'received'], (old) => {
        const items = old?.items || []
        const exists = items.some(x => x._id === app._id)
        return exists ? old : { items: [app, ...items] }
      })
    }
    const onUpdated = ({ _id, status }) => {
      qc.setQueryData(['applications', 'sent'], (old) => {
        if (!old) return old
        return { items: old.items.map(x => x._id === _id ? { ...x, status } : x) }
      })
      qc.setQueryData(['applications', 'received'], (old) => {
        if (!old) return old
        return { items: old.items.map(x => x._id === _id ? { ...x, status } : x) }
      })
    }
    const onRemoved = ({ _id }) => {
      qc.setQueryData(['applications', 'sent'], (old) => {
        if (!old) return old
        return { items: old.items.filter(x => x._id !== _id) }
      })
      qc.setQueryData(['applications', 'received'], (old) => {
        if (!old) return old
        return { items: old.items.filter(x => x._id !== _id) }
      })
    }

    socket.on('application:new', onNew)
    socket.on('application:updated', onUpdated)
    socket.on('application:removed', onRemoved)
    return () => {
      socket.off('application:new', onNew)
      socket.off('application:updated', onUpdated)
      socket.off('application:removed', onRemoved)
    }
  }, [socket, qc])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-violet-100 to-pink-100 text-slate-800 antialiased">
  <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
    {/* SENT APPLICATIONS */}
    <section>
      <h2 className="text-xl font-semibold mb-4 text-slate-900">My Applications (Sent)</h2>
      <div className="space-y-4">
        {sent.map(a => (
          <details
            key={a._id}
            className="rounded-2xl border border-slate-300/50 bg-slate-50/90 backdrop-blur-md p-4 shadow-lg shadow-violet-200/50 hover:shadow-violet-300/60 transition"
          >
            <summary className="flex items-center gap-4 cursor-pointer">
              <img
                src={photoUrl(a.pet?.photos?.[0])}
                className="h-14 w-14 rounded-xl object-cover border border-slate-300 shadow-md"
                alt=""
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900">{a.pet?.name}</div>
                <div className="mt-1"><StatusBadge status={a.status} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/pets/${a.pet?._id}`}
                  className="inline-flex items-center rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-400 to-sky-400 px-3 py-1.5 text-white shadow hover:from-indigo-300 hover:to-sky-300 active:scale-[.98] transition"
                >
                  View Pet
                </Link>
                <button
                  className="inline-flex items-center rounded-xl border border-rose-200 bg-gradient-to-r from-rose-400 to-pink-400 px-3 py-1.5 text-white shadow hover:from-rose-300 hover:to-pink-300 active:scale-[.98] transition"
                  onClick={() => withdrawMut.mutate(a._id)}
                >
                  Withdraw
                </button>
              </div>
            </summary>
          </details>
        ))}
        {sent.length === 0 && (
          <div className="text-sm text-slate-600">No applications yet.</div>
        )}
      </div>
    </section>

    {/* RECEIVED APPLICATIONS */}
    <section>
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Applications (Received)</h2>
      <div className="space-y-4">
        {received.map(a => (
          <details
            key={a._id}
            className="rounded-2xl border border-slate-300/50 bg-slate-50/90 backdrop-blur-md p-4 shadow-lg shadow-violet-200/50 hover:shadow-violet-300/60 transition"
          >
            <summary className="flex items-center gap-4 cursor-pointer">
              <img
                src={photoUrl(a.pet?.photos?.[0])}
                className="h-14 w-14 rounded-xl object-cover border border-slate-300 shadow-md"
                alt=""
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900">
                  {a.applicant?.name} → {a.pet?.name}
                </div>
                <div className="text-xs text-slate-600">
                  {new Date(a.createdAt).toLocaleString()}
                </div>
              </div>
              <StatusBadge status={a.status} />
            </summary>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-700">Set status:</span>
              <select
                className="rounded-lg border border-slate-300 bg-slate-100 text-slate-800 px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
                value={a.status}
                onChange={(e) => statusMut.mutate({ id: a._id, status: e.target.value })}
              >
                {['pending', 'reviewing', 'approved', 'rejected'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                className="inline-flex items-center rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-400 to-sky-400 px-3 py-1.5 text-white shadow hover:from-indigo-300 hover:to-sky-300 active:scale-[.98] transition"
                onClick={() => startThread(a.applicant?._id, a.pet?._id)}
              >
                Message
              </button>
              <button
                className="inline-flex items-center rounded-xl border border-rose-200 bg-gradient-to-r from-rose-400 to-pink-400 px-3 py-1.5 text-white shadow hover:from-rose-300 hover:to-pink-300 active:scale-[.98] transition"
                onClick={() => removeRecvMut.mutate(a._id)}
              >
                Remove
              </button>
            </div>
          </details>
        ))}
        {received.length === 0 && (
          <div className="text-sm text-slate-600">No applications received yet.</div>
        )}
      </div>
    </section>
  </div>
</div>


  )
}
