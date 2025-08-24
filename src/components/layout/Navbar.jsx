import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-100/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-extrabold text-lg tracking-tight text-[#0f2f3f] hover:text-cyan-700 transition"
        >
          🐾 PetPals
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl text-sm font-medium transition
               ${isActive
                 ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow'
                 : 'text-slate-700 hover:bg-sky-50'}`
            }
          >
            Adopt
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl text-sm font-medium transition
               ${isActive
                 ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow'
                 : 'text-slate-700 hover:bg-sky-50'}`
            }
          >
            Post
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-medium transition
                   ${isActive
                     ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow'
                     : 'text-slate-700 hover:bg-sky-50'}`
                }
              >
                Favorites
              </NavLink>
              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-medium transition
                   ${isActive
                     ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow'
                     : 'text-slate-700 hover:bg-sky-50'}`
                }
              >
                Applications
              </NavLink>
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-medium transition
                   ${isActive
                     ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow'
                     : 'text-slate-700 hover:bg-sky-50'}`
                }
              >
                Messages
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl border border-cyan-300 text-cyan-800 bg-white/70 backdrop-blur-sm
                           hover:bg-cyan-50 hover:text-cyan-900 shadow-sm transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-xl font-semibold text-white
                           bg-gradient-to-r from-cyan-500 to-sky-500 shadow
                           hover:from-cyan-400 hover:to-sky-400 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-200 bg-white/80 backdrop-blur-sm
                           hover:shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 border border-cyan-200">
                  👤
                </span>
                <span className="text-sm hidden md:inline text-slate-700">
                  {user?.name?.split(' ')[0] || 'Me'}
                </span>
              </button>

              <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md border border-cyan-200/70
                              rounded-xl shadow-lg p-3 hidden group-hover:block">
                <div className="text-sm font-medium text-[#0f2f3f]">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
                <div className="my-2 h-px bg-cyan-100" />

                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-sky-50 transition"
                >
                  My Pets (Post)
                </Link>
                <Link
                  to="/applications"
                  className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-sky-50 transition"
                >
                  Applications
                </Link>
                <Link
                  to="/messages"
                  className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-sky-50 transition"
                >
                  Messages
                </Link>
                <button
                  onClick={async () => { await logout(); nav('/'); }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
