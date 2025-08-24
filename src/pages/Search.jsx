import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useQueryParams from '../hooks/useQueryParams'
import { petsApi, favoritesApi } from '../api/apiClient'
import PetCard from '../components/pets/PetCard'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'

export default function Search() {
  const qp = useQueryParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const { user } = useAuth()
  const { push } = useToast()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [favIds, setFavIds] = useState(() => new Set())

  const [form, setForm] = useState({
    text: qp.text || '',
    species: qp.species || '',
    age: qp.age || '',
    size: qp.size || '',
    location: qp.location || '',
    breed: qp.breed || '',
    page: Number(qp.page || 1)
  })
const [debounced] = useDebounce(form, 300)

const { data, isFetching } = useQuery({
  queryKey: ['pets', debounced],
  queryFn: () => petsApi.list({ ...debounced, excludeMine: true }).then(r => r.data),
  keepPreviousData: true,
})

  const params = useMemo(() => {
    const p = { ...form }
    Object.keys(p).forEach(k => (p[k] === '' || p[k] == null) && delete p[k])
    return p
  }, [form])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data } = await petsApi.list(params)
       const list = data.items || []
      // Hide my own pets
      const mineFiltered = user ? list.filter(p => String(p.shelter?._id) !== String(user.id)) : list
      setItems(mineFiltered)
    } finally {
      setLoading(false)
    }
  }

  // load pets when filters change
  useEffect(() => { fetchData() }, [JSON.stringify(params)])

  // load favorites once (or when auth changes)
  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        setFavIds(new Set())
        return
      }
      try {
        const { data } = await favoritesApi.list()
        const ids = new Set((data.items || []).map(p => p._id))
        setFavIds(ids)
      } catch (e) {
        // ignore silently
      }
    })()
  }, [isAuthenticated])

  const onSubmit = (e) => {
    e.preventDefault()
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => sp.set(k, v))
    setSearchParams(sp)
  }

  // Toggle handler used by PetCard
  const handleToggleFavorite = async (petId) => {
    if (!isAuthenticated) {
      push('Please log in to save favorites', 'info')
      navigate('/login')
      return
    }
    try {
      await favoritesApi.toggle(petId)
      setFavIds(prev => {
        const next = new Set(prev)
        if (next.has(petId)) next.delete(petId)
        else next.add(petId)
        return next
      })
    } catch (e) {
      push('Failed to update favorite', 'error')
    }
  }

  
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
  <h1 className="text-3xl font-extrabold mb-6 text-[#0f2f3f] drop-shadow-sm">
    Search Pets
  </h1>

  {/* Search Form */}
  <form
    onSubmit={onSubmit}
    className="grid md:grid-cols-6 gap-3 rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition"
  >
    <input
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
      placeholder="Keyword"
      value={form.text}
      onChange={e => setForm({ ...form, text: e.target.value })}
    />
    <select
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-slate-800 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
      value={form.species}
      onChange={e => setForm({ ...form, species: e.target.value })}
    >
      <option value="">Species</option>
      {['Dog','Cat','Rabbit','Bird','Other'].map(x => (
        <option key={x} value={x}>{x}</option>
      ))}
    </select>
    <select
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-slate-800 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
      value={form.age}
      onChange={e => setForm({ ...form, age: e.target.value })}
    >
      <option value="">Age</option>
      {['Baby','Young','Adult','Senior'].map(x => (
        <option key={x} value={x}>{x}</option>
      ))}
    </select>
    <select
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-slate-800 shadow-inner focus:ring-2 focus:ring-cyan-400 transition"
      value={form.size}
      onChange={e => setForm({ ...form, size: e.target.value })}
    >
      <option value="">Size</option>
      {['Small','Medium','Large'].map(x => (
        <option key={x} value={x}>{x}</option>
      ))}
    </select>
    <input
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
      placeholder="Location"
      value={form.location}
      onChange={e => setForm({ ...form, location: e.target.value })}
    />
    <input
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
      placeholder="Breed"
      value={form.breed}
      onChange={e => setForm({ ...form, breed: e.target.value })}
    />

    {/* Action Buttons */}
    <div className="md:col-span-6 flex gap-3 justify-end pt-2">
      <button
        type="button"
        className="inline-flex items-center px-5 py-2.5 rounded-xl font-medium
          border border-cyan-300 text-cyan-700 bg-white/70 backdrop-blur-sm
          hover:bg-cyan-50 hover:text-cyan-800 shadow-sm hover:shadow-md
          transition-all duration-300"
        onClick={() => {
          setForm({ text:'', species:'', age:'', size:'', location:'', breed:'', page:1 })
          navigate('/search')
        }}
      >
        Clear
      </button>
      <button
        className="inline-flex items-center px-5 py-2.5 rounded-xl font-semibold text-white
          bg-gradient-to-r from-cyan-500 to-sky-500 shadow-md hover:shadow-lg
          hover:from-cyan-400 hover:to-sky-400 active:scale-[.98]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white
          transition-all duration-300"
      >
        Search
      </button>
    </div>
  </form>

  {/* Results */}
  <div className="mt-8">
    {loading ? (
      <div className="flex justify-center items-center text-cyan-700 font-medium animate-pulse">
        Loading…
      </div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map(p => (
          <PetCard
            key={p._id}
            pet={p}
            isFav={favIds.has(p._id)}
            onToggleFavorite={() => handleToggleFavorite(p._id)}
          />
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center text-sm text-slate-500 bg-slate-50/80 border border-slate-200 rounded-xl py-6">
            No pets found. Try different filters.
          </div>
        )}
      </div>
    )}
  </div>
</div>

  )
}
