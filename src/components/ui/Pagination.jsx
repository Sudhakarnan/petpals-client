export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1)
  return (
    <div className="flex gap-2">
  {pages.map((p) => (
    <button
      key={p}
      onClick={() => onChange(p)}
      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200
        ${
          p === page
            ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white border-cyan-400 shadow-md hover:shadow-lg"
            : "border-cyan-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700"
        }
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
      aria-current={p === page ? "page" : undefined}
    >
      {p}
    </button>
  ))}
</div>


  )
}