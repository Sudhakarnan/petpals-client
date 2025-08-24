import Stars from '../ui/Stars'

export default function ReviewList({ reviews = [] }) {
  if (!reviews.length) return <p className="text-sm text-gray-500">No reviews yet.</p>
  return (
    <ul className="space-y-5">
  {reviews.map((r) => (
    <li
      key={r._id}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-cyan-200/70 
                 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 
                 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[#0f2f3f]">{r.author?.name || "User"}</p>
        <Stars value={r.rating} />
      </div>

      {/* Comment */}
      <p className="text-sm text-slate-700 mt-3 leading-relaxed">
        {r.comment}
      </p>

      {/* Date */}
      <p className="text-xs text-slate-500 mt-3">
        {new Date(r.createdAt).toLocaleDateString()}
      </p>
    </li>
  ))}

  {reviews.length === 0 && (
    <li className="text-center text-sm text-slate-500 bg-white/60 backdrop-blur-sm 
                   border border-cyan-100 rounded-xl py-6">
      No reviews yet. Be the first to share feedback!
    </li>
  )}
</ul>


  )
}