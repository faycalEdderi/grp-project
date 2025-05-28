import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import "./SteamDashboard.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57"];

export default function SteamDashboard() {
  const [topGames, setTopGames] = useState([]);
  const [gamesPerYear, setGamesPerYear] = useState([]);
  const [avgScoreByGenre, setAvgScoreByGenre] = useState([]);
  const [countByRating, setCountByRating] = useState([]);
  const [topDevs, setTopDevs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/games/top10/")
      .then(res => res.json())
      .then(setTopGames);

    fetch("http://localhost:8000/api/games/steam/count-games-per-year/")
      .then(res => res.json())
      .then(setGamesPerYear);

    fetch("http://localhost:8000/api/games/steam/average-critic-score-by-genre/")
      .then(res => res.json())
      .then(setAvgScoreByGenre);

    fetch("http://localhost:8000/api/games/steam/count-games-by-rating/")
      .then(res => res.json())
      .then(setCountByRating);

    fetch("http://localhost:8000/api/games/steam/top10-developers/")
      .then(res => res.json())
      .then(setTopDevs);
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard des Statistiques</h2>

      <div className="chart-card">
        <h3>Top 10 Jeux par Ventes Globales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topGames}>
            <XAxis dataKey="Name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Global_Sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Jeux publiés par Année</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={gamesPerYear}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Note moyenne par Genre</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avgScoreByGenre}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avg_score" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Nombre de Jeux par Classification</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={countByRating}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {countByRating.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

   <div className="chart-card">
        <h3>Top 10 Développeurs par Nombre de Jeux</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topDevs}>
            <XAxis dataKey="_id" interval={0} tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#a4de6c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
   
