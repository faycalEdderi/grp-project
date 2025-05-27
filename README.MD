
Projet Django + React - Visualisation de Jeux Vidéo 🎮

Ce projet est un projet scolaire réalisé dans le cadre d’un TP à l’école IPSSI.

Description du projet :
-----------------------
Ce projet full-stack a pour but de fournir une interface utilisateur permettant de visualiser, filtrer, ajouter, modifier et supprimer des jeux vidéo à partir d’une base de données MongoDB.

Le backend est développé avec Django et utilise MongoDB via PyMongo.
Le frontend est développé avec React.

Fonctionnalités principales :
-----------------------------
- Affichage de la liste complète des jeux vidéo
- Filtres dynamiques sur la plateforme, le genre, l’éditeur et l’année
- Création, modification et suppression de jeux
- Visualisation du top 10 des jeux les plus vendus

Installation et lancement :
---------------------------

🔧 Prérequis :
- Python 3.x
- Node.js et npm
- MongoDB en local

📦 Installation backend (Django) :
1. Créez un environnement virtuel :
   python -m venv env
2. Activez-le :
   - Windows : env\Scripts\activate
   - macOS/Linux : source env/bin/activate
3. Installez les dépendances :
   pip install -r requirements.txt
4. Lancez le serveur :
   python manage.py runserver

💻 Installation frontend (React) :
1. Naviguez dans le dossier `frontend`
2. Installez les dépendances :
   npm install
3. Lancez le serveur de développement :
   npm start

Accès à l'application :
-----------------------
- Frontend : http://localhost:3000
- Backend API : http://localhost:8000/api/

Structure des endpoints principaux :
------------------------------------
- GET /api/all/ : Tous les jeux
- GET /api/top10/ : Top 10 des jeux
- GET /api/games/filter/?Platform=Wii&Genre=Sports : Filtres combinés
- POST /api/create/ : Ajouter un jeu
- PUT /api/<game_id>/update/ : Modifier un jeu
- DELETE /api/<game_id>/delete/ : Supprimer un jeu

👨‍💻 Réalisé dans le cadre du TP à l’IPSSI.