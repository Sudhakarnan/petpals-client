import { Link } from 'react-router-dom'
export default function Home() {
  return (
    <section className="bg-gradient-to-br from-[#f0faff] via-white to-[#ecf7ff] py-20 relative overflow-hidden">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">

    {/* Left text content */}
    <div className="animate-fade-up space-y-6">
      <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight 
        text-transparent bg-clip-text bg-gradient-to-r from-[#0f2f3f] to-[#1e4a5f]
        drop-shadow-sm">
        Find your new best friend
      </h1>
      <p className="text-lg text-[#37596b] leading-relaxed max-w-lg">
        Browse verified shelters and foster homes. Apply, message, and schedule visits—all in one place.
      </p>
      <div className="flex gap-4 pt-2">
        <Link
          to="/search"
          className="px-6 py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-[#38bdf8] to-[#34d399] 
            shadow-md hover:shadow-xl
            hover:from-[#06b6d4] hover:to-[#10b981]
            transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Find Pets
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 rounded-xl font-semibold 
            border border-[#38bdf8] text-[#0284c7]
            bg-white/80 backdrop-blur-sm
            hover:bg-[#e0f7ff]/80 hover:text-[#0369a1]
            shadow-sm hover:shadow-md
            transition-all duration-300"
        >
          Get Started
        </Link>
      </div>
    </div>

    {/* Image grid */}
    <div className="grid grid-cols-2 gap-4 animate-fade-up">
      {['dog-1.jpg', 'dog-2.jpg', 'cat-1.jpg', 'cat-2.jpg'].map(img => (
        <div
          key={img}
          className="relative overflow-hidden rounded-2xl border border-[#cce5ed]/70 shadow-md
            transition-all duration-500 group"
        >
          <img
            className="object-cover aspect-[4/3] w-full h-full rounded-2xl 
              transform transition-transform duration-500 
              group-hover:scale-[1.05] group-hover:brightness-105"
            src={`/pets/${img}`}
            alt="Happy pet"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      ))}
    </div>
  </div>
</section>



  )
}