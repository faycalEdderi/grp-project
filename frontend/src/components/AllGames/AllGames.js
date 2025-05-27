import React, { useEffect, useState } from 'react';
import './AllGames.css';

export default function AllGames() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState('all');
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [years, setYears] = useState([]);

  const fetchGames = async (endpoint = 'http://localhost:8000/api/games/all/') => {
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setGames(data);
      extractFilters(data);
    } catch (err) {
      console.error('Erreur lors du chargement des jeux :', err);
    }
  };

  const extractFilters = (data) => {
    setPlatforms([...new Set(data.map(g => g.Platform).filter(Boolean))].sort());
    setGenres([...new Set(data.map(g => g.Genre).filter(Boolean))].sort());
    setPublishers([...new Set(data.map(g => g.Publisher).filter(Boolean))].sort());
    setYears([...new Set(data.map(g => g.Year_of_Release).filter(Boolean))].sort((a, b) => a - b));
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const applyFilter = (type, value) => {
    if (!value) {
      setFilter('all');
      fetchGames();
    } else {
      setFilter(`${type}: ${value}`);
      fetchGames(`http://localhost:8000/api/games/filter/${type}/${value}/`);
    }
  };

  return (
    <div className="all-games-container">
      <h2>Liste des jeux</h2>

      <div className="filters">
        <h4>Filtres :</h4>
        <button onClick={() => { fetchGames(); setFilter('all'); }}>Tous</button>

        <div>
          <label>Plateforme : </label>
          <select onChange={(e) => applyFilter('Platform', e.target.value)}>
            <option value="">--</option>
            {platforms.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Genre : </label>
          <select onChange={(e) => applyFilter('Genre', e.target.value)}>
            <option value="">--</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Éditeur : </label>
          <select onChange={(e) => applyFilter('Publisher', e.target.value)}>
            <option value="">--</option>
            {publishers.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Année : </label>
          <select onChange={(e) => applyFilter('Year_of_Release', e.target.value)}>
            <option value="">--</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
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
