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

  const [distinctValues, setDistinctValues] = useState({
    Platform: [],
    Genre: [],
    Publisher: [],
    Year_of_Release: [],
  });

  useEffect(() => {
    fetchGames(filters);
  }, [filters]);

  useEffect(() => {
    const fields = ['Platform', 'Genre', 'Publisher', 'Year_of_Release'];
    Promise.all(
      fields.map((field) =>
        fetch(`http://localhost:8000/api/games/distinct/${field}/`)
          .then((res) => res.json())
          .then((data) => [field, data])
      )
    ).then((results) => {
      const values = {};
      results.forEach(([field, data]) => {
        values[field] = data.filter((v) => v); // enlève les null/undefined
      });
      setDistinctValues(values);
    });
  }, []);

  const fetchGames = async (filters) => {
    try {
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

        {['Platform', 'Genre', 'Publisher', 'Year_of_Release'].map((field) => (
          <div key={field}>
            <label>{field} : </label>
            <select
              value={filters[field]}
              onChange={(e) => handleFilterChange(field, e.target.value)}
            >
              <option value="">--</option>
              {distinctValues[field].map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          onClick={() =>
            setFilters({
              Platform: '',
              Genre: '',
              Publisher: '',
              Year_of_Release: '',
            })
          }
        >
          Réinitialiser les filtres
        </button>
      </div>

      <ul className="games-list">
        {games.map((game, index) => (
          <li key={index}>
            <strong>{game.Name}</strong> – {game.Platform} – {game.Genre} –{' '}
            {game.Publisher} – {game.Year_of_Release}
          </li>
        ))}
      </ul>
    </div>
  );
}
