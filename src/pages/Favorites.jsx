import { useEffect, useState } from 'react'
import { favoritesApi } from '../api/apiClient'
import PetCard from '../components/pets/PetCard'

export default function Favorites() {
  const [items, setItems] = useState([])
  useEffect(() => { (async () => { const { data } = await favoritesApi.list(); setItems(data.items) })() }, [])
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 
  bg-gradient-to-br from-[#f0faff] via-[#ecf7ff] to-[#f7fcff] 
  min-h-screen rounded-2xl shadow-xl border border-[#d8ecf2]/80 backdrop-blur-md">

  <h1 className="text-2xl font-bold mb-6 text-[#0f2f3f]">
    My Favorites
  </h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map(p => (
      <div
        key={p._id}
        className="relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/95 to-[#f0faff]/80
        border border-[#cce5ed]/80 shadow-md p-4 backdrop-blur
        transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
      >
        {/* decorative gradient strip */}
        <span
          className="pointer-events-none absolute inset-y-0 left-0 w-1
          bg-gradient-to-b from-[#34d399] via-[#38bdf8] to-[#34d399] opacity-90
          shadow-[0_0_12px_2px_rgba(56,189,248,0.25)]"
        />

        <PetCard
          key={p._id}
          pet={p}
          isFav={true}
          onToggleFavorite={async () => {
            await favoritesApi.toggle(p._id)
            // remove from this list
            setItems(prev => prev.filter(x => x._id !== p._id))
          }}
        />
      </div>
    ))}
  </div>
</div>



  )
}