export default function Footer() {
  return (
    <footer className="mt-12 relative overflow-hidden border-t border-cyan-100/30">
  {/* soft top glow */}
  <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-[120%] -translate-x-1/2 
                  rounded-full bg-gradient-to-r from-cyan-400/20 via-sky-300/20 to-teal-300/20 blur-3xl" />

  <div className="bg-gradient-to-r from-[#f0faff] via-white to-[#ecf7ff]">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 
                    text-sm text-slate-600 flex flex-col sm:flex-row items-center 
                    justify-between gap-4">
      
      {/* Left text */}
      <p className="font-medium tracking-tight text-slate-700">
        © {new Date().getFullYear()}{" "}
        <span className="text-cyan-700 font-semibold">PetPals</span>. All rights reserved.
      </p>

      {/* Right text */}
      <p className="text-slate-500 italic flex items-center gap-2">
        Built with <span className="font-semibold text-cyan-700"></span>
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400/90 
                         shadow-[0_0_10px_2px_rgba(16,185,129,0.5)]" />
      </p>
    </div>
  </div>
</footer>



  )
}