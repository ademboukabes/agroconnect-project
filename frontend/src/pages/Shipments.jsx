import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Package, Plus, MapPin, Calendar, Clock, Filter, ArrowRight, Search } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Select } from '../components/ui/Input';

const Shipments = () => {
    const { user } = useAuth();
    const [shipments, setShipments] = useState([]);
    const [availableShipments, setAvailableShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(user?.role === 'transporter' ? 'mydeliveries' : 'all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

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

    const getStatusVariant = (status) => {
        const variants = {
            pending: 'warning',
            accepted: 'primary',
            in_transit: 'primary',
            delivered: 'success',
            cancelled: 'danger'
        };
        return variants[status] || 'secondary';
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-DZ', {
            style: 'currency',
            currency: 'DZD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const filteredShipments = (shipments || []).filter(s => {
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchesSearch = s.productType?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const ShipmentCard = ({ shipment }) => (
        <Link to={`/shipments/${shipment._id}`} className="group">
            <Card className="hover:!border-primary-200 transition-all duration-300 h-full overflow-hidden">
                <CardBody className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                <Package className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">{shipment.productType}</h3>
                                <p className="text-sm text-slate-500 font-medium">{shipment.weight} tonnes</p>
                            </div>
                        </div>
                        <Badge variant={getStatusVariant(shipment.status)}>
                            {getStatusText(shipment.status)}
                        </Badge>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex flex-col items-center">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <div className="w-0.5 h-6 bg-slate-100 my-1" />
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                                <p className="text-sm font-bold text-slate-700 truncate">{shipment.pickup?.city || 'Départ inconnu'}</p>
                                <p className="text-sm font-bold text-slate-700 truncate">{shipment.delivery?.city || 'Destination inconnue'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(shipment.pickup?.date || shipment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Offre</p>
                            <p className="text-xl font-extrabold text-primary-600">
                                {shipment.price ? formatPrice(shipment.price) : 'À définir'}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                            <ArrowRight className="h-5 w-5" />
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Link>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="relative">
                    <div className="h-16 w-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                    <Package className="h-6 w-6 text-primary-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-slate-500 font-bold animate-pulse">Chargement des expéditions...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {isClient ? 'Mes Expéditions' : 'Livraisons'}
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        {isClient ? 'Suivez et gérez l\'acheminement de vos marchandises.' : 'Consultez vos missions en cours et trouvez de nouvelles opportunités.'}
                    </p>
                </div>
                {isClient && (
                    <Link to="/create-shipment">
                        <Button size="lg" icon={Plus} className="shadow-xl shadow-primary-200">
                            Nouvelle demande
                        </Button>
                    </Link>
                )}
            </div>

            {/* Controls Section */}
            <Card className="!rounded-[2rem] border-none shadow-sm">
                <CardBody className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
                    {isTransporter && (
                        <div className="flex p-1 bg-slate-100 rounded-xl md:mr-6 w-full md:w-auto">
                            <button
                                onClick={() => setActiveTab('mydeliveries')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'mydeliveries' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Mes Missions ({shipments.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('available')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'available' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Opportunités ({availableShipments.length})
                            </button>
                        </div>
                    )}

                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher par produit..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-64">
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: 'all', label: 'Tous les statuts' },
                                { value: 'pending', label: 'En attente' },
                                { value: 'accepted', label: 'Accepté' },
                                { value: 'in_transit', label: 'En transit' },
                                { value: 'delivered', label: 'Livré' },
                            ]}
                            className="bg-slate-50 border-none"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* List Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isClient && (
                    filteredShipments.length > 0 ? (
                        filteredShipments.map(s => <ShipmentCard key={s._id} shipment={s} />)
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center text-center">
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                                <Package className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune expédition</h3>
                            <p className="text-slate-500 font-medium max-w-sm">
                                Vous n'avez pas encore d'expéditions correspondant à vos critères.
                            </p>
                        </div>
                    )
                )}

                {isTransporter && activeTab === 'mydeliveries' && (
                    shipments.length > 0 ? (
                        shipments.map(s => <ShipmentCard key={s._id} shipment={s} />)
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center text-center">
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                                <Package className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune mission</h3>
                            <p className="text-slate-500 font-medium max-w-sm">
                                Vous n'avez pas encore de missions acceptées. Explorez les opportunités !
                            </p>
                        </div>
                    )
                )}

                {isTransporter && activeTab === 'available' && (
                    availableShipments.length > 0 ? (
                        availableShipments.map(s => <ShipmentCard key={s._id} shipment={s} />)
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center text-center">
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                                <Package className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune opportunité</h3>
                            <p className="text-slate-500 font-medium max-w-sm">
                                Il n'y a pas de nouvelles demandes de transport pour le moment. Revenez plus tard !
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Shipments;
