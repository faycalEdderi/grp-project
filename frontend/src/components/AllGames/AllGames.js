import React, { useEffect, useState } from 'react';
import './AllGames.css';

export default function AllGames() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({
    Platform: '',
    Genre: '',
    Publisher: '',
    Year_of_Release: '',
  });

  const fetchGames = async (filters) => {
    try {
      // Construire la query string à partir de l'objet filters (filtre non vide uniquement)
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value) queryParams.append(key, value);
      }
      const queryString = queryParams.toString();
      const url = queryString
        ? `http://localhost:8000/api/games/filter?${queryString}`
        : 'http://localhost:8000/api/games/all/';

      const res = await fetch(url);
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error('Erreur lors du chargement des jeux :', err);
    }
  };

  useEffect(() => {
    fetchGames(filters);
  }, [filters]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <div className="all-games-container">
      <h2>Liste des jeux</h2>

      <div className="filters">
        <h4>Filtres :</h4>

        <label>Plateforme : </label>
        <select
          value={filters.Platform}
          onChange={(e) => handleFilterChange('Platform', e.target.value)}
        >
          <option value="">--</option>
          {/* Remplace par ta liste dynamique ou statique */}
          <option value="PS4">PS4</option>
          <option value="Wii">Wii</option>
          <option value="DS">DS</option>
        </select>

        <label>Genre : </label>
        <select
          value={filters.Genre}
          onChange={(e) => handleFilterChange('Genre', e.target.value)}
        >
          <option value="">--</option>
          <option value="Sports">Sports</option>
          <option value="Platform">Platform</option>
          <option value="Racing">Racing</option>
        </select>

        <label>Éditeur : </label>
        <select
          value={filters.Publisher}
          onChange={(e) => handleFilterChange('Publisher', e.target.value)}
        >
          <option value="">--</option>
          <option value="Nintendo">Nintendo</option>
          <option value="EA">EA</option>
        </select>

        <label>Année : </label>
        <select
          value={filters.Year_of_Release}
          onChange={(e) => handleFilterChange('Year_of_Release', e.target.value)}
        >
          <option value="">--</option>
          <option value="2006">2006</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
        </select>

        <button onClick={() => setFilters({
          Platform: '',
          Genre: '',
          Publisher: '',
          Year_of_Release: '',
        })}>
          Réinitialiser les filtres
        </button>
      </div>

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
