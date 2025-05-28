import React, { useState, useEffect } from 'react';
import './UpdateGame.css';

export default function UpdateGame({ show, onClose, game, onUpdate }) {
  const [formData, setFormData] = useState({
    Name: '',
    Platform: '',
    Genre: '',
    Publisher: '',
    Year_of_Release: '',
  });

  useEffect(() => {
    if (game) setFormData(game);
  }, [game]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch(`http://localhost:8000/api/games/${game._id}/update/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          
      if (res.ok) {
        onUpdate();
        onClose();
      }
    } catch (err) {
      console.error("Erreur lors de l'update :", err);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Modifier le jeu</h3>
        <form onSubmit={handleSubmit}>
          {['Name', 'Platform', 'Genre', 'Publisher', 'Year_of_Release'].map(field => (
            <div key={field}>
              <label>{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onClose} className="cancel">Annuler</button>
        </form>
      </div>
    </div>
  );
}
