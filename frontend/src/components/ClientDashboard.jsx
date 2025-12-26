import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Package, MapPin, Calendar, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
    <Card className="flex-1">
        <CardBody className="flex items-center p-6">
            <div className={`p-3 rounded-xl mr-4 ${colorClass}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </CardBody>
    </Card>
);

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

    const getStatusVariant = (status) => {
        switch (status) {
            case 'delivered': return 'success';
            case 'in_transit': return 'info';
            case 'accepted': return 'primary';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'gray';
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

    const stats = {
        total: shipments.length,
        active: shipments.filter(s => ['accepted', 'in_transit'].includes(s.status)).length,
        delivered: shipments.filter(s => s.status === 'delivered').length,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Expéditions"
                    value={stats.total}
                    icon={Package}
                    colorClass="bg-slate-100 text-slate-600"
                />
                <StatCard
                    label="En Cours"
                    value={stats.active}
                    icon={Clock}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    label="Livrées"
                    value={stats.delivered}
                    icon={CheckCircle2}
                    colorClass="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Expéditions Récentes</h2>
                    <p className="text-sm text-slate-500">Suivez l'état de vos dernières demandes</p>
                </div>
                <Link to="/create-shipment">
                    <Button icon={Plus}>Nouvelle demande</Button>
                </Link>
            </div>

            {/* Content Container */}
            {loading ? (
                <div className="flex flex-col justify-center items-center h-64 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-primary-600 animate-spin"></div>
                    </div>
                    <p className="mt-4 text-slate-500 font-medium">Chargement de vos données...</p>
                </div>
            ) : shipments.length === 0 ? (
                <Card className="border-dashed border-2 py-16">
                    <CardBody className="flex flex-col items-center">
                        <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
                            <Package className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Pas encore d'expédition</h3>
                        <p className="text-slate-500 text-center max-w-sm mb-8 font-medium">
                            Créez votre première demande de transport pour commencer à expédier vos produits agricoles.
                        </p>
                        <Link to="/create-shipment">
                            <Button variant="secondary" icon={Plus}>Créer ma première demande</Button>
                        </Link>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {shipments.map((shipment) => (
                        <Card key={shipment._id} hover className="group flex flex-col h-full overflow-hidden">
                            <CardBody className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center transition-colors group-hover:bg-primary-600 group-hover:text-white">
                                            <Package className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                                                {shipment.productType}
                                            </h3>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                {shipment.quantity} {shipment.unit || 'unités'}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusVariant(shipment.status)}>
                                        {getStatusLabel(shipment.status)}
                                    </Badge>
                                </div>

                                <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                    <div className="relative">
                                        <div className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 ring-4 ring-emerald-50" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Point de départ</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{shipment.pickup.address}</p>
                                        <div className="flex items-center mt-1 text-xs text-slate-400 font-medium">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(shipment.pickup.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-400 ring-4 ring-slate-50" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Destination</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{shipment.delivery.address}</p>
                                    </div>
                                </div>
                            </CardBody>

                            <Link
                                to={`/shipments/${shipment._id}`}
                                className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-primary-50/50 transition-colors"
                            >
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-primary-700">Détails de l'envoi</span>
                                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;
