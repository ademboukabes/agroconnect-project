import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Package, MapPin, Calendar, DollarSign, Info, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const CreateShipment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
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

    // Liste des 48 Wilayas d'Algérie
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

    const calculateDistance = (city1Name, city2Name) => {
        if (!city1Name || !city2Name) return 0;
        const city1 = wilayas.find(c => c.name === city1Name);
        const city2 = wilayas.find(c => c.name === city2Name);
        if (!city1 || !city2) return 0;
        const [lon1, lat1] = city1.coords;
        const [lon2, lat2] = city2.coords;
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const updatePrice = (newFormData) => {
        const distance = calculateDistance(newFormData.pickupCity, newFormData.deliveryCity);
        const weight = Number(newFormData.weight);
        if ((distance > 0 || (newFormData.pickupCity === newFormData.deliveryCity && newFormData.pickupCity)) && weight > 0) {
            const isSameWilaya = newFormData.pickupCity === newFormData.deliveryCity;
            const basePrice = 1200;
            const pricePerKm = 25;
            const pricePerKg = 8;
            let estimated = isSameWilaya ? 1800 + (weight * pricePerKg * 0.4) : basePrice + (distance * pricePerKm) + (weight * pricePerKg);
            setFormData(prev => ({ ...prev, price: Math.round(estimated / 100) * 100 }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        if (['pickupCity', 'deliveryCity', 'weight'].includes(name)) updatePrice(newFormData);
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
                weight: Number(formData.weight),
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
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const steps = [
        { id: 1, title: 'Produit', icon: Package },
        { id: 2, title: 'Itinéraire', icon: MapPin },
        { id: 3, title: 'Paiement', icon: DollarSign },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)} icon={ArrowLeft}>Retour</Button>
                <div className="flex items-center gap-2">
                    {steps.map((s) => (
                        <div key={s.id} className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= s.id ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
                                }`}>
                                <s.icon className="h-5 w-5" />
                            </div>
                            {s.id !== 3 && <div className={`w-8 h-1 mx-2 rounded-full transition-colors duration-300 ${step > s.id ? 'bg-primary-600' : 'bg-slate-100'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="!rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                        <CardHeader className="p-8 pb-0 border-none">
                            <h2 className="text-3xl font-bold text-slate-900">
                                {step === 1 ? 'Détails du produit' : step === 2 ? 'Lieux & Dates' : 'Confirmation du prix'}
                            </h2>
                            <p className="text-slate-500 font-medium">Étape {step} sur 3 • {steps[step - 1].title}</p>
                        </CardHeader>

                        <CardBody className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {step === 1 && (
                                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                        <Input
                                            label="Nature de la marchandise"
                                            name="productType"
                                            placeholder="Ex: Tomates, Blé, Engrais..."
                                            required
                                            value={formData.productType}
                                            onChange={handleChange}
                                        />
                                        <div className="grid grid-cols-2 gap-6">
                                            <Input
                                                label="Quantité"
                                                name="quantity"
                                                type="number"
                                                placeholder="Nombre d'unités"
                                                required
                                                value={formData.quantity}
                                                onChange={handleChange}
                                            />
                                            <Input
                                                label="Poids total (Kg)"
                                                name="weight"
                                                type="number"
                                                placeholder="Poids total"
                                                required
                                                value={formData.weight}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="button" onClick={nextStep} icon={ChevronRight} className="h-12 px-8">Continuer</Button>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                        <div className="p-6 bg-slate-50 rounded-[2rem] space-y-6 border border-slate-100">
                                            <h4 className="font-bold flex items-center gap-2 text-slate-900">
                                                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">A</div>
                                                Point de départ
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <Select
                                                    label="Wilaya"
                                                    name="pickupCity"
                                                    required
                                                    value={formData.pickupCity}
                                                    onChange={handleChange}
                                                    options={[
                                                        { value: '', label: 'Séléctionner' },
                                                        ...wilayas.map(w => ({ value: w.name, label: `${w.code} - ${w.name}` }))
                                                    ]}
                                                />
                                                <Input
                                                    label="Adresse précise"
                                                    name="pickupAddress"
                                                    placeholder="Commune, quartier..."
                                                    required
                                                    value={formData.pickupAddress}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <Input
                                                label="Date de ramassage"
                                                name="pickupDate"
                                                type="datetime-local"
                                                required
                                                value={formData.pickupDate}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="p-6 bg-slate-50 rounded-[2rem] space-y-6 border border-slate-100">
                                            <h4 className="font-bold flex items-center gap-2 text-slate-900">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">B</div>
                                                Destination
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <Select
                                                    label="Wilaya"
                                                    name="deliveryCity"
                                                    required
                                                    value={formData.deliveryCity}
                                                    onChange={handleChange}
                                                    options={[
                                                        { value: '', label: 'Séléctionner' },
                                                        ...wilayas.map(w => ({ value: w.name, label: `${w.code} - ${w.name}` }))
                                                    ]}
                                                />
                                                <Input
                                                    label="Adresse précise"
                                                    name="deliveryAddress"
                                                    placeholder="Lieu de livraison..."
                                                    required
                                                    value={formData.deliveryAddress}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <Button type="button" variant="secondary" onClick={prevStep} icon={ChevronLeft}>Précédent</Button>
                                            <Button type="button" onClick={nextStep} icon={ChevronRight} className="h-12 px-8">Continuer</Button>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                        <div className="text-center p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                                            <div className="h-16 w-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                                <DollarSign className="h-8 w-8" />
                                            </div>
                                            <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-2">Prix Estimé</p>
                                            <h3 className="text-5xl font-extrabold text-emerald-900 mb-2">
                                                {formData.price ? new Intl.NumberFormat('fr-DZ').format(formData.price) : '0'} <span className="text-2xl font-bold">DZD</span>
                                            </h3>
                                            <p className="text-emerald-600/70 text-sm font-medium">Ce prix est une base de négociation.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <Input
                                                label="Ajuster le prix (optionnel)"
                                                name="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="h-14 text-xl font-bold text-emerald-700"
                                            />
                                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-800">
                                                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                                <p className="text-xs font-medium leading-relaxed">
                                                    Un prix juste augmente de 80% vos chances d'être accepté rapidement par un transporteur qualifié.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Instructions spéciales</label>
                                            <textarea
                                                name="notes"
                                                rows={4}
                                                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 outline-none"
                                                placeholder="Détails sur l'accès, fragilité, urgence..."
                                                value={formData.notes}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="flex justify-between pt-4">
                                            <Button type="button" variant="secondary" onClick={prevStep} icon={ChevronLeft}>Précédent</Button>
                                            <Button type="submit" disabled={loading} className="h-14 px-12 text-lg shadow-xl shadow-primary-200">
                                                {loading ? 'Création...' : 'Confirmer & Publier'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </CardBody>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="!rounded-3xl border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                        <div className="p-8 space-y-6 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Package className="h-24 w-24" />
                            </div>
                            <h4 className="text-xl font-bold">Résumé</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Marcheandise</span>
                                    <span className="font-bold">{formData.productType || '--'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Poids</span>
                                    <span className="font-bold">{formData.weight ? `${formData.weight} Kg` : '--'}</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">A</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Départ</p>
                                            <p className="text-sm font-bold truncate">{formData.pickupCity || 'Non séléctionné'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">B</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Arrivée</p>
                                            <p className="text-sm font-bold truncate">{formData.deliveryCity || 'Non séléctionné'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 border-t border-white/10 text-center">
                            <p className="text-xs text-slate-400 mb-1">Total estimé</p>
                            <p className="text-2xl font-bold">{formData.price ? `${new Intl.NumberFormat('fr-DZ').format(formData.price)} DZD` : '--'}</p>
                        </div>
                    </Card>

                    <div className="p-8 bg-primary-50 rounded-[2.5rem] border border-primary-100 flex flex-col items-center text-center space-y-4">
                        <div className="h-12 w-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-6">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h5 className="font-bold text-primary-900">Publiez en confiance</h5>
                        <p className="text-xs text-primary-700/70 font-medium leading-relaxed">
                            Votre demande sera visible par des centaines de transporteurs certifiés dans toute l'Algérie.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateShipment;
