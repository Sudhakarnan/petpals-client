// StatusBadge.jsx
const STATUS_UI = {
  pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',   ring: 'ring-amber-200',   label: 'Pending' },
  reviewing: { bg: 'bg-sky-50',     text: 'text-sky-700',     ring: 'ring-sky-200',     label: 'Reviewing' },
  approved:  { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', label: 'Approved' },
  rejected:  { bg: 'bg-rose-50',    text: 'text-rose-700',    ring: 'ring-rose-200',    label: 'Rejected' },
}

export default function StatusBadge({ status = 'pending', className = '' }) {
  const s = STATUS_UI[status] || STATUS_UI.pending
  return (
    <span
  className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full
              border border-transparent ring-1 shadow-sm
              transition-colors duration-200
              ${s.bg} ${s.text} ${s.ring} ${className}`}
>
  {s.label}
</span>

  )
}
