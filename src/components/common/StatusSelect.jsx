// StatusSelect.jsx
const STATUS_UI = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    ring: "focus:ring-amber-200",
  },
  reviewing: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    ring: "focus:ring-sky-200",
  },
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    ring: "focus:ring-emerald-200",
  },
  rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    ring: "focus:ring-rose-200",
  },
}

export default function StatusSelect({ value = "pending", onChange, disabled }) {
  const ui = STATUS_UI[value] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    ring: "focus:ring-gray-200",
  }

  return (
    <select
      disabled={disabled}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`rounded-xl px-3 py-2 text-sm font-medium
        ${ui.bg} ${ui.text} ${ui.border}
        shadow-inner hover:shadow focus:outline-none focus:ring-4 ${ui.ring}
        transition`}
    >
      {["pending", "reviewing", "approved", "rejected"].map((s) => (
        <option key={s} value={s} className="text-slate-700">
          {s[0].toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  )
}
