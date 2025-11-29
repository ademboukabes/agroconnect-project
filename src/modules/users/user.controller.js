import {
    getUserProfile,
    updateProfile,
    updateClientProfile,
    updateTransporterProfile,
    toggleAvailability
} from './user.service.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await getUserProfile(req.user.id);

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Update basic profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await updateProfile(req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Profil mis à jour avec succès',
            data: { user }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Update client profile
// @route   PUT /api/users/client-profile
// @access  Private (Client only)
export const updateClientProfileController = async (req, res) => {
    try {
        const user = await updateClientProfile(req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Profil client mis à jour avec succès',
            data: { user }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil client:', error);
        const statusCode = error.message.includes('Seuls') ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Update transporter profile
// @route   PUT /api/users/transporter-profile
// @access  Private (Transporter only)
export const updateTransporterProfileController = async (req, res) => {
    try {
        const user = await updateTransporterProfile(req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Profil transporteur mis à jour avec succès',
            data: { user }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil transporteur:', error);
        const statusCode = error.message.includes('Seuls') ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Toggle transporter availability
// @route   PUT /api/users/toggle-availability
// @access  Private (Transporter only)
export const toggleTransporterAvailability = async (req, res) => {
    try {
        console.log('🔧 Toggle Availability - User ID:', req.user.id);
        console.log('🔧 Toggle Availability - User Role:', req.user.role);

        const user = await toggleAvailability(req.user.id);

        console.log('✅ Toggle Success - New availability:', user.transporterProfile?.isAvailable);

        res.status(200).json({
            success: true,
            message: `Disponibilité ${user.transporterProfile.isAvailable ? 'activée' : 'désactivée'}`,
            data: {
                isAvailable: user.transporterProfile.isAvailable
            }
        });
    } catch (error) {
        console.error('❌ Toggle Availability Error:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);

        const statusCode = error.message.includes('Seuls') ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
