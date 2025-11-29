import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Fix pour les icones Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Icône personnalisée pour le camion
const TruckIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5" fill="#2563eb"></circle>
            <circle cx="18.5" cy="18.5" r="2.5" fill="#2563eb"></circle>
        </svg>
    `),
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
});

// Icône pour le point de départ (vert)
const PickupIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#10b981" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Icône pour le point d'arrivée (rouge)
const DeliveryIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Composant pour gérer le routing
const RoutingMachine = ({ pickup, delivery }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map || !pickup || !delivery) return;

        // Supprimer le contrôle existant s'il existe
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        // Créer un nouveau contrôle de routing
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(pickup[0], pickup[1]),
                L.latLng(delivery[0], delivery[1])
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: '#3b82f6', opacity: 0.6, weight: 4 }]
            },
            createMarker: () => null, // On ne crée pas de marqueurs par défaut
        }).addTo(map);

        // Cacher les instructions de navigation
        const container = routingControl.getContainer();
        if (container) {
            container.style.display = 'none';
        }

        routingControlRef.current = routingControl;

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [map, pickup, delivery]);

    return null;
};

const TrackingMap = ({ shipmentId, initialLocation, pickup, delivery }) => {
    const [position, setPosition] = useState(initialLocation?.coordinates ? [initialLocation.coordinates[1], initialLocation.coordinates[0]] : null);
    const [path, setPath] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialiser la position si disponible
        if (initialLocation?.coordinates) {
            const [lng, lat] = initialLocation.coordinates;
            setPosition([lat, lng]);
            setPath(prev => [...prev, [lat, lng]]);
        }

        // Connexion WebSocket
        const token = localStorage.getItem('token');
        const newSocket = io('http://localhost:3000', {
            auth: { token },
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('Connecté au tracking');
            newSocket.emit('join-shipment', shipmentId);
        });

        newSocket.on('location-update', (data) => {
            console.log('Mise à jour position:', data);
            const [lng, lat] = data.location.coordinates;
            const newPos = [lat, lng];
            setPosition(newPos);
            setPath(prev => [...prev, newPos]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.emit('leave-shipment', shipmentId);
            newSocket.disconnect();
        };
    }, [shipmentId]);

    const pickupPos = pickup?.coordinates ? [pickup.coordinates[1], pickup.coordinates[0]] : null;
    const deliveryPos = delivery?.coordinates ? [delivery.coordinates[1], delivery.coordinates[0]] : null;

    return (
        <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <MapContainer
                center={position || pickupPos || [36.7538, 3.0588]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Route planifiée du départ à l'arrivée */}
                {pickupPos && deliveryPos && (
                    <RoutingMachine pickup={pickupPos} delivery={deliveryPos} />
                )}

                {/* Position actuelle du camion */}
                {position && (
                    <Marker position={position} icon={TruckIcon}>
                        <Popup>
                            <div className="text-center">
                                <strong>Camion en route</strong>
                                <br />
                                <small>Position actuelle</small>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Point de départ */}
                {pickupPos && (
                    <Marker position={pickupPos} icon={PickupIcon}>
                        <Popup>
                            <div className="text-center">
                                <strong>Point de ramassage</strong>
                                <br />
                                <small>Départ</small>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Point d'arrivée */}
                {deliveryPos && (
                    <Marker position={deliveryPos} icon={DeliveryIcon}>
                        <Popup>
                            <div className="text-center">
                                <strong>Destination</strong>
                                <br />
                                <small>Arrivée</small>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Trajet parcouru (en vert) */}
                {path.length > 1 && (
                    <Polyline
                        positions={path}
                        color="#10b981"
                        weight={3}
                        opacity={0.7}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default TrackingMap;
