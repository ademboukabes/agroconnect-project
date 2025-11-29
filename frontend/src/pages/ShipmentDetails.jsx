import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TrackingMap from '../components/TrackingMap';
import { ArrowLeft, MapPin, Package, Truck, Clock, AlertCircle } from 'lucide-react';

const ShipmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pour la simulation de déplacement (Transporteur)
    const [simulating, setSimulating] = useState(false);

    useEffect(() => {
        fetchShipment();
    }, [id]);

    const fetchShipment = async () => {
        try {
            const response = await api.get(`/shipments/${id}`);
            if (response.data.success) {
                setShipment(response.data.data.shipment);
            }
        } catch (err) {
            setError('Erreur lors du chargement de l\'expédition');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        try {
            // Pour simplifier, on prend le premier véhicule dispo ou on demande à l'utilisateur
            // Ici on hardcode un ID de véhicule pour la démo si nécessaire, ou on demande de sélectionner
            // Idéalement : ouvrir une modale pour choisir le véhicule
            const vehiclesRes = await api.get('/vehicles');
            const vehicles = vehiclesRes.data.data.vehicles;

            if (vehicles.length === 0) {
                alert('Vous devez d\'abord ajouter un véhicule');
                navigate('/vehicles');
                return;
            }

            await api.post(`/shipments/${id}/accept`, { vehicleId: vehicles[0]._id });
            fetchShipment();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de l\'acceptation');
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await api.put(`/shipments/${id}/status`, { status: newStatus });
            fetchShipment();
        } catch (err) {
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const simulateMovement = async () => {
        if (simulating) return;
        setSimulating(true);

        // Simulation simple : déplacement de Blida vers Alger
        const path = [
            [2.8277, 36.4703], // Blida
            [2.9000, 36.5500],
            [2.9800, 36.6800],
            [3.0588, 36.7538]  // Alger
        ];

        for (const [lng, lat] of path) {
            try {
                await api.post(`/tracking/${id}/update`, {
                    longitude: lng,
                    latitude: lat,
                    speed: 60 + Math.random() * 20,
                    heading: 45
                });
                // Attendre 2 secondes entre chaque point
                await new Promise(r => setTimeout(r, 2000));
            } catch (err) {
                console.error('Erreur simulation', err);
            }
        }
        setSimulating(false);
        alert('Simulation terminée');
    };

    if (loading) return <div className="text-center py-12">Chargement...</div>;
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
    if (!shipment) return <div className="text-center py-12">Expédition non trouvée</div>;

    const isClient = user?.role === 'user';
    const isTransporter = user?.role === 'transporter';
    const canTrack = ['in_transit', 'delivered'].includes(shipment.status);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Retour au tableau de bord
            </button>

            {/* En-tête */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Expédition #{shipment._id.slice(-6)}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Créée le {new Date(shipment.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold 
            ${shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'}`}>
                        {shipment.status.toUpperCase()}
                    </span>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Package className="h-5 w-5 mr-2" /> Produit
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {shipment.productType} - {shipment.quantity} unités ({shipment.weight} tonnes)
                            </dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <MapPin className="h-5 w-5 mr-2" /> Trajet
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex flex-col space-y-2">
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        De: {shipment.pickup.address}
                                    </span>
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                        À: {shipment.delivery.address}
                                    </span>
                                </div>
                            </dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Clock className="h-5 w-5 mr-2" /> Date prévue
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {new Date(shipment.pickup.date).toLocaleString()}
                            </dd>
                        </div>

                        {shipment.notes && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2" /> Notes
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {shipment.notes}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>

            {/* Actions Transporteur */}
            {isTransporter && (
                <div className="bg-white shadow sm:rounded-lg p-6 flex flex-wrap gap-4">
                    {shipment.status === 'pending' && (
                        <button
                            onClick={handleAccept}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
                        >
                            Accepter la demande
                        </button>
                    )}

                    {shipment.status === 'accepted' && (
                        <button
                            onClick={() => handleStatusUpdate('in_transit')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Démarrer le transport
                        </button>
                    )}

                    {shipment.status === 'in_transit' && (
                        <>
                            <button
                                onClick={() => handleStatusUpdate('delivered')}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                Confirmer la livraison
                            </button>

                            <button
                                onClick={simulateMovement}
                                disabled={simulating}
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
                            >
                                {simulating ? 'Simulation en cours...' : 'Simuler déplacement GPS'}
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Carte de Tracking */}
            {canTrack && (
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Truck className="h-5 w-5 mr-2 text-primary" />
                        Suivi en temps réel
                    </h3>
                    <TrackingMap
                        shipmentId={shipment._id}
                        initialLocation={shipment.currentLocation}
                        pickup={shipment.pickup.location}
                        delivery={shipment.delivery.location}
                    />
                </div>
            )}
        </div>
    );
};

export default ShipmentDetails;
