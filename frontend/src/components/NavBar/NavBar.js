import { Link } from 'react-router-dom';
import './Navbar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-link-block">
        <Link to="/"><span role="img" aria-label="trophy">🏆</span> <br />Top 10</Link>
      </div>
      <div className="navbar-link-block">
        <Link to="/games"><span role="img" aria-label="gamepad">🎮</span> <br />Tous les jeux</Link>
      </div>
      <div className="navbar-link-block">
        <Link to="/create"><span role="img" aria-label="plus">➕</span> <br />Ajouter un jeu</Link>
      </div>
      <div className="navbar-link-block">
        <Link to="/platform-stats"><span role="img" aria-label="chart">📊</span> <br />Statistiques<br />par plateforme</Link>
      </div>
      <div className="navbar-link-block">
        <Link to="/reviews-chart"><span role="img" aria-label="chart">📈</span> <br />Graphique<br />des avis</Link>
      </div>
    </nav>
  );
}

export default NavBar;
