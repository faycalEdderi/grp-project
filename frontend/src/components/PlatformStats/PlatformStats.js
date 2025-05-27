import React, { useEffect, useState } from 'react';
import PlatformStatsChart from './PlatformStatsChart';
import './PlatformStats.css';

export default function PlatformStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/games/analytics/average-sales/')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Erreur chargement stats:', err));
  }, []);

  return (
    <div className="platform-stats">
      <h3>Moyenne des ventes globales par plateforme</h3>

      <table className="stats-table">
        <thead>
          <tr>
            <th>Plateforme</th>
            <th>Nombre de jeux</th>
            <th>Total des ventes (millions)</th>
            <th>Moyenne des ventes (millions)</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item, index) => (
            <tr key={index}>
              <td>{item._id}</td>
              <td>{item.game_count}</td>
              <td>{item.total_sales.toFixed(2)}</td>
              <td>{item.average_sales.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PlatformStatsChart data={stats} />
    </div>
  );
}
