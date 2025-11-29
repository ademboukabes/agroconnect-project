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
        price: '',
        pickupCity: '',
        pickupAddress: '',
        pickupDate: '',
        deliveryCity: '',
        deliveryAddress: '',
        notes: ''
    });

    // Liste des 48 Wilayas d'Algérie avec coordonnées approximatives (centre)
    const wilayas = [
        { code: '01', name: 'Adrar', coords: [0.2938, 27.8742] },
        { code: '02', name: 'Chlef', coords: [1.3289, 36.1647] },
        { code: '03', name: 'Laghouat', coords: [2.8651, 33.8000] },
        { code: '04', name: 'Oum El Bouaghi', coords: [7.1136, 35.8754] },
        { code: '05', name: 'Batna', coords: [6.1735, 35.5557] },
        { code: '06', name: 'Béjaïa', coords: [5.0843, 36.7509] },
        { code: '07', name: 'Biskra', coords: [5.7280, 34.8504] },
        { code: '08', name: 'Béchar', coords: [-2.2167, 31.6167] },
        { code: '09', name: 'Blida', coords: [2.8277, 36.4700] },
        { code: '10', name: 'Bouira', coords: [3.9000, 36.3748] },
        { code: '11', name: 'Tamanrasset', coords: [5.5228, 22.7868] },
        { code: '12', name: 'Tébessa', coords: [8.1242, 35.4041] },
        { code: '13', name: 'Tlemcen', coords: [-1.3108, 34.8783] },
        { code: '14', name: 'Tiaret', coords: [1.3164, 35.3710] },
        { code: '15', name: 'Tizi Ouzou', coords: [4.0459, 36.7118] },
        { code: '16', name: 'Alger', coords: [3.0588, 36.7538] },
        { code: '17', name: 'Djelfa', coords: [3.2630, 34.6728] },
        { code: '18', name: 'Jijel', coords: [5.7667, 36.8206] },
        { code: '19', name: 'Sétif', coords: [5.4111, 36.1898] },
        { code: '20', name: 'Saïda', coords: [0.1503, 34.8303] },
        { code: '21', name: 'Skikda', coords: [6.9092, 36.8792] },
        { code: '22', name: 'Sidi Bel Abbès', coords: [-0.6308, 35.1899] },
        { code: '23', name: 'Annaba', coords: [7.7667, 36.9000] },
        { code: '24', name: 'Guelma', coords: [7.4289, 36.4621] },
        { code: '25', name: 'Constantine', coords: [6.6147, 36.3650] },
        { code: '26', name: 'Médéa', coords: [2.7539, 36.2642] },
        { code: '27', name: 'Mostaganem', coords: [0.0892, 35.9398] },
        { code: '28', name: 'M\'Sila', coords: [4.5419, 35.7058] },
        { code: '29', name: 'Mascara', coords: [0.1403, 35.3966] },
        { code: '30', name: 'Ouargla', coords: [5.3250, 31.9493] },
        { code: '31', name: 'Oran', coords: [-0.6337, 35.6969] },
        { code: '32', name: 'El Bayadh', coords: [1.0193, 33.6832] },
        { code: '33', name: 'Illizi', coords: [8.4833, 26.4833] },
        { code: '34', name: 'Bordj Bou Arreridj', coords: [4.7692, 36.0732] },
        { code: '35', name: 'Boumerdès', coords: [3.4772, 36.7598] },
        { code: '36', name: 'El Tarf', coords: [8.3138, 36.7672] },
        { code: '37', name: 'Tindouf', coords: [-8.1474, 27.6056] },
        { code: '38', name: 'Tissemsilt', coords: [1.8109, 35.6072] },
        { code: '39', name: 'El Oued', coords: [6.8632, 33.3678] },
        { code: '40', name: 'Khenchela', coords: [7.1433, 35.4358] },
        { code: '41', name: 'Souk Ahras', coords: [7.9511, 36.2864] },
        { code: '42', name: 'Tipaza', coords: [2.4475, 36.5942] },
        { code: '43', name: 'Mila', coords: [6.2645, 36.4503] },
        { code: '44', name: 'Aïn Defla', coords: [1.9379, 36.2596] },
        { code: '45', name: 'Naâma', coords: [-0.3124, 32.7556] },
        { code: '46', name: 'Aïn Témouchent', coords: [-1.1404, 35.2975] },
        { code: '47', name: 'Ghardaïa', coords: [3.6767, 32.4909] },
        { code: '48', name: 'Relizane', coords: [0.5563, 35.7373] }
    ];

    // Calcul de distance (Haversine formula)
    const calculateDistance = (city1Name, city2Name) => {
        if (!city1Name || !city2Name) return 0;

        const city1 = wilayas.find(c => c.name === city1Name);
        const city2 = wilayas.find(c => c.name === city2Name);

        if (!city1 || !city2) return 0;

        const [lon1, lat1] = city1.coords;
        const [lon2, lat2] = city2.coords;

        const R = 6371; // Rayon de la terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Calcul automatique du prix
    const calculateEstimatedPrice = (distance, weight, isSameWilaya) => {
        if (!weight) return '';

        const basePrice = 1000; // Prix de base réduit
        const pricePerKm = 20; // Prix par km ajusté
        const pricePerKg = 10; // Prix par kg

        let estimated;

        if (isSameWilaya) {
            // Prix forfaitaire pour la même wilaya + supplément poids
            estimated = 1500 + (weight * pricePerKg * 0.5);
        } else {
            // Prix distance + poids
            estimated = basePrice + (distance * pricePerKm) + (weight * pricePerKg);
        }

        return Math.round(estimated / 100) * 100; // Arrondir à la centaine près
    };

    // Mise à jour automatique du prix
    const updatePrice = (newFormData) => {
        const isSameWilaya = newFormData.pickupCity === newFormData.deliveryCity;
        const distance = calculateDistance(newFormData.pickupCity, newFormData.deliveryCity);
        const weight = Number(newFormData.weight);

        if ((distance > 0 || isSameWilaya) && weight > 0) {
            const estimatedPrice = calculateEstimatedPrice(distance, weight, isSameWilaya);
            setFormData(prev => ({ ...prev, price: estimatedPrice }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);

        // Déclencher le calcul du prix si les champs pertinents changent
        if (['pickupCity', 'deliveryCity', 'weight'].includes(name)) {
            updatePrice(newFormData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const pickupCityData = wilayas.find(c => c.name === formData.pickupCity);
            const deliveryCityData = wilayas.find(c => c.name === formData.deliveryCity);

            const payload = {
                productType: formData.productType,
                quantity: Number(formData.quantity),
                weight: Number(formData.weight) / 1000, // Conversion Kg -> Tonnes pour le backend (si nécessaire) ou garder en Kg
                pickup: {
                    address: `${formData.pickupAddress}, ${formData.pickupCity}`,
                    location: { coordinates: pickupCityData?.coords || [0, 0] },
                    date: formData.pickupDate,
                    city: formData.pickupCity
                },
                delivery: {
                    address: `${formData.deliveryAddress}, ${formData.deliveryCity}`,
                    location: { coordinates: deliveryCityData?.coords || [0, 0] },
                    city: formData.deliveryCity
                },
                price: Number(formData.price),
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
                        <p>Remplissez les détails. Le prix sera estimé automatiquement mais vous pouvez le modifier.</p>
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
                                    Poids total (Kg)
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

                            {/* Pickup Section */}
                            <div className="sm:col-span-3">
                                <label htmlFor="pickupCity" className="block text-sm font-medium text-gray-700">
                                    Ville de départ (Wilaya)
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="pickupCity"
                                        name="pickupCity"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={formData.pickupCity}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionner une wilaya</option>
                                        {wilayas.map(city => (
                                            <option key={city.code} value={city.name}>{city.code} - {city.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700">
                                    Adresse précise (Départ)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="pickupAddress"
                                        id="pickupAddress"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        placeholder="Commune, Quartier, Rue..."
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

                            {/* Delivery Section */}
                            <div className="sm:col-span-3">
                                <label htmlFor="deliveryCity" className="block text-sm font-medium text-gray-700">
                                    Ville d'arrivée (Wilaya)
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="deliveryCity"
                                        name="deliveryCity"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={formData.deliveryCity}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionner une wilaya</option>
                                        {wilayas.map(city => (
                                            <option key={city.code} value={city.name}>{city.code} - {city.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                                    Adresse précise (Arrivée)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="deliveryAddress"
                                        id="deliveryAddress"
                                        required
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        placeholder="Commune, Quartier, Rue..."
                                        value={formData.deliveryAddress}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="sm:col-span-6">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Prix proposé (DZD)
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        required
                                        min="1"
                                        className="focus:ring-primary focus:border-primary block w-full pr-12 sm:text-sm border-gray-300 rounded-md p-2 border font-bold text-green-700"
                                        placeholder="Calcul automatique..."
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">DZD</span>
                                    </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Le prix est calculé automatiquement selon la distance et le poids, mais vous pouvez le modifier pour négocier.
                                </p>
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
