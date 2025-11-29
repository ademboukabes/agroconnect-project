import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Lock, Briefcase, Truck, Save, AlertCircle } from 'lucide-react';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile state
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        address: {
            street: '',
            city: '',
            wilaya: '',
            postalCode: ''
        }
    });

    // Role-specific state
    const [roleProfile, setRoleProfile] = useState({});

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || { street: '', city: '', wilaya: '', postalCode: '' }
            });

            if (user.role === 'transporter' && user.transporterProfile) {
                setRoleProfile({
                    name: user.transporterProfile.name || '',
                    licenseNumber: user.transporterProfile.licenseNumber || '',
                    licenseType: user.transporterProfile.licenseType || 'Permis B',
                    vehicleType: user.transporterProfile.vehicleType || 'Camion'
                });
            } else if (user.role === 'user' && user.clientProfile) {
                setRoleProfile({
                    name: user.clientProfile.name || '',
                    businessType: user.clientProfile.businessType || 'agriculteur'
                });
            }
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRoleProfileChange = (e) => {
        const { name, value } = e.target;
        setRoleProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.put('/users/profile', profileData);
            if (response.data.success) {
                updateUser(response.data.data.user);
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRoleProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const endpoint = user.role === 'transporter' ? '/users/transporter-profile' : '/users/client-profile';
            const response = await api.put(endpoint, roleProfile);
            if (response.data.success) {
                updateUser(response.data.data.user);
                setMessage({ type: 'success', text: 'Profil métier mis à jour avec succès' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            return;
        }

        setLoading(true);
        try {
            const response = await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors du changement de mot de passe' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-gray-500 mt-1">Gérez vos informations personnelles et vos préférences</p>
            </div>

            {message.text && (
                <div className={`flex items-center gap-2 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Informations Personnelles</h2>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                            <input
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rue</label>
                            <input
                                type="text"
                                name="address.street"
                                value={profileData.address.street}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                            <input
                                type="text"
                                name="address.city"
                                value={profileData.address.city}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Wilaya</label>
                            <input
                                type="text"
                                name="address.wilaya"
                                value={profileData.address.wilaya}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                            <input
                                type="text"
                                name="address.postalCode"
                                value={profileData.address.postalCode}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        Enregistrer les modifications
                    </button>
                </form>
            </div>

            {/* Role-specific Profile */}
            {user?.role === 'transporter' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Profil Transporteur</h2>
                    </div>

                    <form onSubmit={handleUpdateRoleProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom commercial</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={roleProfile.name || ''}
                                    onChange={handleRoleProfileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de permis</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={roleProfile.licenseNumber || ''}
                                    onChange={handleRoleProfileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type de permis</label>
                                <select
                                    name="licenseType"
                                    value={roleProfile.licenseType || 'Permis B'}
                                    onChange={handleRoleProfileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="Permis B">Permis B</option>
                                    <option value="Permis C">Permis C</option>
                                    <option value="Permis C1">Permis C1</option>
                                    <option value="Permis C2">Permis C2</option>
                                    <option value="Permis D">Permis D</option>
                                    <option value="Permis E">Permis E</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type de véhicule</label>
                                <input
                                    type="text"
                                    name="vehicleType"
                                    value={roleProfile.vehicleType || ''}
                                    onChange={handleRoleProfileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            Enregistrer le profil transporteur
                        </button>
                    </form>
                </div>
            )}

            {user?.role === 'user' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Profil Client</h2>
                    </div>

                    <form onSubmit={handleUpdateRoleProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={roleProfile.name || ''}
                                    onChange={handleRoleProfileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'activité</label>
                                <select
                                    name="businessType"
                                    value={roleProfile.businessType || 'agriculteur'}
                                    onChange={handleRoleProfileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="agriculteur">Agriculteur</option>
                                    <option value="coopérative">Coopérative</option>
                                    <option value="entreprise">Entreprise</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            Enregistrer le profil client
                        </button>
                    </form>
                </div>
            )}

            {/* Password Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Changer le mot de passe</h2>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <Lock className="h-4 w-4" />
                        Changer le mot de passe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
