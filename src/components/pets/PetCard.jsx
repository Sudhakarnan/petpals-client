import { Link } from 'react-router-dom'
import { API_ORIGIN } from '../../utils/constants'

// Build absolute URL for backend-served media
const mediaUrl = (p) => {
  if (!p) return 'https://placehold.co/600x400?text=No+Photo'
  // backend saves like "/uploads/123_file.jpg"
  if (p.startsWith('/uploads/')) return `${API_ORIGIN}${p}`
  // already absolute or external
  return p
}

export default function PetCard({ pet, isFav = false, onToggleFavorite }) {
  const photo = mediaUrl(pet?.photos?.[0])

  return (
   <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm 
                border border-cyan-100/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 
                transition-all duration-300">
  {/* Heart button */}
  <button
    type="button"
    onClick={onToggleFavorite}
    className="absolute top-2 right-2 z-10 inline-flex items-center justify-center 
               w-9 h-9 rounded-full bg-white/90 border border-cyan-200/70 
               hover:bg-rose-50 hover:border-rose-200 shadow-sm transition"
    aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
    title={isFav ? "Remove from favorites" : "Save to favorites"}
  >
    <svg
      viewBox="0 0 24 24"
      className={`w-5 h-5 transition-colors ${
        isFav ? "fill-rose-500 text-rose-500" : "fill-none text-slate-400 group-hover:text-rose-400"
      }`}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12.1 21.35l-1.1-.99C5.14 15.36 2 12.5 2 8.98 2 6.46 4.02 4.5 6.5 4.5c1.54 0 3.04.73 4 1.87A5.17 5.17 0 0 1 14.5 4.5C16.98 4.5 19 6.46 19 8.98c0 3.52-3.14 6.38-8.9 11.38l-1.1.99z"/>
    </svg>
  </button>

  {/* Image */}
  <Link to={`/pets/${pet._id}`} className="block overflow-hidden">
    <img
      src={photo}
      alt={pet.name}
      className="w-full h-44 object-cover transition-transform duration-500 hover:scale-[1.05]"
    />
  </Link>

  {/* Meta */}
  <div className="p-4">
    <Link
      to={`/pets/${pet._id}`}
      className="font-semibold text-[#0f2f3f] hover:text-cyan-700 hover:underline transition"
    >
      {pet.name}
    </Link>
    <div className="text-sm text-[#37596b] mt-1">
      {pet.species} • {pet.age} • {pet.size}
    </div>
    {pet.location && (
      <div className="text-xs text-slate-500 mt-1">{pet.location}</div>
    )}
  </div>
</div>

  )
}
