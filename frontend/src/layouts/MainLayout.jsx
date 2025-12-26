import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogOut,
    Truck,
    LayoutDashboard,
    Package,
    Settings as SettingsIcon,
    User as UserIcon,
    ChevronRight,
    PlusCircle,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
            }`}
    >
        <div className="flex items-center">
            <Icon className={`h-5 w-5 mr-3 transition-colors ${active ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`} />
            <span className="font-medium">{label}</span>
        </div>
        {active && <ChevronRight className="h-4 w-4 text-primary-400" />}
    </Link>
);

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
        { to: '/shipments', icon: Package, label: 'Expéditions' },
        { to: '/vehicles', icon: Truck, label: 'Véhicules' },
        { to: '/create-shipment', icon: PlusCircle, label: 'Nouvelle demande' },
        { to: '/settings', icon: SettingsIcon, label: 'Paramètres' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen p-6">
                <div className="flex items-center mb-10 px-2">
                    <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-200">
                        <Truck className="h-6 w-6" />
                    </div>
                    <span className="ml-3 text-xl font-bold tracking-tight text-slate-900">AgroConnect</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navigation.map((item) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            active={isActive(item.to)}
                        />
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="flex items-center p-2 mb-4 bg-slate-50 rounded-2xl">
                        <div className="h-10 w-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role === 'user' ? 'Client' : 'Transporteur'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full h-11 flex items-center justify-center space-x-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center">
                        <Truck className="h-6 w-6 text-primary-600" />
                        <span className="ml-2 text-lg font-bold">AgroConnect</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -mr-2 text-slate-600"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </main>
            </div>

            {/* Backdrop Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden p-6 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex items-center">
                        <Truck className="h-6 w-6 text-primary-600" />
                        <span className="ml-2 text-xl font-bold">AgroConnect</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="space-y-1">
                    {navigation.map((item) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            active={isActive(item.to)}
                        />
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full h-11 flex items-center justify-center space-x-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default MainLayout;
