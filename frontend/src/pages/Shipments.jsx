import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Package, Plus, MapPin, Calendar, Clock, Filter } from 'lucide-react';

const Shipments = () => {
    const { user } = useAuth();
    const [shipments, setShipments] = useState([]);
    const [availableShipments, setAvailableShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(user?.role === 'transporter' ? 'mydeliveries' : 'all');
    const [statusFilter, setStatusFilter] = useState('all');

    const isClient = user?.role === 'user';
    const isTransporter = user?.role === 'transporter';

    useEffect(() => {
        fetchShipments();
    }, [user]);

    const fetchShipments = async () => {
        try {
            if (isClient) {
                const res = await api.get('/shipments/my-requests');
                if (res.data.success) {
                    setShipments(res.data.data.shipments);
                }
            } else if (isTransporter) {
                const [myRes, availableRes] = await Promise.all([
                    api.get('/shipments/my-deliveries'),
                    api.get('/shipments/available')
                ]);
                if (myRes.data.success) setShipments(myRes.data.data.shipments);
                if (availableRes.data.success) setAvailableShipments(availableRes.data.data.shipments);
            }
        } catch (error) {
            console.error('Error fetching shipments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-blue-100 text-blue-800',
            in_transit: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'En attente',
            accepted: 'Accepté',
            in_transit: 'En transit',
            delivered: 'Livré',
            cancelled: 'Annulé'
        };
        return texts[status] || status;
    };

    const filteredShipments = statusFilter === 'all'
        ? shipments
        : shipments.filter(s => s.status === statusFilter);

    const ShipmentCard = ({ shipment }) => (
        <Link
            to={`/shipments/${shipment._id}`}
            className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{shipment.productType}</h3>
                        <p className="text-sm text-gray-500">{shipment.weight} tonnes</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                    {getStatusText(shipment.status)}
                </span>
            </div>
            <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{shipment.pickup?.address || 'N/A'} → {shipment.delivery?.address || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{new Date(shipment.pickup?.date || shipment.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
            </div>
        </Link>
    );

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Clock className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isClient ? 'Mes Expéditions' : 'Livraisons'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isClient ? 'Gérez vos demandes de transport' : 'Vos missions et opportunités'}
                    </p>
                </div>
                {isClient && (
                    <Link
                        to="/create-shipment"
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Nouvelle demande
                    </Link>
                )}
            </div>

            {/* Tabs for Transporters */}
            {isTransporter && (
                <div className="flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('mydeliveries')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'mydeliveries'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Mes Livraisons ({shipments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'available'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Demandes Disponibles ({availableShipments.length})
                    </button>
                </div>
            )}

            {/* Status Filter for Clients */}
            {isClient && (
                <div className="flex items-center gap-3">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="accepted">Accepté</option>
                        <option value="in_transit">En transit</option>
                        <option value="delivered">Livré</option>
                    </select>
                </div>
            )}

            {/* Shipments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isClient && filteredShipments.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune expédition trouvée</p>
                    </div>
                )}

                {isClient && filteredShipments.map((shipment) => (
                    <ShipmentCard key={shipment._id} shipment={shipment} />
                ))}

                {isTransporter && activeTab === 'mydeliveries' && shipments.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune livraison en cours</p>
                    </div>
                )}

                {isTransporter && activeTab === 'mydeliveries' && shipments.map((shipment) => (
                    <ShipmentCard key={shipment._id} shipment={shipment} />
                ))}

                {isTransporter && activeTab === 'available' && availableShipments.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune demande disponible</p>
                    </div>
                )}

                {isTransporter && activeTab === 'available' && availableShipments.map((shipment) => (
                    <ShipmentCard key={shipment._id} shipment={shipment} />
                ))}
            </div>
        </div>
    );
};

export default Shipments;
