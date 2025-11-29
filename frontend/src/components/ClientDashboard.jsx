import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Package, MapPin, Clock } from 'lucide-react';

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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Mes Expéditions</h1>
                <Link
                    to="/create-shipment"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Nouvelle demande
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12">Chargement...</div>
            ) : shipments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune expédition</h3>
                    <p className="mt-1 text-sm text-gray-500">Commencez par créer une demande de transport.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {shipments.map((shipment) => (
                            <li key={shipment._id}>
                                <Link to={`/shipments/${shipment._id}`} className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-primary truncate">
                                                {shipment.productType} ({shipment.quantity} {shipment.unit || 'unités'})
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'}`}>
                                                    {shipment.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                    {shipment.pickup.address} → {shipment.delivery.address}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                <p>
                                                    {new Date(shipment.pickup.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;
