import React, { useEffect, useState } from 'react';
import './AllGames.css';

export default function AllGames() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchGames = async (endpoint = 'http://localhost:8000/api/all/') => {
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error('Erreur lors du chargement des jeux :', err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const applyFilter = (type, value) => {
    setFilter(`${type}: ${value}`);
    fetchGames(`http://localhost:8000/api/games/filter/${type}/${value}/`);
  };

  return (
    <div className="all-games-container">
      <h2>Liste des jeux</h2>

      <div className="filters">
        <h4>Filtres :</h4>
        <button onClick={() => fetchGames()}>Tous</button>
        <button onClick={() => applyFilter('platform', 'PS4')}>PS4</button>
        <button onClick={() => applyFilter('Genre', 'Sports')}>Sport</button>
        <button onClick={() => applyFilter('publisher', 'Nintendo')}>Nintendo</button>
        <button onClick={() => applyFilter('year', '2010')}>Année 2010</button>
      </div>

      <p><strong>Filtre appliqué :</strong> {filter}</p>

      <ul className="games-list">
        {games.map((game, index) => (
          <li key={index}>
            <strong>{game.Name}</strong> – {game.Platform} – {game.Genre} – {game.Publisher} – {game.Year_of_Release}
          </li>
        ))}
      </ul>
    </div>
  );
}
