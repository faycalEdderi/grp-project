import React, { useState } from 'react';
import './CreateGame.css';

const MARIO_RUN_URL = "https://images.unsplash.com/photo-1682163372075-40d26b02f8c9?q=80&w=2349&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function CreateGameComponent() {
  const [formData, setFormData] = useState({
    Name: '',
    Platform: '',
    Year_of_Release: '',
    Genre: '',
    Publisher: '',
    Global_Sales: '',
  });

  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      Global_Sales: parseFloat(formData.Global_Sales) || 0,
      Year_of_Release: parseInt(formData.Year_of_Release) || null,
    };

    try {
      const response = await fetch('http://localhost:8000/api/games/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const json = await response.json();
        setMessage(`Jeu créé avec ID : ${json.inserted_id}`);
        setShowSuccess(true);
        setFormData({
          Name: '',
          Platform: '',
          Year_of_Release: '',
          Genre: '',
          Publisher: '',
          Global_Sales: '',
        });
        setTimeout(() => setShowSuccess(false), 3500);
      } else {
        const err = await response.json();
        setMessage(`Erreur: ${err.error || 'Impossible de créer le jeu'}`);
        setShowSuccess(false);
      }
    } catch (error) {
      setMessage(`Erreur réseau: ${error.message}`);
      setShowSuccess(false);
    }
  };

  return (
    <div className="create-game-container">
      <h2>Créer un nouveau jeu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Name"
          placeholder="Nom du jeu"
          value={formData.Name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Platform"
          placeholder="Plateforme"
          value={formData.Platform}
          onChange={handleChange}
        />
        <input
          type="number"
          name="Year_of_Release"
          placeholder="Année de sortie"
          value={formData.Year_of_Release}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Genre"
          placeholder="Genre"
          value={formData.Genre}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Publisher"
          placeholder="Éditeur"
          value={formData.Publisher}
          onChange={handleChange}
        />
        <input
          type="number"
          step="0.01"
          name="Global_Sales"
          placeholder="Ventes globales (millions)"
          value={formData.Global_Sales}
          onChange={handleChange}
        />
        <button type="submit">Créer le jeu</button>
      </form>
      {message && <p className="message">{message}</p>}
      {showSuccess && (
        <div className="mario-success-message">
          <img
            src={MARIO_RUN_URL}
            alt="Mario court"
            className="mario-run-img"
          />
          <span>Jeu ajouté avec succès !</span>
        </div>
      )}
    </div>
  );
}
