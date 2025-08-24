import { useEffect, useState } from 'react'
import { AGE_OPTIONS, SIZE_OPTIONS, SPECIES } from '../../utils/constants'

export default function PetFilters({ initial = {}, onChange }) {
  const [q, setQ] = useState({
    text: initial.text || '',
    species: initial.species || '',
    age: initial.age || '',
    size: initial.size || '',
    location: initial.location || '',
    breed: initial.breed || ''
  })

  useEffect(() => { onChange?.(q) }, [q])

  return (
    <div
  className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 
             rounded-2xl shadow-sm border border-cyan-200/70 
             bg-white/80 backdrop-blur-sm hover:shadow-md transition"
>
  <input
    className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 
               text-slate-800 placeholder-slate-500 shadow-inner
               focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
    placeholder="Search by name or keyword"
    value={q.text}
    onChange={(e) => setQ({ ...q, text: e.target.value })}
  />

  <select
    className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 
               text-slate-800 shadow-inner
               focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
    value={q.species}
    onChange={(e) => setQ({ ...q, species: e.target.value })}
  >
    <option value="">All species</option>
    {SPECIES.map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>

  <select
    className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 
               text-slate-800 shadow-inner
               focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
    value={q.age}
    onChange={(e) => setQ({ ...q, age: e.target.value })}
  >
    <option value="">Any age</option>
    {AGE_OPTIONS.map((a) => (
      <option key={a} value={a}>
        {a}
      </option>
    ))}
  </select>

  <select
    className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 
               text-slate-800 shadow-inner
               focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
    value={q.size}
    onChange={(e) => setQ({ ...q, size: e.target.value })}
  >
    <option value="">Any size</option>
    {SIZE_OPTIONS.map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>

  <input
    className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 
               text-slate-800 placeholder-slate-500 shadow-inner
               focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
    placeholder="Location (city)"
    value={q.location}
    onChange={(e) => setQ({ ...q, location: e.target.value })}
  />

  <input
    className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 
               text-slate-800 placeholder-slate-500 shadow-inner
               focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
    placeholder="Breed"
    value={q.breed}
    onChange={(e) => setQ({ ...q, breed: e.target.value })}
  />
</div>


  )
}