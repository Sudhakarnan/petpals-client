import { useEffect, useState } from 'react'
import { petsApi, applicationsApi, messagesApi } from '../api/apiClient'
import MediaUploader from '../components/pets/MediaUploader'
import { useNavigate } from 'react-router-dom'

export default function DashboardShelter() {
  const [pets, setPets] = useState([])
  const [apps, setApps] = useState([])
  const [openId, setOpenId] = useState(null)
  const [form, setForm] = useState({ name: '', species: 'Dog', age: 'Adult', size: 'Medium', breed: '', color: '', location: '', description: '', medicalHistory: '' })
  const [files, setFiles] = useState([])
  const nav = useNavigate()

  const loadData = async () => {
    const [{ data: p }, { data: a }] = await Promise.all([
      petsApi.list({ mine: true }),
      applicationsApi.byShelter()
    ])
    setPets(p.items)
    setApps(a.items)
  }

  useEffect(() => { loadData() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    files.forEach(f => fd.append('files', f))
    await petsApi.create(fd)
    setForm({ name: '', species: 'Dog', age: 'Adult', size: 'Medium', breed: '', color: '', location: '', description: '', medicalHistory: '' })
    setFiles([])
    loadData()
  }

  const setStatus = async (id, status) => {
    await applicationsApi.updateStatus(id, status)
    loadData()
  }

  const withdrawApp = async (id) => {
    await applicationsApi.remove(id)
    setApps(prev => prev.filter(x => x._id !== id))
  }

  const startChat = async (toUserId, petId) => {
    try {
      const { data } = await messagesApi.start({ toUserId, petId })
      nav('/messages?thread=' + data._id)
    } catch {
      // fallback: open messages list
      nav('/messages')
    }
  }
  // inside DashboardShelter (or the unified dashboard you use)
  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: a }] = await Promise.all([
        petsApi.list({ mine: true }),
        applicationsApi.byShelter(),   // RECEIVED applications for my pets
      ])
      setPets(p.items || [])
      setApps(a.items || [])
    })()
  }, [])

  const photoUrl = (url) =>
    (url && (url.startsWith('/uploads/')
      ? `${new URL(import.meta.env.VITE_API_BASE_URL).origin}${url}`
      : url)) || 'https://placehold.co/96x96?text=🐾'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 rounded-3xl border border-cyan-100/70 shadow-2xl backdrop-blur">
  {/* Add Pet */}
  <section className="grid md:grid-cols-2 gap-8">
    <form
      className="rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur-md p-6 space-y-3 shadow-lg shadow-cyan-200/40 hover:shadow-cyan-300/50 transition-all"
      onSubmit={handleCreate}
    >
      <h2 className="text-xl font-semibold text-slate-900">Add a Pet</h2>

      {['name', 'breed', 'color', 'location'].map(k => (
        <input
          key={k}
          className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
          placeholder={k}
          value={form[k]}
          onChange={e => setForm({ ...form, [k]: e.target.value })}
        />
      ))}

      <div className="grid grid-cols-3 gap-2">
        <select
          className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
          value={form.species}
          onChange={e => setForm({ ...form, species: e.target.value })}
        >
          {['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
        >
          {['Baby', 'Young', 'Adult', 'Senior'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
          value={form.size}
          onChange={e => setForm({ ...form, size: e.target.value })}
        >
          {['Small', 'Medium', 'Large'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <textarea
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        rows={3}
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <textarea
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        rows={2}
        placeholder="Medical history"
        value={form.medicalHistory}
        onChange={e => setForm({ ...form, medicalHistory: e.target.value })}
      />

      <MediaUploader files={files} onChange={setFiles} />

      <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-medium text-white bg-gradient-to-r from-cyan-500 to-sky-500 shadow-lg shadow-cyan-400/40 hover:from-cyan-400 hover:to-sky-400 active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50 transition">
        Create
      </button>
    </form>

    {/* My Pets */}
    <div>
      <h2 className="text-xl font-semibold mb-4 text-slate-900">My Pets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pets.map(p => (
          <div
            key={p._id}
            className="rounded-2xl border border-cyan-200/60 bg-gradient-to-br from-white to-sky-50 p-4 shadow-md hover:shadow-lg transition"
          >
            <div className="font-semibold text-teal-900">{p.name}</div>
            <div className="text-xs text-slate-600">{p.species} • {p.age} • {p.size}</div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Applications (for my pets) */}
  <section className="mt-8">
    <h2 className="text-xl font-semibold mb-4 text-slate-900">Applications (Received)</h2>
    <div className="space-y-3">
      {apps.map(a => (
        <details
          key={a._id}
          className="rounded-2xl border border-cyan-200/60 bg-white/80 backdrop-blur-md p-4 shadow-sm hover:shadow-lg transition"
        >
          <summary className="flex items-center gap-3 cursor-pointer">
            <img
              src={photoUrl(a.pet?.photos?.[0])}
              className="h-12 w-12 rounded object-cover border border-slate-300 shadow-sm"
            />
            <div className="flex-1">
              <div className="font-medium text-slate-900">{a.applicant?.name} → {a.pet?.name}</div>
              <div className="text-xs text-slate-600">{new Date(a.createdAt).toLocaleString()}</div>
            </div>
            <StatusBadge status={a.status} />
          </summary>

          <div className="pt-4 grid sm:grid-cols-3 gap-3 text-sm">
            <div><div className="text-slate-500 text-xs">Tell the shelter about you</div>{a.about || '-'}</div>
            <div><div className="text-slate-500 text-xs">Home type</div>{a.home || '-'}</div>
            <div><div className="text-slate-500 text-xs">Have pets?</div>{a.havePets || '-'}</div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-700">Set status:</span>
              <StatusSelect value={a.status} onChange={(s) => updateStatus(a._id, s)} />
            </div>
            {/* message / remove buttons as you already have */}
          </div>
        </details>
      ))}
      {apps.length === 0 && (
        <div className="text-sm text-slate-500">No applications received yet.</div>
      )}
    </div>
  </section>
</div>

  )
}
