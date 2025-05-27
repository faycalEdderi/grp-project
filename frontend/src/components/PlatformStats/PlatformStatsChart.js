import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function PlatformStatsChart() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/games/analytics/average-sales/')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Erreur chargement stats:', err));
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Moyenne des ventes globales par plateforme
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" label={{ value: 'Plateforme', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Moyenne des ventes (millions)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="average_sales" fill="#8884d8" name="Moyenne des ventes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
