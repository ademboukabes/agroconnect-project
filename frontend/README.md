# Frontend AgroConnect

Application React pour la plateforme de transport agricole.

## Stack

- React 19
- Vite
- React Router 7
- Tailwind CSS
- Leaflet / React-Leaflet
- Socket.io-client

## Structure

```
src/
├── assets/      # Images et ressources
├── components/  # Composants réutilisables
├── context/     # Contextes React (Auth, etc.)
├── layouts/     # Layouts de pages
├── pages/       # Pages de l'application
└── services/    # Services API
```

## Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification ESLint
```

## Configuration

L'API backend est configurée par défaut sur `http://localhost:3000`.

Pour modifier l'URL de l'API, créer un fichier `.env` :
```env
VITE_API_URL=http://localhost:3000
```

## Pages

- `/` - Accueil
- `/login` - Connexion
- `/register` - Inscription
- `/dashboard` - Tableau de bord client
- `/transporter` - Tableau de bord transporteur
- `/shipments` - Liste des expéditions
- `/tracking/:id` - Suivi en temps réel
