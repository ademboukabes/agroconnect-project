import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Truck, MapPin, CheckCircle, Star, TrendingUp, Package, ArrowRight, DollarSign, Power, Phone, ShieldCheck } from 'lucide-react';
import DriverRating from './DriverRating';
import { Card, CardBody, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

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
        e.preventDefault();
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
                setIsAvailable(response.data.data.isAvailable);
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!user?._id) return;

            try {
                const [availableRes, myRes, ratingRes, vehiclesRes] = await Promise.all([
                    api.get('/shipments/available'),
                    api.get('/shipments/my-deliveries'),
                    api.get(`/ratings/driver/${user._id}`),
                    api.get('/vehicles')
                ]);

                if (availableRes.data.success) setAvailableShipments(availableRes.data.data.shipments);
                if (myRes.data.success) setMyDeliveries(myRes.data.data.shipments);
                if (ratingRes.data.success) setRatingData(ratingRes.data.data.aiRating);
                if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.data.vehicles);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Top Grid: Status & IA Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Availability Status Card */}
                <Card className="overflow-hidden relative border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 transition-colors duration-700 ${isAvailable ? 'bg-emerald-500/30' : 'bg-slate-500/20'}`} />
                    <CardBody className="p-8 relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Votre Visibilité</p>
                                <h3 className="text-3xl font-bold flex items-center gap-3">
                                    {isAvailable ? 'En ligne' : 'Hors ligne'}
                                    <span className={`h-3 w-3 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                                </h3>
                            </div>
                            <button
                                onClick={handleToggleAvailability}
                                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none ring-offset-2 ring-offset-slate-900 focus:ring-2 focus:ring-emerald-500 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-700'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${isAvailable ? 'translate-x-8' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <p className="mt-6 text-sm text-slate-400 font-medium">
                            {isAvailable
                                ? 'Vous êtes visible par les clients pour de nouvelles demandes.'
                                : 'Activez-vous pour recevoir des propositions de transport.'}
                        </p>
                    </CardBody>
                </Card>

                {/* AI Performance Card */}
                <Card className="lg:col-span-2">
                    <CardBody className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                    Performance IA
                                </h3>
                                <p className="text-sm text-slate-500 font-medium">Analyse temps réel de votre qualité de service</p>
                            </div>
                            <Badge variant="primary">AgroConnect AI</Badge>
                        </div>
                        <DriverRating aiRating={ratingData} />
                    </CardBody>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card hover>
                    <CardBody className="p-6 flex items-center">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mr-4">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Ma Flotte</p>
                            <p className="text-2xl font-bold text-slate-900">{vehicles.length}</p>
                        </div>
                    </CardBody>
                </Card>
                <Card hover>
                    <CardBody className="p-6 flex items-center">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl mr-4">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Réussi</p>
                            <p className="text-2xl font-bold text-slate-900">{myDeliveries.filter(d => d.status === 'delivered').length}</p>
                        </div>
                    </CardBody>
                </Card>
                <Card hover>
                    <CardBody className="p-6 flex items-center">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl mr-4">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Revenus</p>
                            <p className="text-2xl font-bold text-slate-900">-- <span className="text-xs">DZD</span></p>
                        </div>
                    </CardBody>
                </Card>
                <Card hover>
                    <CardBody className="p-6 flex items-center">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mr-4">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Fiabilité</p>
                            <p className="text-2xl font-bold text-slate-900">-- <span className="text-xs text-slate-500 mb-2">%</span></p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Active Deliveries Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Livraisons Actives</h2>
                    <Badge variant="primary">{myDeliveries.length} en transit</Badge>
                </div>
                {myDeliveries.length === 0 ? (
                    <Card className="border-dashed border-2 py-12">
                        <CardBody className="text-center">
                            <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">Aucune livraison n'est actuellement en cours.</p>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {myDeliveries.map((shipment) => (
                            <Card key={shipment._id} hover className="flex flex-col h-full overflow-hidden border-l-4 border-l-primary-500">
                                <CardBody className="p-6 flex-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                            <Package className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 truncate">{shipment.productType}</h4>
                                            <p className="text-xs font-semibold text-primary-600 uppercase">En cours de livraison</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-slate-500 font-medium leading-relaxed">
                                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-slate-400" />
                                        <span className="line-clamp-2">{shipment.delivery.address}</span>
                                    </div>
                                </CardBody>
                                <Link to={`/shipments/${shipment._id}`} className="px-6 py-4 bg-slate-50 hover:bg-primary-50/50 flex justify-between items-center transition-colors border-t border-slate-100">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gérer le suivi</span>
                                    <ArrowRight className="h-4 w-4 text-primary-600" />
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* New Opportunities List */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Opportunités Disponibles</h2>
                {availableShipments.length === 0 ? (
                    <Card className="border-dashed border-2 py-12">
                        <CardBody className="text-center text-slate-500 font-medium">
                            <Plus className="h-10 w-10 mx-auto mb-4 text-slate-200" />
                            Revenez plus tard pour de nouvelles demandes.
                        </CardBody>
                    </Card>
                ) : (
                    <Card className="overflow-hidden shadow-premium">
                        <div className="divide-y divide-slate-50">
                            {availableShipments.map((shipment) => (
                                <div key={shipment._id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5 min-w-0 flex-1">
                                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                            <DollarSign className="h-7 w-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-lg font-bold text-slate-900 truncate">
                                                {shipment.productType} • {shipment.weight} tonnes
                                            </p>
                                            <div className="flex items-center mt-1 text-sm text-slate-500 font-medium">
                                                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                                                <span className="truncate">{shipment.pickup.city || 'Départ'} → {shipment.delivery.city || 'Arrivée'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto self-end">
                                        <Badge variant="success" className="text-sm px-4 py-1">
                                            {shipment.price ? formatPrice(shipment.price) : 'Prix Flexible'}
                                        </Badge>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant={revealedPhones[shipment._id] ? 'accent' : 'secondary'}
                                                size="sm"
                                                icon={Phone}
                                                onClick={(e) => handleNegotiateClick(e, shipment._id)}
                                            >
                                                {revealedPhones[shipment._id] ? (shipment.client?.phone || 'Contact') : 'Négocier'}
                                            </Button>
                                            <Link to={`/shipments/${shipment._id}`}>
                                                <Button size="sm" variant="ghost" icon={ArrowRight} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TransporterDashboard;
