import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Package, MapPin, Calendar, ArrowRight, Clock } from 'lucide-react';

const ClientDashboard = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const response = await api.get('/shipments/my-requests');
                if (response.data.success) {
                    setShipments(response.data.data.shipments);
                }
            } catch (error) {
                console.error('Error fetching shipments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShipments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'accepted': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'delivered': return 'Livré';
            case 'in_transit': return 'En transit';
            case 'accepted': return 'Accepté';
            case 'pending': return 'En attente';
            case 'cancelled': return 'Annulé';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Mes Expéditions</h2>
                    <p className="text-sm text-gray-500">Gérez vos demandes de transport</p>
                </div>
                <Link
                    to="/create-shipment"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-all transform hover:scale-105"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Nouvelle demande
                </Link>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : shipments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                    <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Aucune expédition</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                        Vous n'avez pas encore créé de demande de transport. Commencez dès maintenant !
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/create-shipment"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                            <Plus className="-ml-1 mr-2 h-5 w-5" />
                            Créer une demande
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {shipments.map((shipment) => (
                        <Link
                            key={shipment._id}
                            to={`/shipments/${shipment._id}`}
                            className="group block bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                {shipment.productType}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {shipment.quantity} {shipment.unit || 'unités'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                                        {getStatusLabel(shipment.status)}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                                        </div>
                                        <div className="ml-3 min-w-0 flex-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Départ</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">{shipment.pickup.address}</p>
                                            <p className="text-xs text-gray-400 flex items-center mt-0.5">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(shipment.pickup.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5"></div>
                                        </div>
                                        <div className="ml-3 min-w-0 flex-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Arrivée</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">{shipment.delivery.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                                <span className="text-xs font-medium text-gray-500">
                                    Voir les détails
                                </span>
                                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;
