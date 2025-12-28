# AgroConnect

Plateforme de mise en relation entre agriculteurs et transporteurs en Algérie. Permet de gérer les demandes de transport agricole avec suivi GPS en temps réel.

## Fonctionnalités

- Gestion des utilisateurs (clients et transporteurs)
- Création et gestion des demandes de transport
- Système de notation des chauffeurs avec IA
- Gestion de flotte de véhicules
- Estimation de prix automatique

## Stack Technique

### Backend
- Node.js / Express.js
- MongoDB avec Mongoose
- Socket.io pour le temps réel
- JWT pour l'authentification

### Frontend
- React 19 avec Vite
- React Router pour la navigation
- Tailwind CSS pour le styling
- Leaflet pour les cartes
- Socket.io-client pour le temps réel

### Service IA
- Python / FastAPI
- Modèle de notation des chauffeurs

## Structure du Projet

```
agroconnect-project/
├── backend/           # API Node.js/Express
│   ├── src/
│   │   ├── config/    # Configuration (DB, etc.)
│   │   ├── middleware/# Middlewares Express
│   │   ├── modules/   # Modules métier (auth, users, shipments, etc.)
│   │   ├── services/  # Services (socket, AI rating)
│   │   └── utils/     # Utilitaires
│   └── package.json
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/# Composants réutilisables
│   │   ├── context/   # Contextes React
│   │   ├── pages/     # Pages de l'application
│   │   └── services/  # Services API
│   └── package.json
├── ai-service/        # Service Python pour le rating IA
│   ├── main.py
│   └── requirements.txt

```

## Installation

### Prérequis

- Node.js 18+
- Python 3.8+
- MongoDB (local ou Atlas)

### Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` :
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/agroconnect
JWT_SECRET=votre_secret_jwt
```

### Frontend

```bash
cd frontend
npm install
```

### Service IA

```bash
cd ai-service
pip install -r requirements.txt
```

## Démarrage

### Backend
```bash
cd backend
npm run dev
```
Le serveur démarre sur `http://localhost:3000`

### Frontend
```bash
cd frontend
npm run dev
```
L'application démarre sur `http://localhost:5173`

### Service IA
```bash
cd ai-service
python -m uvicorn main:app --reload --port 8000
```

## Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET | /api/users/profile | Profil utilisateur |
| GET | /api/shipments | Liste des expéditions |
| POST | /api/shipments | Créer une expédition |
| PUT | /api/shipments/:id/accept | Accepter une expédition |
| GET | /api/tracking/:id | Suivi d'une expédition |

## Auteur

Développé pour le hackathon AgroTech 2024.

## Licence

MIT
