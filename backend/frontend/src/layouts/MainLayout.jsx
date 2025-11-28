import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Truck, Map, Package, User } from 'lucide-react';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Truck className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold text-gray-900">AgroConnect</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-700">
                                <User className="h-5 w-5" />
                                <span className="font-medium">{user?.name}</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 capitalize">
                                    {user?.role === 'user' ? 'Client' : 'Transporteur'}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors"
                                title="Déconnexion"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
