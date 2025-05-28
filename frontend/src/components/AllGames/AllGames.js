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

  const [distinctValues, setDistinctValues] = useState({
    Platform: [],
    Genre: [],
    Publisher: [],
    Year_of_Release: [],
  });

  const fetchGames = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value) queryParams.append(key, value);
      }
      queryParams.append("page", currentPage);
      queryParams.append("per_page", gamesPerPage);

      const res = await fetch(
        `http://localhost:8000/api/games/paginated/?${queryParams}`
      );
      const data = await res.json();

      if (Array.isArray(data.games)) {
        setGames(data.games);
        setTotalPages(data.total_pages || 1);
      } else {
        setGames([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des jeux :", err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce jeu ?")) return;
    try {
      await fetch(`http://localhost:8000/api/games/${id}/delete/`, {
        method: "DELETE",
      });
      fetchGames();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEditClick = (game) => {
    setSelectedGame(game);
    setShowModal(true);
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

  useEffect(() => {
    fetchGames();
  }, [filters, currentPage]);

  useEffect(() => {
    const fields = ["Platform", "Genre", "Publisher", "Year_of_Release"];
    Promise.all(
      fields.map((field) =>
        fetch(`http://localhost:8000/api/games/distinct/${field}/`)
          .then((res) => res.json())
          .then((data) => [
            field,
            Array.isArray(data) ? data.filter(Boolean) : [],
          ])
      )
    )
      .then((results) => {
        const values = {};
        results.forEach(([field, data]) => {
          values[field] = data;
        });
        setDistinctValues(values);
      })
      .catch((err) => {
        console.error("Erreur chargement filtres :", err);
      });
  }, []);

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
              {Array.isArray(distinctValues[field]) &&
                distinctValues[field].map((option, idx) => (
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
          {games.length === 0 ? (
            <p>Aucun jeu trouvé.</p>
          ) : (
            <ul className="games-list">
              {games.map((game, index) => (
                <li key={index}>
                  <strong>{game.Name}</strong> – {game.Platform} – {game.Genre}{" "}
                  – {game.Publisher} – {game.Year_of_Release}
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
          )}

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

          <div className="pagination">
            <label htmlFor="page-select">Page : </label>
            <select
              id="page-select"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <UpdateGame
        show={showModal}
        onClose={() => setShowModal(false)}
        game={selectedGame}
        onUpdate={() => fetchGames()}
      />
    </div>
  );
}
