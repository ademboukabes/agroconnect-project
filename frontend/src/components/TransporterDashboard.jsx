import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Truck, MapPin, CheckCircle, Star, TrendingUp, Package, ArrowRight, DollarSign, Power, Phone } from 'lucide-react';
import DriverRating from './DriverRating';

const TransporterDashboard = () => {
    const { user } = useAuth();
    const [availableShipments, setAvailableShipments] = useState([]);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [ratingData, setRatingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAvailable, setIsAvailable] = useState(user?.transporterProfile?.isAvailable ?? true);
    const [revealedPhones, setRevealedPhones] = useState({});

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-DZ', {
            style: 'currency',
            currency: 'DZD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleNegotiateClick = (e, shipmentId) => {
        e.preventDefault(); // Prevent navigation
        setRevealedPhones(prev => ({
            ...prev,
            [shipmentId]: !prev[shipmentId]
        }));
    };

    useEffect(() => {
        if (user?.transporterProfile) {
            setIsAvailable(user.transporterProfile.isAvailable);
        }
    }, [user]);

    const handleToggleAvailability = async () => {
        try {
            const response = await api.put('/users/toggle-availability');

            if (response.data.success) {
                const newAvailability = response.data.data.isAvailable;
                setIsAvailable(newAvailability);
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
            alert(`Erreur: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!user?._id) {
                return;
            }

            try {
                const [availableRes, myRes, ratingRes, vehiclesRes] = await Promise.all([
                    api.get('/shipments/available'),
                    api.get('/shipments/my-deliveries'),
                    api.get(`/ratings/driver/${user._id}`),
                    api.get('/vehicles')
                ]);

                if (availableRes.data.success) {
                    setAvailableShipments(availableRes.data.data.shipments);
                }
                if (myRes.data.success) {
                    setMyDeliveries(myRes.data.data.shipments);
                }
                if (ratingRes.data.success) {
                    setRatingData(ratingRes.data.data.aiRating);
                }
                if (vehiclesRes.data.success) {
                    setVehicles(vehiclesRes.data.data.vehicles);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Availability Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl transition-colors duration-500 ${isAvailable ? 'bg-green-500/10' : 'bg-gray-500/10'}`}></div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                        <Power className={`h-4 w-4 mr-2 ${isAvailable ? 'text-green-500' : 'text-gray-400'}`} />
                        Statut
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xl font-bold transition-colors duration-300 ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                                {isAvailable ? 'En ligne' : 'Hors ligne'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {isAvailable ? 'Visible' : 'Invisible'}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleAvailability}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isAvailable ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                {/* AI Rating Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                        <Star className="h-4 w-4 mr-2 text-accent" />
                        Performance IA
                    </h2>
                    <DriverRating aiRating={ratingData} />
                </div>

                {/* Fleet Summary */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center">
                                <Truck className="h-4 w-4 mr-2 text-blue-500" />
                                Ma Flotte
                            </h2>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{vehicles.length}</p>
                            <p className="text-sm text-gray-500">Véhicules actifs</p>
                        </div>
                        <Link to="/vehicles" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Earnings (Placeholder) */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center">
                                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                                Revenus (Mois)
                            </h2>
                            <p className="text-3xl font-bold text-gray-900 mt-2">-- DZD</p>
                            <p className="text-sm text-gray-500">+0% vs mois dernier</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Deliveries */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Livraisons en cours</h2>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {myDeliveries.length} active(s)
                    </span>
                </div>

                {myDeliveries.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300">
                        <p className="text-gray-500">Aucune livraison en cours actuellement.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {myDeliveries.map((shipment) => (
                            <Link key={shipment._id} to={`/shipments/${shipment._id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                                                    {shipment.productType}
                                                </h3>
                                                <p className="text-xs text-gray-500">En cours</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="truncate">{shipment.delivery.address}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center group-hover:bg-blue-50/50 transition-colors">
                                    <span className="text-xs font-medium text-blue-600">Gérer la livraison</span>
                                    <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Available Requests */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Nouvelles opportunités</h2>
                {availableShipments.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300">
                        <p className="text-gray-500">Aucune demande disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
                        <ul className="divide-y divide-gray-100">
                            {availableShipments.map((shipment) => (
                                <li key={shipment._id} className="hover:bg-gray-50 transition-colors">
                                    <Link to={`/shipments/${shipment._id}`} className="block p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center min-w-0">
                                                <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mr-4">
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {shipment.productType} • {shipment.weight} tonnes
                                                    </p>
                                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                        {shipment.pickup.city || 'Départ'} → {shipment.delivery.city || 'Arrivée'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end ml-4">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 mb-2">
                                                    {shipment.price ? formatPrice(shipment.price) : 'Prix à définir'}
                                                </span>

                                                <button
                                                    onClick={(e) => handleNegotiateClick(e, shipment._id)}
                                                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors mb-2 ${revealedPhones[shipment._id]
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <Phone className="h-3 w-3" />
                                                    {revealedPhones[shipment._id]
                                                        ? (shipment.client?.phone || 'Non disponible')
                                                        : 'Négocier'}
                                                </button>

                                                <span className="text-xs text-gray-400">
                                                    Voir détails &rarr;
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransporterDashboard;
