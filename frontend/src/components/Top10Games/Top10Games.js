import React, { useEffect, useState } from 'react';
import './Top10GamesStyle.css';

function Top10Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/games/top10/')
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="top10games-container">
      <h2>Top 10 des jeux les plus vendus</h2>
      <ul className="top10games-list">
        {games.map((game, index) => (
          <li key={index}>
            {game.Name} — {game.Global_Sales} millions vendus
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Top10Games;
