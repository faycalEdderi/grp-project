import React, { useEffect, useState } from "react";
import "./AllGames.css";
import UpdateGame from "../UpdateGame/UpdateGame";
import { Pencil, Trash2 } from "lucide-react";

export default function AllGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 10;

  const [filters, setFilters] = useState({
    Platform: "",
    Genre: "",
    Publisher: "",
    Year_of_Release: "",
  });

  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce jeu ?")) return;
    try {
      await fetch(`http://localhost:8000/api/games/${id}/delete/`, {
        method: "DELETE",
      });
      fetchGames(filters);
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEditClick = (game) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const [distinctValues, setDistinctValues] = useState({
    Platform: [],
    Genre: [],
    Publisher: [],
    Year_of_Release: [],
  });

  useEffect(() => {
    fetchGames(filters);
  }, [filters, currentPage]);

  useEffect(() => {
    const fields = ["Platform", "Genre", "Publisher", "Year_of_Release"];
    Promise.all(
      fields.map((field) =>
        fetch(`http://localhost:8000/api/games/distinct/${field}/`)
          .then((res) => res.json())
          .then((data) => [field, data])
      )
    ).then((results) => {
      const values = {};
      results.forEach(([field, data]) => {
        values[field] = data.filter((v) => v);
      });
      setDistinctValues(values);
    });
  }, []);

  const fetchGames = async (filters) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value) queryParams.append(key, value);
      }
      queryParams.append("page", currentPage);
      queryParams.append("per_page", gamesPerPage);

      const queryString = queryParams.toString();
      const url = queryString
        ? `http://localhost:8000/api/games/filter?${queryString}`
        : "http://localhost:8000/api/games/all/";

      const res = await fetch(url);
      const data = await res.json();
      setGames(data.games || data);
      setTotalPages(data.total_pages || Math.ceil(data.length / gamesPerPage));
    } catch (err) {
      console.error("Erreur lors du chargement des jeux :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="all-games-container">
      <h2>Liste des jeux</h2>

      <div className="filters">
        <h4>Filtres :</h4>
        {["Platform", "Genre", "Publisher", "Year_of_Release"].map((field) => (
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
              Platform: "",
              Genre: "",
              Publisher: "",
              Year_of_Release: "",
            })
          }
        >
          Réinitialiser les filtres
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des jeux...</p>
        </div>
      ) : (
        <>
          <ul className="games-list">
            {games.map((game, index) => (
              <li key={index}>
                <strong>{game.Name}</strong> – {game.Platform} – {game.Genre} –{" "}
                {game.Publisher} – {game.Year_of_Release}
                <span className="action-icons">
                  <Pencil size={18} onClick={() => handleEditClick(game)} />
                  <Trash2
                    size={18}
                    color="red"
                    onClick={() => handleDelete(game._id)}
                  />
                </span>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </>
      )}

      <UpdateGame
        show={showModal}
        onClose={() => setShowModal(false)}
        game={selectedGame}
        onUpdate={() => fetchGames(filters)}
      />
    </div>
  );
}
