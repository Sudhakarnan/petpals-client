import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const nav = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const btnRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return
      const el = menuRef.current
      const btn = btnRef.current
      if (el && !el.contains(e.target) && btn && !btn.contains(e.target)) {
        setOpen(false)
      }
    }
    function onEsc(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  // Close when navigating
  useEffect(() => { setOpen(false) }, [location.pathname])

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
            <div className="relative">
              <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-haspopup="menu"
                aria-expanded={open ? 'true' : 'false'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-200 bg-white/80 backdrop-blur-sm
                           hover:shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 border border-cyan-200">
                  👤
                </span>
                <span className="text-sm hidden md:inline text-slate-700">
                  {user?.name?.split(' ')[0] || 'Me'}
                </span>
                <svg className={`h-4 w-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <div
                  ref={menuRef}
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md border border-cyan-200/70
                             rounded-xl shadow-lg p-3"
                >
                  <div className="text-sm font-medium text-[#0f2f3f]">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                  <div className="my-2 h-px bg-cyan-100" />

                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-sky-50 transition"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    My Pets (Post)
                  </Link>
                  <Link
                    to="/applications"
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-sky-50 transition"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Applications
                  </Link>
                  <Link
                    to="/messages"
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-sky-50 transition"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Messages
                  </Link>
                  <button
                    onClick={async () => { await logout(); setOpen(false); nav('/'); }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 transition"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
