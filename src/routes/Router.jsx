import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Search from '../pages/Search'
import PetDetails from '../pages/PetDetails'
import ShelterProfile from '../pages/ShelterProfile'
import Login from '../pages/Login'
import Register from '../pages/Register'
import DashboardAdopter from '../pages/DashboardAdopter'
import DashboardShelter from '../pages/DashboardShelter'
import Applications from '../pages/Applications'
import Messages from '../pages/Messages'
import Favorites from '../pages/Favorites'
import ProtectedRoute from './ProtectedRoute'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/pets/:id" element={<PetDetails />} />
      <Route path="/shelters/:id" element={<ShelterProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard/adopter"
        element={<ProtectedRoute role="adopter"><DashboardAdopter /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/shelter"
        element={<ProtectedRoute role="shelter"><DashboardShelter /></ProtectedRoute>}
      />
      <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
    </Routes>
  )
}