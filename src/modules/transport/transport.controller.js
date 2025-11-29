import {
    getTransporterVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    updateVehicleLocation,
    findNearbyVehicles
} from './transport.service.js';

// @desc    Get all vehicles for transporter
// @route   GET /api/vehicles
// @access  Private (Transporter)
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await getTransporterVehicles(req.user.id);

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: { vehicles }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des véhicules:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private (Transporter)
export const getVehicle = async (req, res) => {
    try {
        const vehicle = await getVehicleById(req.params.id, req.user.id);

        res.status(200).json({
            success: true,
            data: { vehicle }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du véhicule:', error);
        const statusCode = error.message === 'Véhicule non trouvé' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private (Transporter)
export const addVehicle = async (req, res) => {
    try {
        const vehicle = await createVehicle(req.user.id, req.body);

        res.status(201).json({
            success: true,
            message: 'Véhicule ajouté avec succès',
            data: { vehicle }
        });
    } catch (error) {
        console.error('Erreur lors de la création du véhicule:', error);
        const statusCode = error.message.includes('Seuls') ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Transporter)
export const modifyVehicle = async (req, res) => {
    try {
        const vehicle = await updateVehicle(req.params.id, req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Véhicule mis à jour avec succès',
            data: { vehicle }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du véhicule:', error);
        const statusCode = error.message === 'Véhicule non trouvé' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Transporter)
export const removeVehicle = async (req, res) => {
    try {
        await deleteVehicle(req.params.id, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Véhicule supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du véhicule:', error);
        const statusCode = error.message === 'Véhicule non trouvé' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Update vehicle location
// @route   PUT /api/vehicles/:id/location
// @access  Private (Transporter)
export const updateLocation = async (req, res) => {
    try {
        const { longitude, latitude } = req.body;

        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                message: 'Longitude et latitude sont requises'
            });
        }

        const vehicle = await updateVehicleLocation(
            req.params.id,
            req.user.id,
            [longitude, latitude]
        );

        res.status(200).json({
            success: true,
            message: 'Position mise à jour',
            data: {
                location: vehicle.currentLocation
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la position:', error);
        const statusCode = error.message === 'Véhicule non trouvé' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Search nearby vehicles
// @route   POST /api/vehicles/search/nearby
// @access  Private
export const searchNearbyVehicles = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance } = req.body;

        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                message: 'Longitude et latitude sont requises'
            });
        }

        const vehicles = await findNearbyVehicles(
            [longitude, latitude],
            maxDistance
        );

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: { vehicles }
        });
    } catch (error) {
        console.error('Erreur lors de la recherche de véhicules:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
