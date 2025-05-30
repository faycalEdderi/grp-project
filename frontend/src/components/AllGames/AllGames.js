import React, { useEffect, useState, useRef } from "react";
import "./AllGames.css";
import UpdateGame from "../UpdateGame/UpdateGame";

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

  const [successMsg, setSuccessMsg] = useState("");
  const [successType, setSuccessType] = useState("");

  const audioSuccessRef = useRef(null);
  const audioDeleteRef = useRef(null);

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
      setSuccessMsg("Jeu supprimé avec succès !");
      setSuccessType("delete");
      if (audioDeleteRef.current) {
        audioDeleteRef.current.currentTime = 0;
        audioDeleteRef.current.play();
      }
      setTimeout(() => setSuccessMsg(""), 4000);
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

  const handleUpdate = () => {
    fetchGames();
    setSuccessMsg("Jeu modifié avec succès !");
    setSuccessType("edit");
    if (audioSuccessRef.current) {
      audioSuccessRef.current.currentTime = 0;
      audioSuccessRef.current.play();
      setTimeout(() => {
        if (audioSuccessRef.current) {
          audioSuccessRef.current.pause();
          audioSuccessRef.current.currentTime = 0;
        }
      }, 3000);
    }
    setTimeout(() => setSuccessMsg(""), 4000);
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

      <audio ref={audioSuccessRef} src="/edit.mp3" preload="auto" />
      <audio ref={audioDeleteRef} src="/delete.mp3" preload="auto" />

      {successMsg && (
        <div className="success-message-mario">
          <img
            src="https://images.unsplash.com/photo-1682163372075-40d26b02f8c9?q=80&w=2349&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Mario saute !"
            className="mario-jump-img mario-jump-img-large"
          />
          <span>{successMsg}</span>
        </div>
      )}

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
                  <span className="game-info">
                    <strong>{game.Name}</strong> – {game.Platform} – {game.Genre} – {game.Publisher} – {game.Year_of_Release}
                  </span>
                  <span className="action-icons">
                    <button
                      className="pixel-btn-mario green responsive-btn"
                      onClick={() => handleEditClick(game)}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="pixel-btn-mario red responsive-btn"
                      onClick={() => handleDelete(game._id)}
                    >
                      🗑️ Supprimer
                    </button>
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
        onUpdate={handleUpdate}
      />
    </div>
  );
}
