import { useAuth } from '../context/AuthContext';
import ClientDashboard from '../components/ClientDashboard';
import TransporterDashboard from '../components/TransporterDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Bonjour, {user?.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {user?.role === 'user'
                        ? 'Gérez vos expéditions et suivez vos marchandises.'
                        : 'Gérez votre flotte et trouvez de nouvelles opportunités.'}
                </p>
            </div>

            {user?.role === 'user' ? <ClientDashboard /> : <TransporterDashboard />}
        </div>
    );
};

export default Dashboard;
