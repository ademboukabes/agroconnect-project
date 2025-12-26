# Backend AgroConnect

API REST pour la plateforme de transport agricole.

## Stack

- Express.js 5
- MongoDB / Mongoose
- Socket.io
- JWT Authentication

## Structure

```
src/
├── config/          # Configuration base de données
├── middleware/      # Auth middleware
├── modules/
│   ├── auth/        # Authentification (register, login)
│   ├── users/       # Gestion des profils
│   ├── shipments/   # Gestion des expéditions
│   ├── transport/   # Gestion des véhicules
│   ├── tracking/    # Suivi GPS
│   ├── ratings/     # Notations
│   └── orders/      # Commandes
├── services/        # Socket.io, AI rating
└── utils/           # Helpers
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| PORT | Port du serveur (défaut: 3000) |
| MONGO_URI | URI de connexion MongoDB |
| JWT_SECRET | Clé secrète pour les tokens JWT |

## Scripts

```bash
npm run dev    # Développement avec nodemon
npm start      # Production
```

## Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Users
- `GET /api/users/profile` - Récupérer le profil
- `PUT /api/users/profile` - Modifier le profil
- `PUT /api/users/toggle-availability` - Activer/désactiver disponibilité

### Shipments
- `GET /api/shipments` - Liste des expéditions
- `POST /api/shipments` - Créer une expédition
- `GET /api/shipments/:id` - Détails d'une expédition
- `PUT /api/shipments/:id/accept` - Accepter une expédition
- `PUT /api/shipments/:id/status` - Changer le statut

### Vehicles
- `GET /api/vehicles` - Liste des véhicules
- `POST /api/vehicles` - Ajouter un véhicule

### Tracking
- `GET /api/tracking/:shipmentId` - Historique de tracking
- `POST /api/tracking/:shipmentId/update` - Mise à jour position GPS
