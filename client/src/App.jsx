import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import LobbyPage       from './pages/LobbyPage'
import GamePage        from './pages/GamePage'
import LeaderboardPage from './pages/LeaderboardPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Navigate to="/login" replace />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
        <Route path="/lobby"       element={<ProtectedRoute><LobbyPage /></ProtectedRoute>} />
        <Route path="/game"        element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
