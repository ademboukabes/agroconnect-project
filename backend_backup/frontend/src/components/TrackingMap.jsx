import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icones Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
            console.log('Connected to tracking');
            newSocket.emit('join-shipment', shipmentId);
        });

        newSocket.on('location-update', (data) => {
            console.log('Location update:', data);
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
        <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <MapContainer
                center={position || pickupPos || [36.7538, 3.0588]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* Position actuelle du camion */}
                {position && (
                    <Marker position={position}>
                        <Popup>Camion en route</Popup>
                    </Marker>
                )}

                {/* Point de départ */}
                {pickupPos && (
                    <Marker position={pickupPos} opacity={0.7}>
                        <Popup>Point de ramassage</Popup>
                    </Marker>
                )}

                {/* Point d'arrivée */}
                {deliveryPos && (
                    <Marker position={deliveryPos} opacity={0.7}>
                        <Popup>Destination</Popup>
                    </Marker>
                )}

                {/* Trajet parcouru */}
                {path.length > 1 && <Polyline positions={path} color="blue" />}
            </MapContainer>
        </div>
    );
};

export default TrackingMap;
