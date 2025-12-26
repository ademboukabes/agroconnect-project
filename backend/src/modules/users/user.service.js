import User from './user.model.js';

/**
 * Service pour la gestion des profils utilisateurs
 */

/**
 * Obtenir le profil complet d'un utilisateur
 */
export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }
    return user;
};

/**
 * Mettre à jour le profil de base
 */
export const updateProfile = async (userId, profileData) => {
    const { name, phone, address } = profileData;

    const user = await User.findByIdAndUpdate(
        userId,
        { name, phone, address },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }

    return user;
};

/**
 * Mettre à jour le profil client
 */
export const updateClientProfile = async (userId, clientData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }

    if (user.role !== 'user' && user.role !== 'admin') {
        throw new Error('Seuls les clients peuvent mettre à jour ce profil');
    }

    user.clientProfile = {
        ...user.clientProfile,
        ...clientData
    };

    await user.save();

    return user;
};

/**
 * Mettre à jour le profil transporteur
 */
export const updateTransporterProfile = async (userId, transporterData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }

    if (user.role !== 'transporter' && user.role !== 'admin') {
        throw new Error('Seuls les transporteurs peuvent mettre à jour ce profil');
    }

    user.transporterProfile = {
        ...user.transporterProfile,
        ...transporterData
    };

    await user.save();

    return user;
};

/**
 * Basculer la disponibilité du transporteur
 */
export const toggleAvailability = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }

    if (user.role !== 'transporter') {
        throw new Error('Seuls les transporteurs peuvent modifier leur disponibilité');
    }

    // Utiliser findByIdAndUpdate pour éviter les problèmes de validation
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                'transporterProfile.isAvailable': !user.transporterProfile?.isAvailable
            }
        },
        { new: true, runValidators: false }
    ).select('-password');

    return updatedUser;
};
