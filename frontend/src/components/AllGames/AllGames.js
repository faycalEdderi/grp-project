import React, { useEffect, useState } from 'react';
import './AllGames.css';

function AllGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/games/all')
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des jeux :', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="all-games">
      <h2>🎮 Liste de tous les jeux</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Plateforme</th>
            <th>Ventes Globales</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game._id}>
              <td>{game.Name}</td>
              <td>{game.Platform}</td>
              <td>{game.Global_Sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllGames;
