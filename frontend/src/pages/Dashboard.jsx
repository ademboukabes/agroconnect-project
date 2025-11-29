import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ClientDashboard from '../components/ClientDashboard';
import TransporterDashboard from '../components/TransporterDashboard';
import {
    LayoutDashboard,
    Package,
    Truck,
    Settings,
    LogOut,
    Menu,
    Bell,
    Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);
    const location = useLocation();

    const navigation = [
        { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Mes Expéditions', href: '/shipments', icon: Package },
        ...(user?.role === 'transporter' ? [
            { name: 'Ma Flotte', href: '/vehicles', icon: Truck }
        ] : []),
        { name: 'Paramètres', href: '/settings', icon: Settings },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleMarkAllAsRead = () => {
        setHasUnread(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Link to="/dashboard" className="flex items-center justify-center h-16 bg-gradient-to-r from-primary to-secondary px-6 cursor-pointer hover:opacity-90 transition-opacity">
                    <Sparkles className="h-8 w-8 text-white mr-2" />
                    <span className="text-xl font-bold text-white tracking-tight">SELA3LII</span>
                </Link>

                <nav className="mt-8 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="flex-1 flex justify-end items-center space-x-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="p-2 rounded-full text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors relative focus:outline-none"
                                >
                                    <Bell className="h-6 w-6" />
                                    {hasUnread && (
                                        <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                                    )}
                                </button>

                                {isNotificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all">
                                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                                            <button
                                                onClick={handleMarkAllAsRead}
                                                className="text-xs text-primary font-medium cursor-pointer hover:underline focus:outline-none"
                                            >
                                                Tout marquer comme lu
                                            </button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm text-gray-800 font-medium">Bienvenue sur SELA3LII !</p>
                                                    {hasUnread && <span className="h-2 w-2 bg-primary rounded-full"></span>}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Il y a 2 minutes</p>
                                            </div>
                                            <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                                                <p className="text-sm text-gray-800 font-medium">Mise à jour du système</p>
                                                <p className="text-xs text-gray-500 mt-1">La plateforme a été mise à jour avec succès.</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl text-center">
                                            <Link to="/notifications" className="text-xs font-medium text-primary hover:text-primary-dark">
                                                Voir toutes les notifications
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center pl-4 border-l border-gray-200">
                                <div className="flex flex-col items-end mr-3 hidden sm:flex">
                                    <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                                    <span className="text-xs text-gray-500 capitalize">{user?.role === 'user' ? 'Client' : 'Transporteur'}</span>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 animate-fadeIn">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Tableau de bord
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {user?.role === 'user'
                                    ? 'Aperçu de vos activités logistiques.'
                                    : 'Gérez votre flotte et vos livraisons.'}
                            </p>
                        </div>

                        {user?.role === 'user' ? <ClientDashboard /> : <TransporterDashboard />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
