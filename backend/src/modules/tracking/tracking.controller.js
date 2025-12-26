import {
    getShipmentTracking,
    updateTrackingLocation,
    addTrackingEvent,
    getTrackingHistory
} from './tracking.service.js';

// @desc    Get shipment tracking
// @route   GET /api/tracking/:shipmentId
// @access  Private (Client or Transporter of the shipment)
export const getTracking = async (req, res) => {
    try {
        const tracking = await getShipmentTracking(req.params.shipmentId, req.user.id);

        res.status(200).json({
            success: true,
            data: { tracking }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du tracking:', error);
        const statusCode = error.message.includes('non trouvée') || error.message.includes('non trouvé') ? 404 :
            error.message.includes('non autorisé') ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Update tracking location
// @route   POST /api/tracking/:shipmentId/update
// @access  Private (Transporter only)
export const updateLocation = async (req, res) => {
    try {
        const { longitude, latitude, speed, heading } = req.body;

        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                message: 'Longitude et latitude sont requises'
            });
        }

        const tracking = await updateTrackingLocation(
            req.params.shipmentId,
            req.user.id,
            { longitude, latitude, speed, heading }
        );

        res.status(200).json({
            success: true,
            message: 'Position mise à jour',
            data: {
                currentLocation: tracking.locations[tracking.locations.length - 1]
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la position:', error);
        const statusCode = error.message.includes('non trouvée') || error.message.includes('non autorisée') ? 404 :
            error.message.includes('transit') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Add tracking event
// @route   POST /api/tracking/:shipmentId/event
// @access  Private (Transporter only)
export const addEvent = async (req, res) => {
    try {
        const { type, note, longitude, latitude } = req.body;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: 'Le type d\'événement est requis'
            });
        }

        const eventData = {
            type,
            note,
            location: longitude && latitude ? {
                type: 'Point',
                coordinates: [longitude, latitude]
            } : undefined
        };

        const tracking = await addTrackingEvent(
            req.params.shipmentId,
            req.user.id,
            eventData
        );

        res.status(200).json({
            success: true,
            message: 'Événement ajouté',
            data: {
                event: tracking.events[tracking.events.length - 1]
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
        const statusCode = error.message.includes('non trouvée') || error.message.includes('non autorisée') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Get tracking history
// @route   GET /api/tracking/:shipmentId/history
// @access  Private (Client or Transporter of the shipment)
export const getHistory = async (req, res) => {
    try {
        const history = await getTrackingHistory(req.params.shipmentId, req.user.id);

        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        const statusCode = error.message.includes('non trouvée') || error.message.includes('non trouvé') ? 404 :
            error.message.includes('non autorisé') ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
