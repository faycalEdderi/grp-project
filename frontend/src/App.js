import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Top10Games from './components/Top10Games/Top10Games';
import AllGames from './components/AllGames/AllGames';
import CreateGame from './components/CreateGame/CreateGame';
import PlatformStats from './components/PlatformStats/PlatformStats';
import SteamDashboard from './components/SteamDashboard/SteamDashboard';


function App() {
  return (
    <Router>
    <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Top10Games />} />
          <Route path="/games" element={<AllGames />} />
          <Route path="/create" element={<CreateGame />} />
          <Route path="/platform-stats" element={<PlatformStats />} />
          <Route path="/steam-dashboard" element={<SteamDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
