import { useAuth } from '../context/AuthContext';
import ClientDashboard from '../components/ClientDashboard';
import TransporterDashboard from '../components/TransporterDashboard';
import { Badge } from '../components/ui/Badge';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Tableau de bord
                        </h1>
                        <Badge variant="primary">
                            {user?.role === 'user' ? 'Client' : 'Transporteur'}
                        </Badge>
                    </div>
                    <p className="text-slate-500 font-medium">
                        {user?.role === 'user'
                            ? `Bienvenue, ${user?.name}. Aperçu de vos activités logistiques.`
                            : `Bienvenue, ${user?.name}. Gérez votre flotte et vos livraisons.`}
                    </p>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                    Connecté en tant que <span className="text-slate-900">{user?.name}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="min-h-[500px]">
                {user?.role === 'user' ? <ClientDashboard /> : <TransporterDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;
