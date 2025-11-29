import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, ArrowRight, User, Mail, Lock, Phone, FileText, Briefcase } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        phone: '',
        licenseNumber: '',
        licenseType: 'Permis B'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur d\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark/10 via-background to-secondary-light/10 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-16 w-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
                        <Truck className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Créer un compte
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Rejoignez la communauté SELA3LII
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-lg py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-white/50">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-md text-sm animate-pulse">
                                <p className="font-medium">Erreur</p>
                                <p>{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom complet
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors"
                                    placeholder="Jean Dupont"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors"
                                    placeholder="vous@exemple.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors"
                                    placeholder="05 55 ..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Je suis
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="role"
                                    name="role"
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 transition-colors bg-white"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="user">Client (Agriculteur/Entreprise)</option>
                                    <option value="transporter">Transporteur</option>
                                </select>
                            </div>
                        </div>

                        {formData.role === 'transporter' && (
                            <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100 animate-fadeIn">
                                <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                                    <Truck className="h-4 w-4 mr-2 text-primary" />
                                    Informations Transporteur
                                </h4>
                                <div>
                                    <label htmlFor="licenseNumber" className="block text-xs font-medium text-gray-500 mb-1">
                                        Numéro de permis
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="licenseNumber"
                                            name="licenseNumber"
                                            type="text"
                                            required
                                            className="focus:ring-primary focus:border-primary block w-full pl-9 sm:text-sm border-gray-300 rounded-lg py-2"
                                            placeholder="Numéro de permis"
                                            value={formData.licenseNumber}
                                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="licenseType" className="block text-xs font-medium text-gray-500 mb-1">
                                        Type de permis
                                    </label>
                                    <select
                                        id="licenseType"
                                        name="licenseType"
                                        className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-lg py-2"
                                        value={formData.licenseType}
                                        onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                                    >
                                        <option value="Permis B">Permis B (Véhicule léger)</option>
                                        <option value="Permis C">Permis C (Poids lourd)</option>
                                        <option value="Permis C1">Permis C1 (Petit poids lourd)</option>
                                        <option value="Permis C2">Permis C2</option>
                                        <option value="Permis D">Permis D (Transport en commun)</option>
                                        <option value="Permis E">Permis E (Remorque)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Inscription...' : 'S\'inscrire'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 rounded-full">
                                    Déjà un compte ?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors group"
                            >
                                Se connecter
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
