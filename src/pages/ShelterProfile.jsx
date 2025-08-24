import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { sheltersApi, petsApi, reviewsApi } from '../api/apiClient'
import PetCard from '../components/pets/PetCard'
import ReviewList from '../components/reviews/ReviewList'

export default function ShelterProfile() {
  const { id } = useParams()
  const [shelter, setShelter] = useState(null)
  const [pets, setPets] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const run = async () => {
      const [{ data: s }, { data: p }, { data: r }] = await Promise.all([
        sheltersApi.get(id),
        petsApi.list({ shelterId: id }),
        reviewsApi.list('shelter', id)
      ])
      setShelter(s)
      setPets(p.items)
      setReviews(r.items)
    }
    run()
  }, [id])

  if (!shelter) return <div className="mx-auto max-w-6xl px-4 py-10">Loading...</div>

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-12
  bg-gradient-to-b from-[#fff1f2] via-white to-[#ffe4e6] 
  rounded-3xl shadow-lg border border-pink-100/70 
  backdrop-blur-sm transition-all duration-300">

  {/* Header */}
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 animate-fade-in">
    <div className="space-y-1">
      <h1 className="text-3xl font-extrabold text-pink-700 tracking-tight drop-shadow-sm">
        {shelter.name}
      </h1>
      <p className="text-gray-600">{shelter.city} • {shelter.state}</p>
      <a
        className="text-pink-600 hover:text-pink-700 underline font-medium transition-colors"
        href={`mailto:${shelter.email}`}
      >
        {shelter.email}
      </a>
    </div>

    <div className="bg-white/90 rounded-2xl shadow-md p-6 border border-pink-100/80 
      hover:shadow-lg hover:scale-[1.02] transition-all duration-300 max-w-md">
      <h3 className="font-semibold text-pink-700 mb-2">About</h3>
      <p className="text-sm text-gray-700 leading-relaxed">
        {shelter.about || 'Shelter info coming soon.'}
      </p>
    </div>
  </div>

  {/* Pets */}
  <div className="animate-fade-in-up">
    <h2 className="text-2xl font-bold text-pink-700 mb-5">Available Pets</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map(p => (
        <PetCard key={p._id} pet={p} />
      ))}
      {pets.length === 0 && (
        <div className="col-span-full text-center text-sm text-gray-500 bg-white/70 border border-pink-100 rounded-xl py-6">
          No pets listed yet.
        </div>
      )}
    </div>
  </div>

  {/* Reviews */}
  <div className="animate-fade-in-up">
    <h2 className="text-2xl font-bold text-pink-700 mb-5">Reviews</h2>
    <ReviewList reviews={reviews} />
    {reviews.length === 0 && (
      <div className="mt-3 text-sm text-gray-500 bg-white/70 border border-pink-100 rounded-xl py-4 px-6 text-center">
        No reviews yet. Be the first to share feedback!
      </div>
    )}
  </div>
</div>


  )
}