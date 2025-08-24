export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div
  className="fixed inset-0 z-50 flex items-center justify-center p-4
             bg-black/40 backdrop-blur-sm
             animate-[fade-in_.18s_ease-out]"
  onClick={onClose}
>
  <div
    className="w-full max-w-lg overflow-hidden rounded-2xl
               border border-cyan-200/70 bg-white/90 backdrop-blur-md shadow-2xl
               animate-[scale-in_.18s_ease-out]"
    onClick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    aria-label={title}
  >
    {/* Header */}
    <div className="p-4 border-b border-cyan-200/70 bg-gradient-to-r from-sky-50 to-cyan-50 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-[#0f2f3f]">{title}</h3>
      <button
        className="rounded-xl px-3 py-1.5 font-medium
                   border border-cyan-300 text-cyan-700 bg-white/70 backdrop-blur-sm
                   hover:bg-cyan-50 hover:text-cyan-800 hover:shadow-sm
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                   transition"
        onClick={onClose}
      >
        Close
      </button>
    </div>

    {/* Body */}
    <div className="p-4 text-slate-800">{children}</div>
  </div>
</div>


  )
}