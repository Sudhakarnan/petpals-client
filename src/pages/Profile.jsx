import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
   <div className="mx-auto max-w-xl px-4 py-10">
  <h1 className="text-3xl font-extrabold mb-8 text-[#0f2f3f] drop-shadow-sm">
    My Profile
  </h1>

  <div className="rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur-sm p-6 space-y-5 shadow-md hover:shadow-lg transition-all">
    <div>
      <div className="text-xs uppercase tracking-wide text-[#5f7d89]">Name</div>
      <div className="font-semibold text-[#0f2f3f]">{user?.name}</div>
    </div>
    <div>
      <div className="text-xs uppercase tracking-wide text-[#5f7d89]">Email</div>
      <div className="font-semibold text-[#0f2f3f]">{user?.email}</div>
    </div>
    <div>
      <div className="text-xs uppercase tracking-wide text-[#5f7d89]">Role</div>
      <div className="inline-flex px-3 py-1 rounded-full border border-cyan-200 bg-gradient-to-r from-sky-50 to-cyan-50 text-[#0369a1] font-medium shadow-sm">
        {user?.role}
      </div>
    </div>
  </div>
</div>

  )
}
