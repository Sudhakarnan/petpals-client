export default function MessageThread({ thread, onDeleteForMe }) {
  return (
    <div className="card p-4 space-y-3 h-[60vh] overflow-y-auto bg-gradient-to-b from-white/80 to-cyan-50/40 rounded-2xl border border-cyan-100/70 backdrop-blur-sm">
  {thread.messages.map((m) => (
    <div key={m._id} className={`flex ${m.fromSelf ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm border text-sm
          ${m.fromSelf
            ? "bg-gradient-to-r from-cyan-500/90 to-sky-500/90 text-white border-cyan-400 shadow-md"
            : "bg-white/90 text-slate-800 border border-cyan-100 shadow-sm"} 
          transition`}
      >
        {/* Message text */}
        <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>

        {/* Meta row */}
        <div
          className={`mt-1 flex items-center gap-2 text-[11px] ${
            m.fromSelf ? "text-cyan-100/90" : "text-slate-500"
          }`}
        >
          <time>
            {new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>

          {/* delete-for-me button */}
          <button
            title="Delete for me"
            className={`hover:underline ${
              m.fromSelf ? "hover:text-rose-200" : "hover:text-rose-600"
            }`}
            onClick={() => onDeleteForMe?.(m._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

  )
}
