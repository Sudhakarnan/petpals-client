import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { favoritesApi, applicationsApi, petsApi } from '../api/apiClient'
import PetCard from '../components/pets/PetCard'
import MediaUploader from '../components/pets/MediaUploader'
import { useToast } from '../context/ToastContext'

export default function DashboardAdopter() {
  const [favorites, setFavorites] = useState([])
  const [apps, setApps] = useState([])
  const [myPets, setMyPets] = useState([])
  const [files, setFiles] = useState([])
  const [creating, setCreating] = useState(false)
  const { push } = useToast()
  const nav = useNavigate()

  const [form, setForm] = useState({
    name: '',
    species: 'Dog',
    age: 'Adult',
    size: 'Medium',
    breed: '',
    color: '',
    location: '',
    description: '',
    medicalHistory: ''
  })

  const loadAll = async () => {
    const [favRes, appsRes, petsRes] = await Promise.all([
      favoritesApi.list(),
      applicationsApi.listMine(),
      petsApi.list({ mine: true })
    ])
    setFavorites(favRes.data.items || [])
    setApps(appsRes.data.items || [])
    setMyPets(petsRes.data.items || [])
  }

  useEffect(() => { loadAll() }, [])

  // Refresh my applications when tab becomes visible (so owner’s status updates show up)
  useEffect(() => {
    const onVis = async () => {
      if (document.visibilityState === 'visible') {
        const { data } = await applicationsApi.listMine()
        setApps(data.items || [])
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const createPet = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      files.forEach(f => data.append('files', f))
      await petsApi.create(data)
      push('Pet listed!')
      setForm({
        name: '', species: 'Dog', age: 'Adult', size: 'Medium',
        breed: '', color: '', location: '', description: '', medicalHistory: ''
      })
      setFiles([])
      const { data: p } = await petsApi.list({ mine: true })
      setMyPets(p.items || [])
    } catch (e) {
      push(e?.response?.data?.message || 'Failed to create pet', 'error')
    } finally {
      setCreating(false)
    }
  }

  const removePet = async (id) => {
    if (!confirm('Delete this pet? All related applications will be removed.')) return
    try {
      await petsApi.remove(id)
      setMyPets(prev => prev.filter(x => x._id !== id))
      // also remove any of my applications referencing this pet (if any were present in this view)
      setApps(prev => prev.filter(a => String(a.pet?._id) !== String(id)))
      push('Pet deleted')
    } catch (e) {
      push(e?.response?.data?.message || 'Failed to delete pet', 'error')
    }
  }

  const withdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return
    try {
      await applicationsApi.remove(id)
      setApps(prev => prev.filter(x => x._id !== id))
      push('Application withdrawn')
    } catch (e) {
      push(e?.response?.data?.message || 'Failed to withdraw', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12
  bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50
  rounded-3xl shadow-2xl border border-cyan-100/70 backdrop-blur">

  {/* Add a Pet (adopters can also post) */}
  <section>
    <h2 className="text-2xl font-bold mb-6 text-slate-900">List a Pet</h2>
    <form
      onSubmit={createPet}
      className="rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur-md p-6 grid md:grid-cols-2 gap-4 shadow-lg shadow-cyan-200/40 hover:shadow-cyan-300/50 transition-all"
    >
      <input
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        placeholder="Name"
        value={form.name}
        onChange={e=>setForm({...form, name:e.target.value})}
      />
      <input
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        placeholder="Breed"
        value={form.breed}
        onChange={e=>setForm({...form, breed:e.target.value})}
      />
      <select
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
        value={form.species}
        onChange={e=>setForm({...form, species:e.target.value})}
      >
        {['Dog','Cat','Rabbit','Bird','Other'].map(s=><option key={s} value={s}>{s}</option>)}
      </select>
      <select
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
        value={form.age}
        onChange={e=>setForm({...form, age:e.target.value})}
      >
        {['Baby','Young','Adult','Senior'].map(s=><option key={s} value={s}>{s}</option>)}
      </select>
      <select
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
        value={form.size}
        onChange={e=>setForm({...form, size:e.target.value})}
      >
        {['Small','Medium','Large'].map(s=><option key={s} value={s}>{s}</option>)}
      </select>
      <input
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        placeholder="Color"
        value={form.color}
        onChange={e=>setForm({...form, color:e.target.value})}
      />
      <input
        className="w-full rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        placeholder="Location"
        value={form.location}
        onChange={e=>setForm({...form, location:e.target.value})}
      />
      <textarea
        rows={3}
        className="w-full md:col-span-2 rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        placeholder="Description"
        value={form.description}
        onChange={e=>setForm({...form, description:e.target.value})}
      />
      <textarea
        rows={2}
        className="w-full md:col-span-2 rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        placeholder="Medical history"
        value={form.medicalHistory}
        onChange={e=>setForm({...form, medicalHistory:e.target.value})}
      />
      <div className="md:col-span-2">
        <MediaUploader files={files} onChange={setFiles}/>
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button
          className="inline-flex items-center rounded-xl px-5 py-2.5 font-medium text-white bg-gradient-to-r from-cyan-500 to-sky-500 shadow-lg shadow-cyan-400/40 hover:from-cyan-400 hover:to-sky-400 active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50 transition disabled:opacity-60"
          disabled={creating}
        >
          {creating ? 'Creating…' : 'Create'}
        </button>
      </div>
    </form>
  </section>

  {/* My Pets */}
  <section>
    <h2 className="text-2xl font-bold mb-6 text-slate-900">My Pets</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {myPets.map(p => (
        <div
          key={p._id}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-sky-50 border border-cyan-200/60 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Link to={`/pets/${p._id}`} className="block">
            <img
              src={(p.photos?.[0] && (p.photos[0].startsWith('/uploads/') ? `${new URL(import.meta.env.VITE_API_BASE_URL).origin}${p.photos[0]}` : p.photos[0])) || 'https://placehold.co/600x400?text=No+Photo'}
              alt={p.name}
              className="w-full h-44 object-cover hover:scale-[1.03] transition-transform"
            />
          </Link>
          <div className="p-4 flex items-center justify-between">
            <div>
              <Link to={`/pets/${p._id}`} className="font-semibold text-teal-900 hover:underline">
                {p.name}
              </Link>
              <div className="text-xs text-slate-600">{p.species} • {p.age} • {p.size}</div>
            </div>
            <button
              className="inline-flex items-center rounded-xl border border-rose-300 bg-gradient-to-r from-rose-100 to-rose-200 px-3 py-1.5 text-rose-700 hover:from-rose-200 hover:to-rose-300 transition"
              onClick={()=>removePet(p._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {myPets.length === 0 && <div className="text-sm text-slate-500">You haven’t listed any pets yet.</div>}
    </div>
  </section>

  {/* Saved Pets */}
  <section>
    <h2 className="text-2xl font-bold mb-6 text-slate-900">Saved Pets</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((p) => (
        <PetCard key={p._id} pet={p} isFav={true} />
      ))}
      {favorites.length === 0 && <div className="text-sm text-slate-500">No favorites yet.</div>}
    </div>
  </section>

  {/* My Applications */}
  <section>
    <h2 className="text-2xl font-bold mb-6 text-slate-900">My Applications</h2>
    <ul className="space-y-4">
      {apps.map((a) => (
        <li
          key={a._id}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-sky-50 border border-cyan-200/60 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur p-5 group"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-teal-900">{a.pet?.name}</div>
              <div className="mt-1 text-xs font-medium inline-flex items-center gap-2">
                <span className="text-slate-600">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm">
                  {a.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/pets/${a.pet?._id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-300 text-cyan-800 bg-gradient-to-r from-cyan-50 to-sky-100 hover:from-cyan-100 hover:to-sky-200 shadow-sm hover:shadow-md transition"
              >
                View Pet
              </Link>
              <button
                className="inline-flex items-center rounded-xl border border-rose-300 bg-gradient-to-r from-rose-100 to-rose-200 px-3 py-1.5 text-rose-700 hover:from-rose-200 hover:to-rose-300 transition"
                onClick={()=>withdraw(a._id)}
              >
                Withdraw
              </button>
            </div>
          </div>
        </li>
      ))}
      {apps.length === 0 && <div className="text-sm text-slate-500">No applications yet.</div>}
    </ul>
  </section>
</div>

  )
}
