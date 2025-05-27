import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Top10Games from './components/Top10Games/Top10Games';
import AllGames from './components/AllGames/AllGames';
import CreateGame from './components/CreateGame/CreateGame';


function App() {
  return (
    <Router>
    <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Top10Games />} />
          <Route path="/games" element={<AllGames />} />
          <Route path="/create" element={<CreateGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
