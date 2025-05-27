import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">🏆 Top 10</Link>
      <Link to="/games">🎮 Tous les jeux</Link>
      <Link to="/create">➕ Ajouter un jeu</Link>
    </nav>
  );
}

export default NavBar;
