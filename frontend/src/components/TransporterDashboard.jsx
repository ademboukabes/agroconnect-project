import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Truck, MapPin, CheckCircle } from 'lucide-react';

const TransporterDashboard = () => {
    const [availableShipments, setAvailableShipments] = useState([]);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [availableRes, myRes] = await Promise.all([
                    api.get('/shipments/available'),
                    api.get('/shipments/my-deliveries')
                ]);

                if (availableRes.data.success) {
                    setAvailableShipments(availableRes.data.data.shipments);
                }
                if (myRes.data.success) {
                    setMyDeliveries(myRes.data.data.shipments);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Section Véhicules (Résumé) */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Ma Flotte</h2>
                    <Link to="/vehicles" className="text-sm text-primary hover:text-secondary">
                        Gérer mes véhicules &rarr;
                    </Link>
                </div>
                {/* TODO: Afficher résumé véhicules */}
            </div>

            {/* Section Livraisons en cours */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Mes Livraisons en cours</h2>
                {myDeliveries.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucune livraison en cours.</p>
                ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {myDeliveries.map((shipment) => (
                            <div key={shipment._id} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center">
                                        <Truck className="h-6 w-6 text-primary" />
                                        <h3 className="ml-2 text-lg font-medium text-gray-900 truncate">
                                            {shipment.productType}
                                        </h3>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-500">
                                        <p className="flex items-center mt-1">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {shipment.delivery.address}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            to={`/shipments/${shipment._id}`}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary hover:bg-secondary"
                                        >
                                            Gérer
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Section Demandes Disponibles */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Demandes Disponibles</h2>
                {availableShipments.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucune demande disponible pour le moment.</p>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {availableShipments.map((shipment) => (
                                <li key={shipment._id}>
                                    <Link to={`/shipments/${shipment._id}`} className="block hover:bg-gray-50">
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-primary truncate">
                                                    {shipment.productType} - {shipment.weight} tonnes
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {shipment.price ? `${shipment.price} DZD` : 'Prix à définir'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                        {shipment.pickup.city || shipment.pickup.address} → {shipment.delivery.city || shipment.delivery.address}
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
        </div>
    );
};

export default TransporterDashboard;
