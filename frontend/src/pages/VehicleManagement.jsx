import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const VehicleManagement = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        vehicleType: 'camion',
        capacity: '',
        licensePlate: '',
        model: '',
        year: new Date().getFullYear()
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await api.get('/vehicles');
            if (response.data.success) {
                setVehicles(response.data.data.vehicles);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
            try {
                await api.delete(`/vehicles/${id}`);
                setVehicles(vehicles.filter(v => v._id !== id));
            } catch (error) {
                console.error('Error deleting vehicle:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🚗 Début de l\'ajout de véhicule...');
        console.log('Données du formulaire:', formData);

        try {
            // Coordonnées par défaut (Alger) pour l'initialisation
            const payload = {
                ...formData,
                capacity: Number(formData.capacity),
                currentLocation: {
                    coordinates: [3.0588, 36.7538]
                }
            };

            console.log('📤 Envoi des données:', payload);

            const response = await api.post('/vehicles', payload);

            console.log('✅ Réponse reçue:', response.data);

            setShowForm(false);
            setFormData({
                vehicleType: 'camion',
                capacity: '',
                licensePlate: '',
                model: '',
                year: new Date().getFullYear()
            });

            alert('✅ Véhicule ajouté avec succès !');
            await fetchVehicles();
        } catch (error) {
            console.error('❌ Erreur complète:', error);
            console.error('❌ Réponse du serveur:', error.response?.data);
            console.error('❌ Status:', error.response?.status);

            const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
            alert(`❌ Erreur lors de l'ajout du véhicule:\n${errorMessage}`);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Retour
                </button>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Ajouter un véhicule
                </button>
            </div>

            {showForm && (
                <div className="bg-white shadow sm:rounded-lg mb-8 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Nouveau véhicule</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="camion">Camion</option>
                                    <option value="semi-remorque">Semi-remorque</option>
                                    <option value="camionnette">Camionnette</option>
                                    <option value="fourgon">Fourgon</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacité (tonnes)</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    step="0.1"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Immatriculation</label>
                                <input
                                    type="text"
                                    name="licensePlate"
                                    value={formData.licensePlate}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Modèle</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {vehicles.map((vehicle) => (
                        <li key={vehicle._id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-lg font-bold">
                                                {vehicle.vehicleType.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-gray-900">{vehicle.model}</h4>
                                        <p className="text-sm text-gray-500">
                                            {vehicle.licensePlate} • {vehicle.capacity} tonnes
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(vehicle._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VehicleManagement;
