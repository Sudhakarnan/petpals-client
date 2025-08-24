import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { mediaUrl, petsApi, applicationsApi, reviewsApi, messagesApi } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'
import ReviewList from '../components/reviews/ReviewList'
import ReviewForm from '../components/reviews/ReviewForm'
import ApplicationForm from '../components/applications/ApplicationForm'
import Modal from '../components/ui/Modal'
import { useToast } from '../context/ToastContext'

export default function PetDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const { push } = useToast()
  const { user } = useAuth()

  const [pet, setPet] = useState(null)
  const [reviews, setReviews] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const ownerId = pet?.shelter?._id || (typeof pet?.shelter === 'string' ? pet.shelter : null)
  const isOwner = user?.id && ownerId && String(user.id) === String(ownerId)

  useEffect(() => {
    let alive = true
      ; (async () => {
        setLoading(true)
        setError('')
        try {
          const [{ data: petRes }, { data: revRes }] = await Promise.all([
            petsApi.get(id),
            reviewsApi.list('pet', id)
          ])
          if (!alive) return
          setPet(petRes)
          setReviews(revRes.items || [])
        } catch (err) {
          const msg = err?.response?.data?.message || 'Failed to load pet'
          setError(msg)
          push(msg, 'error')
        } finally {
          if (alive) setLoading(false)
        }
      })()
    return () => { alive = false }
  }, [id])

  const submitApp = async (payload) => {
    try {
      await applicationsApi.create(payload) // ApplicationForm passes { petId, ... }
      setOpen(false)
      push('Application submitted!')
    } catch (err) {
      push(err?.response?.data?.message || 'Please login to apply', 'error')
    }
  }

  const submitReview = async ({ rating, comment }) => {
    try {
      const { data } = await reviewsApi.create({ targetType: 'pet', targetId: id, rating, comment })
      setReviews(prev => [data, ...(prev || [])])
      push('Review submitted')
    } catch (err) {
      push(err?.response?.data?.message || 'Login to review', 'error')
    }
  }

  const messageOwner = async () => {
    if (!pet) return
    try {
      const { data } = await messagesApi.start({ toUserId: ownerId, petId: pet._id })
      nav('/messages?thread=' + data._id)
    } catch {
      nav('/messages')
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-10 w-10 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
        {/* Text */}
        <p className="text-cyan-700 font-medium animate-pulse">Loading…</p>
      </div>
    </div>

  }
  if (error || !pet) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl p-6 text-rose-700 
    bg-gradient-to-br from-rose-50 via-white to-rose-50
    border border-rose-200/80 shadow-md shadow-rose-100
    backdrop-blur-sm">
          {error || 'Pet not found'}
        </div>
        <Link
          to="/search"
          className="inline-flex items-center justify-center mt-4 px-5 py-2.5 rounded-xl font-medium
      border border-cyan-400 text-cyan-700
      bg-white/80 backdrop-blur-sm
      hover:bg-cyan-50 hover:text-cyan-800
      shadow-sm hover:shadow-md
      transition-all duration-300"
        >
          Back to Search
        </Link>
      </div>

    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 
  bg-gradient-to-b from-[#f0faff] via-white to-[#ecf7ff] 
  rounded-3xl shadow-xl border border-[#d8ecf2]/70 backdrop-blur-md">

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pet Images */}
        <div className="space-y-4">
          <img
            src={mediaUrl(pet.photos?.[0]) || 'https://placehold.co/600x400?text=Pet'}
            alt={pet.name}
            className="h-56 w-full object-cover rounded-2xl border border-[#cce5ed]/70 shadow-md hover:shadow-xl hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
          <div className="grid grid-cols-4 gap-3">
            {(pet.photos || []).slice(1, 5).map((p, i) => (
              <img
                key={i}
                src={mediaUrl(p)}
                alt={`${pet.name} ${i + 2}`}
                className="rounded-xl object-cover aspect-square border border-[#cce5ed]/70 shadow-sm hover:shadow-lg hover:scale-[1.03] transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>

        {/* Pet Details */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0f2f3f] drop-shadow-sm">{pet.name}</h1>
          <p className="text-[#5f7d89] font-medium">{pet.breed} • {pet.age} • {pet.size}</p>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-white/90 to-[#f0faff]/80 p-4 rounded-xl shadow-sm border border-[#cce5ed]/70 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-[#5f7d89]">Color</p>
              <p className="font-semibold text-[#0f2f3f]">{pet.color || '—'}</p>
            </div>
            <div className="bg-gradient-to-br from-white/90 to-[#f0faff]/80 p-4 rounded-xl shadow-sm border border-[#cce5ed]/70 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-[#5f7d89]">Medical</p>
              <p className="font-semibold text-[#0f2f3f]">{pet.medicalHistory || '—'}</p>
            </div>
            <div className="bg-gradient-to-br from-white/90 to-[#f0faff]/80 p-4 rounded-xl shadow-sm border border-[#cce5ed]/70 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-[#5f7d89]">Location</p>
              <p className="font-semibold text-[#0f2f3f]">{pet.location || '—'}</p>
            </div>
            <div className="bg-gradient-to-br from-white/90 to-[#f0faff]/80 p-4 rounded-xl shadow-sm border border-[#cce5ed]/70 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-[#5f7d89]">Owner</p>
              <p className="font-semibold text-[#0f2f3f]">{pet.shelter?.name || '—'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* Apply button */}
            {user && !isOwner ? (
              <button
                onClick={() => setOpen(true)}
                className="px-5 py-2.5 rounded-xl font-semibold text-white 
              bg-gradient-to-r from-[#38bdf8] to-[#34d399]
              hover:from-[#0ea5e9] hover:to-[#10b981]
              shadow-md hover:shadow-xl 
              transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0
              focus:outline-none focus:ring-4 focus:ring-[#bae6fd]"
              >
                Apply to Adopt
              </button>
            ) : isOwner ? (
              <span className="px-4 py-2 rounded-xl bg-[#f0faff] text-[#5f7d89] text-sm border border-[#cce5ed]/70">
                You own this pet
              </span>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl font-semibold 
              border border-[#38bdf8] text-[#0284c7]
              bg-white/80 backdrop-blur-sm
              hover:bg-[#e0f7ff] hover:text-[#0369a1]
              shadow-sm hover:shadow-md transition"
              >
                Log in to apply
              </Link>
            )}

            {/* Email contact */}
            {pet.shelter?.email && (
              <a
                href={`mailto:${pet.shelter.email}?subject=Inquiry about ${encodeURIComponent(pet.name)}`}
                className="px-5 py-2.5 rounded-xl font-semibold 
              border border-[#38bdf8] text-[#0284c7]
              bg-white/80 backdrop-blur-sm
              hover:bg-[#e0f7ff] hover:text-[#0369a1]
              shadow-sm hover:shadow-md transition"
              >
                Contact Owner
              </a>
            )}

            {/* Message owner */}
            {user && !isOwner && (
              <button
                className="px-5 py-2.5 rounded-xl font-semibold text-[#0284c7] 
              border border-[#38bdf8] bg-white/80 backdrop-blur-sm
              hover:bg-[#e0f7ff] hover:text-[#0369a1]
              shadow-sm hover:shadow-md transition"
                onClick={messageOwner}
              >
                Message Owner
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews and About */}
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold mb-3 text-[#0f2f3f]">Reviews</h2>
          <ReviewForm onSubmit={submitReview} />
          <div className="mt-4">
            <ReviewList reviews={reviews} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-3 text-[#0f2f3f]">About {pet.name}</h2>
          <p className="text-[#37596b] leading-relaxed">
            {pet.description || 'This pet is looking for a loving home.'}
          </p>
        </div>
      </div>

      {/* Adoption Form Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={`Apply to adopt ${pet.name}`}>
        <ApplicationForm petId={id} onSubmit={submitApp} />
      </Modal>
    </div>

  )
}
