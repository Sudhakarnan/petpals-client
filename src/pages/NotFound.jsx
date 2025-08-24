import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-4 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
  <div className="text-center space-y-6 rounded-2xl border border-cyan-100/70 bg-white/80 backdrop-blur-md p-8 shadow-lg shadow-cyan-100/50">
    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500 drop-shadow-sm">
      404 — Page not found
    </h1>
    <p className="text-slate-600 max-w-md mx-auto">
      The page you’re looking for doesn’t exist or may have been moved.
    </p>
    <Link
      to="/"
      className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white 
        bg-gradient-to-r from-cyan-500 to-sky-500 shadow-md hover:shadow-xl 
        hover:from-cyan-400 hover:to-sky-400 active:scale-[.98] 
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white 
        transition-all duration-300"
    >
      Go Home
    </Link>
  </div>
</div>

  )
}
