// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

// Layout
import Navbar from './components/layout/Navbar'

// Public-only pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'

// Protected pages
import Home from './pages/Home'
import Search from './pages/Search'
import Profile from './pages/Profile'
import PetDetails from './pages/PetDetails'
import Favorites from './pages/Favorites'
import Applications from './pages/Applications'
import Messages from './pages/Messages'
import DashboardAdopter from './pages/DashboardAdopter'
import DashboardShelter from './pages/DashboardShelter'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* guest-only routes */}
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
            <Route path="/forgot" element={<GuestOnly><ForgotPassword /></GuestOnly>} />

            {/* everything else requires auth */}
            <Route element={<ProtectedShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pets/:id" element={<PetDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/dashboard" element={<DashboardAdopter />} />
              <Route path="/dashboard/shelter" element={<DashboardShelter />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

/** Wrapper for all protected routes */
function ProtectedShell() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

/** Only allow guests; if logged in, bounce to home */
function GuestOnly({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}
