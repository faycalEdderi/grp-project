import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AllGames from './components/AllGames/AllGames';
import CreateGame from './components/CreateGame/CreateGame';
import NavBar from './components/NavBar/NavBar';
import PlatformStats from './components/PlatformStats/PlatformStats';
import ReviewsChart from './components/ReviewsChart/ReviewsChart';
import Top10Games from './components/Top10Games/Top10Games';

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
          <Route path="/reviews-chart" element={<ReviewsChart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
