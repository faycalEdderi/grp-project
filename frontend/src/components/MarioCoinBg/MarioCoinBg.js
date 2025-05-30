import React, { useEffect } from "react";

const COIN_URL = "/coin.png";

export default function MarioCoinsBg() {
  useEffect(() => {
    // Pour éviter d'empiler les coins si le composant est monté plusieurs fois
    if (document.getElementById("mario-coins-bg")) return;

    const container = document.createElement("div");
    container.className = "mario-coins-bg";
    container.id = "mario-coins-bg";
    document.body.appendChild(container);

    // Génère 15 coins à des positions et délais aléatoires
    for (let i = 0; i < 15; i++) {
      const coin = document.createElement("img");
      coin.src = COIN_URL;
      coin.className = "mario-coin";
      coin.style.left = Math.random() * 98 + "vw";
      coin.style.animationDelay = (Math.random() * 3) + "s"; // délai plus court
      coin.style.animationDuration = (2 + Math.random() * 1.5) + "s"; // vitesse plus rapide
      container.appendChild(coin);
    }

    return () => {
      container.remove();
    };
  }, []);

  return null;
}
