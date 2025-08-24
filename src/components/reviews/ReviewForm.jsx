import { useState } from 'react'

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  return (
    <form
  className="space-y-5 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-cyan-200/70 shadow-md hover:shadow-lg transition"
  onSubmit={(e) => {
    e.preventDefault();
    onSubmit?.({ rating, comment });
    setComment("");
    setRating(5);
  }}
>
  {/* Rating */}
  <label className="block">
    <span className="text-sm font-semibold text-[#0f2f3f]">Rating</span>
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setRating(n)}
          className={`p-1 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2
            ${
              n <= rating
                ? "text-yellow-400 drop-shadow-sm"
                : "text-gray-300 hover:text-yellow-200"
            }`}
        >
          ★
        </button>
      ))}
    </div>
  </label>

  {/* Comment */}
  <label className="block">
    <span className="text-sm font-semibold text-[#0f2f3f]">Comment</span>
    <textarea
      className="w-full rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-slate-800 placeholder-slate-500 shadow-inner 
      focus:border-transparent focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
      rows={3}
      placeholder="Write your review..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
  </label>

  {/* Submit */}
  <button
    className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold text-white 
      bg-gradient-to-r from-cyan-500 to-sky-500 shadow-md hover:shadow-lg
      hover:from-cyan-400 hover:to-sky-400 active:scale-[.98] 
      focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white
      transition disabled:opacity-60"
  >
    Submit Review
  </button>
</form>


  )
}