import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './pages/Hero'
import Players from './pages/Players'
import PlayerProfile from './pages/PlayerProfile'
import Compare from './pages/Compare'
import DreamTeam from './pages/DreamTeam'
import Leaderboard from './pages/Leaderboard'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/players" element={<Players />} />
        <Route path="/player/:name" element={<PlayerProfile />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/dream-team" element={<DreamTeam />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}
