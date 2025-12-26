import {
    createShipment,
    getClientShipments,
    getTransporterShipments,
    getAvailableShipments,
    getShipmentById,
    acceptShipment,
    updateShipmentStatus,
    cancelShipment,
    calculateDistance
} from './shipment.service.js';

// @desc    Create new shipment request
// @route   POST /api/shipments
// @access  Private (Client)
export const createShipmentRequest = async (req, res) => {
    try {
        const shipment = await createShipment(req.user.id, req.body);

        res.status(201).json({
            success: true,
            message: 'Demande de transport créée avec succès',
            data: { shipment }
        });
    } catch (error) {
        console.error('Erreur lors de la création de la demande:', error);
        const statusCode = error.message.includes('Seuls') ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Get client's shipments
// @route   GET /api/shipments/my-requests
// @access  Private (Client)
export const getMyRequests = async (req, res) => {
    try {
        const { status } = req.query;
        const shipments = await getClientShipments(req.user.id, status);

        res.status(200).json({
            success: true,
            count: shipments.length,
            data: { shipments }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Get transporter's deliveries
// @route   GET /api/shipments/my-deliveries
// @access  Private (Transporter)
export const getMyDeliveries = async (req, res) => {
    try {
        const { status } = req.query;
        const shipments = await getTransporterShipments(req.user.id, status);

        res.status(200).json({
            success: true,
            count: shipments.length,
            data: { shipments }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des livraisons:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Get available shipments for transporters
// @route   GET /api/shipments/available
// @access  Private (Transporter)
export const getAvailableRequests = async (req, res) => {
    try {
        const shipments = await getAvailableShipments(req.user.id);

        res.status(200).json({
            success: true,
            count: shipments.length,
            data: { shipments }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes disponibles:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
export const getShipment = async (req, res) => {
    try {
        const shipment = await getShipmentById(req.params.id, req.user.id);

        res.status(200).json({
            success: true,
            data: { shipment }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'expédition:', error);
        const statusCode = error.message === 'Expédition non trouvée' ? 404 :
            error.message === 'Accès non autorisé' ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Accept shipment request
// @route   POST /api/shipments/:id/accept
// @access  Private (Transporter)
export const acceptShipmentRequest = async (req, res) => {
    try {
        const { vehicleId, price } = req.body;

        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: 'L\'ID du véhicule est requis'
            });
        }

        const shipment = await acceptShipment(req.params.id, req.user.id, vehicleId, price);

        res.status(200).json({
            success: true,
            message: 'Demande acceptée avec succès',
            data: { shipment }
        });
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la demande:', error);
        const statusCode = error.message.includes('non trouvée') ? 404 :
            error.message.includes('disponible') || error.message.includes('capacité') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Update shipment status
// @route   PUT /api/shipments/:id/status
// @access  Private (Transporter)
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Le statut est requis'
            });
        }

        const shipment = await updateShipmentStatus(req.params.id, req.user.id, status);

        res.status(200).json({
            success: true,
            message: 'Statut mis à jour avec succès',
            data: { shipment }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        const statusCode = error.message.includes('non trouvée') ? 404 :
            error.message.includes('invalide') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};

// @desc    Cancel shipment
// @route   DELETE /api/shipments/:id
// @access  Private (Client)
export const cancelShipmentRequest = async (req, res) => {
    try {
        const shipment = await cancelShipment(req.params.id, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Demande annulée avec succès',
            data: { shipment }
        });
    } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
        const statusCode = error.message.includes('non trouvée') ? 404 :
            error.message.includes('Impossible') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
