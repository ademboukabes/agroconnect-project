# Guide d'Intégration - Tracking en Temps Réel

## 🌐 WebSocket avec Socket.io

Le backend émet maintenant des événements en temps réel pour le tracking GPS.

---

## 📡 Connexion WebSocket (Frontend)

### Installation
```bash
npm install socket.io-client
```

### Connexion au serveur
```javascript
import { io } from 'socket.io-client';

// Connexion avec authentification
const socket = io('http://localhost:3000', {
  auth: {
    token: 'VOTRE_JWT_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('✅ Connecté au serveur WebSocket');
});

socket.on('connect_error', (error) => {
  console.error('❌ Erreur de connexion:', error.message);
});
```

---

## 📍 Tracking d'une Expédition

### 1. Rejoindre le tracking
```javascript
const shipmentId = '69297505027d59227d7b83fc';

// Rejoindre la room de l'expédition
socket.emit('join-shipment', shipmentId);
```

### 2. Écouter les mises à jour de position
```javascript
socket.on('location-update', (data) => {
  console.log('📍 Nouvelle position:', data);
  
  const { location, timestamp } = data;
  const [longitude, latitude] = location.coordinates;
  
  // Mettre à jour le marqueur sur la carte
  updateMarkerOnMap(latitude, longitude);
  
  // Afficher la vitesse
  console.log(`Vitesse: ${location.speed} km/h`);
});
```

### 3. Écouter les changements de statut
```javascript
socket.on('status-update', (data) => {
  console.log('📊 Nouveau statut:', data);
  
  const { status } = data;
  // Mettre à jour l'interface
  updateStatusUI(status);
});
```

### 4. Quitter le tracking
```javascript
socket.emit('leave-shipment', shipmentId);
```

---

## 🗺️ Intégration avec une Carte

### Option 1: Leaflet (Gratuit, Open Source)

**Installation:**
```bash
npm install leaflet react-leaflet
```

**Exemple React:**
```jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

function TrackingMap({ shipmentId, token }) {
  const [position, setPosition] = useState([36.7538, 3.0588]); // Alger par défaut
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connexion WebSocket
    const newSocket = io('http://localhost:3000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      newSocket.emit('join-shipment', shipmentId);
    });

    newSocket.on('location-update', (data) => {
      const [lng, lat] = data.location.coordinates;
      setPosition([lat, lng]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave-shipment', shipmentId);
      newSocket.disconnect();
    };
  }, [shipmentId, token]);

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={position}>
        <Popup>Position actuelle du camion</Popup>
      </Marker>
    </MapContainer>
  );
}
```

---

### Option 2: Google Maps

**Installation:**
```bash
npm install @react-google-maps/api
```

**Exemple React:**
```jsx
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function TrackingMap({ shipmentId, token }) {
  const [position, setPosition] = useState({ lat: 36.7538, lng: 3.0588 });

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      auth: { token }
    });

    socket.on('connect', () => {
      socket.emit('join-shipment', shipmentId);
    });

    socket.on('location-update', (data) => {
      const [lng, lat] = data.location.coordinates;
      setPosition({ lat, lng });
    });

    return () => {
      socket.emit('leave-shipment', shipmentId);
      socket.disconnect();
    };
  }, [shipmentId, token]);

  return (
    <LoadScript googleMapsApiKey="VOTRE_CLE_API">
      <GoogleMap
        center={position}
        zoom={13}
        mapContainerStyle={{ height: '400px', width: '100%' }}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
}
```

---

## 📱 Test avec Postman (Simulation)

### 1. Le transporteur met à jour sa position

**POST** `http://localhost:3000/api/tracking/{shipmentId}/update`

**Headers:** `Authorization: Bearer {TOKEN_TRANSPORTEUR}`

```json
{
  "longitude": 3.0588,
  "latitude": 36.7538,
  "speed": 80,
  "heading": 45
}
```

### 2. Les clients connectés via WebSocket reçoivent automatiquement:

```json
{
  "shipmentId": "...",
  "location": {
    "coordinates": [3.0588, 36.7538],
    "speed": 80,
    "heading": 45,
    "timestamp": "2025-11-28T10:30:00.000Z"
  },
  "timestamp": "2025-11-28T10:30:00.000Z"
}
```

---

## 🔄 Événements Socket.io Disponibles

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `join-shipment` | Client → Serveur | Rejoindre le tracking d'une expédition |
| `leave-shipment` | Client → Serveur | Quitter le tracking |
| `location-update` | Serveur → Client | Nouvelle position GPS |
| `status-update` | Serveur → Client | Changement de statut |

---

## 🎯 Exemple Complet (Vanilla JS)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Tracking en Temps Réel</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://cdn.socket.io/4.7.0/socket.io.min.js"></script>
</head>
<body>
  <div id="map" style="height: 500px;"></div>

  <script>
    const token = 'VOTRE_JWT_TOKEN';
    const shipmentId = 'ID_EXPEDITION';

    // Initialiser la carte
    const map = L.map('map').setView([36.7538, 3.0588], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Marqueur du camion
    const marker = L.marker([36.7538, 3.0588]).addTo(map);

    // Connexion WebSocket
    const socket = io('http://localhost:3000', {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Connecté');
      socket.emit('join-shipment', shipmentId);
    });

    socket.on('location-update', (data) => {
      const [lng, lat] = data.location.coordinates;
      marker.setLatLng([lat, lng]);
      map.panTo([lat, lng]);
      
      marker.bindPopup(`Vitesse: ${data.location.speed} km/h`).openPopup();
    });
  </script>
</body>
</html>
```

---

## ✅ Avantages

- ✅ **Temps réel** - Pas besoin de polling
- ✅ **Efficace** - Connexion WebSocket persistante
- ✅ **Sécurisé** - Authentification JWT
- ✅ **Scalable** - Rooms par expédition
