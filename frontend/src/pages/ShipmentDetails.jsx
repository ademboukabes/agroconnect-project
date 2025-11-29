import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TrackingMap from '../components/TrackingMap';
import { ArrowLeft, MapPin, Package, Truck, Clock, AlertCircle, CheckCircle, Navigation, Phone, FileText, Star } from 'lucide-react';

const ShipmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
                await new Promise(r => setTimeout(r, 2000));
            } catch (err) {
                console.error('Erreur simulation', err);
            }
        }
        setSimulating(false);
        alert('Simulation terminée');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen text-red-600">
            <AlertCircle className="h-6 w-6 mr-2" /> {error}
        </div>
    );

    if (!shipment) return null;

    const isClient = user?.role === 'user';
    const isTransporter = user?.role === 'transporter';
    const canTrack = ['in_transit', 'delivered'].includes(shipment.status);

    const getStatusStep = (status) => {
        switch (status) {
            case 'pending': return 1;
            case 'accepted': return 2;
            case 'in_transit': return 3;
            case 'delivered': return 4;
            default: return 0;
        }
    };

    const currentStep = getStatusStep(shipment.status);

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="group flex items-center text-gray-500 hover:text-primary transition-colors"
                >
                    <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100 mr-3 group-hover:border-primary/30 transition-all">
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Retour</span>
                </button>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Expédition</p>
                    <p className="font-mono text-lg font-bold text-gray-900">#{shipment._id.slice(-6)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Status Timeline */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-8">Suivi de l'expédition</h2>

                        {/* Desktop Timeline (Horizontal) */}
                        <div className="hidden md:block relative">
                            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                            <div
                                className="absolute left-0 top-1/2 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                            ></div>

                            <div className="relative flex justify-between">
                                {[
                                    { step: 1, label: 'En attente', icon: Clock },
                                    { step: 2, label: 'Accepté', icon: CheckCircle },
                                    { step: 3, label: 'En transit', icon: Truck },
                                    { step: 4, label: 'Livré', icon: MapPin }
                                ].map((item) => (
                                    <div key={item.step} className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${currentStep >= item.step
                                                ? 'bg-primary border-white text-white shadow-lg scale-110'
                                                : 'bg-white border-gray-100 text-gray-300'
                                            }`}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <span className={`mt-3 text-xs font-bold uppercase tracking-wide ${currentStep >= item.step ? 'text-primary' : 'text-gray-400'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Timeline (Vertical) */}
                        <div className="md:hidden space-y-8 relative pl-4">
                            <div className="absolute left-8 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                            <div
                                className="absolute left-8 top-2 w-0.5 bg-primary transition-all duration-1000 ease-out"
                                style={{ height: `${((currentStep - 1) / 3) * 100}%` }}
                            ></div>

                            {[
                                { step: 1, label: 'En attente', icon: Clock, date: new Date(shipment.createdAt).toLocaleDateString() },
                                { step: 2, label: 'Accepté', icon: CheckCircle, date: shipment.acceptedAt ? new Date(shipment.acceptedAt).toLocaleDateString() : '-' },
                                { step: 3, label: 'En transit', icon: Truck, date: shipment.pickedUpAt ? new Date(shipment.pickedUpAt).toLocaleDateString() : '-' },
                                { step: 4, label: 'Livré', icon: MapPin, date: shipment.deliveredAt ? new Date(shipment.deliveredAt).toLocaleDateString() : '-' }
                            ].map((item) => (
                                <div key={item.step} className="relative flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 ${currentStep >= item.step
                                            ? 'bg-primary border-white text-white shadow-md'
                                            : 'bg-white border-gray-200 text-gray-300'
                                        }`}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="ml-4">
                                        <p className={`text-sm font-bold uppercase tracking-wide ${currentStep >= item.step ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                            {item.label}
                                        </p>
                                        {currentStep >= item.step && (
                                            <p className="text-xs text-gray-500">{item.date !== '-' ? item.date : ''}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipment Details Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                <Package className="h-5 w-5 mr-2 text-primary" />
                                Détails de la marchandise
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Produit</p>
                                <p className="text-lg font-bold text-gray-900">{shipment.productType}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Quantité / Poids</p>
                                <p className="text-lg font-bold text-gray-900">{shipment.quantity} unités • {shipment.weight} tonnes</p>
                            </div>

                            <div className="md:col-span-2 relative pl-8 border-l-2 border-gray-200 space-y-8 py-2">
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-green-100 border-4 border-white shadow-sm flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Départ</p>
                                    <p className="text-gray-900 font-medium">{shipment.pickup.address}</p>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(shipment.pickup.date).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-red-100 border-4 border-white shadow-sm flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Arrivée</p>
                                    <p className="text-gray-900 font-medium">{shipment.delivery.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    {canTrack && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <Navigation className="h-5 w-5 mr-2 text-primary" />
                                    Suivi GPS
                                </h2>
                                <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full animate-pulse">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                                    En direct
                                </span>
                            </div>
                            <div className="h-96 w-full">
                                <TrackingMap
                                    shipmentId={shipment._id}
                                    initialLocation={shipment.currentLocation}
                                    pickup={shipment.pickup.location}
                                    delivery={shipment.delivery.location}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar (Right Column) */}
                <div className="space-y-6">

                    {/* Transporter Card (For Client) */}
                    {isClient && shipment.transporter && (
                        <div className="bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary to-secondary opacity-10"></div>
                            <div className="p-6 relative">
                                <div className="flex items-center mb-6">
                                    <div className="h-16 w-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl font-bold text-primary border border-gray-100">
                                        {shipment.transporter.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500 font-medium">Transporteur</p>
                                        <h3 className="text-xl font-bold text-gray-900">{shipment.transporter.name}</h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Contact</p>
                                            <p className="font-medium text-gray-900">{shipment.transporter.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                        <Truck className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Véhicule</p>
                                            <p className="font-medium text-gray-900">
                                                {shipment.vehicle?.vehicleType} <span className="text-gray-400">•</span> {shipment.vehicle?.licensePlate}
                                            </p>
                                        </div>
                                    </div>

                                    {shipment.transporter.transporterProfile?.aiRating && (
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-sm font-bold text-gray-900 flex items-center">
                                                    <Star className="h-4 w-4 text-accent mr-1 fill-current" />
                                                    Score IA
                                                </span>
                                                <span className="text-2xl font-bold text-primary">
                                                    {shipment.transporter.transporterProfile.aiRating.score}
                                                    <span className="text-sm text-gray-400 font-normal">/100</span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                                <div
                                                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                                                    style={{ width: `${shipment.transporter.transporterProfile.aiRating.score}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-center text-gray-500">
                                                Niveau de fiabilité: <span className="font-medium text-primary">{shipment.transporter.transporterProfile.aiRating.category}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions Card (For Transporter) */}
                    {isTransporter && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                {shipment.status === 'pending' && (
                                    <button
                                        onClick={handleAccept}
                                        className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all transform hover:scale-[1.02]"
                                    >
                                        Accepter la mission
                                    </button>
                                )}

                                {shipment.status === 'accepted' && (
                                    <button
                                        onClick={() => handleStatusUpdate('in_transit')}
                                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all transform hover:scale-[1.02]"
                                    >
                                        Démarrer le trajet
                                    </button>
                                )}

                                {shipment.status === 'in_transit' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate('delivered')}
                                            className="w-full py-3 px-4 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-600/30 hover:bg-green-700 transition-all transform hover:scale-[1.02]"
                                        >
                                            Confirmer la livraison
                                        </button>

                                        <button
                                            onClick={simulateMovement}
                                            disabled={simulating}
                                            className="w-full py-3 px-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center"
                                        >
                                            {simulating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                                                    Simulation...
                                                </>
                                            ) : (
                                                <>
                                                    <Navigation className="h-4 w-4 mr-2" />
                                                    Simuler GPS
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShipmentDetails;
