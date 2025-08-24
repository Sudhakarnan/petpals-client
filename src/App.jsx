import ForgotPassword from './pages/ForgotPassword'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import { useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
// Pages
import Home from './pages/Home'
import PetDetails from './pages/PetDetails'
import Favorites from './pages/Favorites'
import Applications from './pages/Applications'
import Messages from './pages/Messages'
import DashboardAdopter from './pages/DashboardAdopter'
import DashboardShelter from './pages/DashboardShelter'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'          // NEW
import Profile from './pages/Profile'        // NEW
import NotFound from './pages/NotFound'      // NEW (optional)

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* public-only routes */}
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
            <Route path="/forgot" element={<GuestOnly><ForgotPassword /></GuestOnly>} />


            {/* everything else requires auth */}
            <Route element={<ProtectedShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />          {/* NEW */}
              <Route path="/profile" element={<Profile />} />        {/* NEW */}
              <Route path="/pets/:id" element={<PetDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/applications" element={<Applications />} />
              <Route
                path="/messages"
                element={
                  <RequireAuth>
                    <Messages />
                  </RequireAuth>
                }
              />
              <Route path="/dashboard" element={<DashboardAdopter />} />
              <Route path="/dashboard/shelter" element={<DashboardShelter />} />
              <Route path="*" element={<NotFound />} />              {/* fallback */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

import { Outlet } from 'react-router-dom'
function ProtectedShell() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function GuestOnly({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}
