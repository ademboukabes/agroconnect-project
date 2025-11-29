import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft } from 'lucide-react';

const CreateShipment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        productType: '',
        quantity: '',
        weight: '',
        pickupAddress: '',
        pickupDate: '',
        deliveryAddress: '',
        notes: ''
    });

    // Pour simplifier, on utilise des coordonnées fixes pour le moment
    // Dans une vraie app, on utiliserait un géocodeur ou une carte pour sélectionner
    const defaultCoordinates = {
        alger: [3.0588, 36.7538],
        blida: [2.8277, 36.4703],
        oran: [-0.6337, 35.6969]
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulation de géocodage basique
            const pickupLocation = {
                coordinates: defaultCoordinates.blida // Par défaut Blida
            };
            const deliveryLocation = {
                coordinates: defaultCoordinates.alger // Par défaut Alger
            };

            const payload = {
                productType: formData.productType,
                quantity: Number(formData.quantity),
                weight: Number(formData.weight),
                pickup: {
                    address: formData.pickupAddress,
                    location: pickupLocation,
                    date: formData.pickupDate
                },
                delivery: {
                    address: formData.deliveryAddress,
                    location: deliveryLocation
                },
                notes: formData.notes
            };

            await api.post('/shipments', payload);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating shipment:', error);
            alert('Erreur lors de la création de la demande');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Retour
            </button>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Nouvelle demande de transport
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Remplissez les détails de votre expédition pour trouver un transporteur.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                                    Type de produit
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="productType"
                                        id="productType"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        placeholder="Ex: Tomates, Blé, Pommes de terre..."
                                        value={formData.productType}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                    Quantité (unités)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="quantity"
                                        id="quantity"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                    Poids total (tonnes)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="weight"
                                        id="weight"
                                        step="0.1"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700">
                                    Adresse de ramassage
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="pickupAddress"
                                        id="pickupAddress"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={formData.pickupAddress}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">
                                    Date de ramassage
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="datetime-local"
                                        name="pickupDate"
                                        id="pickupDate"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={formData.pickupDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                                    Adresse de livraison
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="deliveryAddress"
                                        id="deliveryAddress"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={formData.deliveryAddress}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                    Notes supplémentaires
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={3}
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={formData.notes}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {loading ? 'Création...' : 'Créer la demande'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateShipment;
