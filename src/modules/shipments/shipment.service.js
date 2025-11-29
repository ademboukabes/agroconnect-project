import Shipment from './shipment.model.js';
import Tracking from '../tracking/tracking.model.js';
import Vehicle from '../transport/vehicle.model.js';
import User from '../users/user.model.js';
import { getDistance } from 'geolib';

/**
 * Service pour la gestion des expéditions
 */

/**
 * Créer une nouvelle demande de transport
 */
export const createShipment = async (clientId, shipmentData) => {
    // Vérifier que l'utilisateur est un client
    const user = await User.findById(clientId);
    if (!user || (user.role !== 'user' && user.role !== 'admin')) {
        throw new Error('Seuls les clients peuvent créer des demandes de transport');
    }

    const shipment = await Shipment.create({
        ...shipmentData,
        client: clientId,
        status: 'pending'
    });

    // Créer l'enregistrement de tracking
    await Tracking.create({
        shipment: shipment._id,
        locations: [],
        events: [{
            type: 'pickup',
            timestamp: new Date(),
            note: 'Demande de transport créée'
        }]
    });

    return shipment;
};

/**
 * Obtenir les demandes d'un client
 */
export const getClientShipments = async (clientId, status = null) => {
    const query = { client: clientId };
    if (status) {
        query.status = status;
    }

    const shipments = await Shipment.find(query)
        .populate('transporter', 'name phone transporterProfile')
        .populate('vehicle', 'vehicleType licensePlate')
        .sort({ createdAt: -1 });

    return shipments;
};

/**
 * Obtenir les livraisons d'un transporteur
 */
export const getTransporterShipments = async (transporterId, status = null) => {
    const query = { transporter: transporterId };
    if (status) {
        query.status = status;
    }

    const shipments = await Shipment.find(query)
        .populate('client', 'name phone clientProfile')
        .populate('vehicle', 'vehicleType licensePlate')
        .sort({ createdAt: -1 });

    return shipments;
};

/**
 * Obtenir les demandes disponibles pour les transporteurs
 */
export const getAvailableShipments = async (transporterId) => {
    // Récupérer les véhicules du transporteur
    const vehicles = await Vehicle.find({
        transporter: transporterId,
        isAvailable: true
    });

    if (vehicles.length === 0) {
        return [];
    }

    // Trouver les demandes en attente
    const shipments = await Shipment.find({
        status: 'pending'
    })
        .populate('client', 'name phone address clientProfile')
        .sort({ createdAt: -1 });

    return shipments;
};

/**
 * Obtenir une expédition par ID
 */
export const getShipmentById = async (shipmentId, userId) => {
    const shipment = await Shipment.findById(shipmentId)
        .populate('client', 'name phone address clientProfile')
        .populate('transporter', 'name phone transporterProfile')
        .populate('vehicle', 'vehicleType licensePlate capacity');

    if (!shipment) {
        throw new Error('Expédition non trouvée');
    }

    // Vérifier que l'utilisateur a accès à cette expédition
    if (
        shipment.client._id.toString() !== userId &&
        (shipment.transporter && shipment.transporter._id.toString() !== userId)
    ) {
        throw new Error('Accès non autorisé');
    }

    return shipment;
};

/**
 * Accepter une demande de transport
 */
export const acceptShipment = async (shipmentId, transporterId, vehicleId) => {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new Error('Expédition non trouvée');
    }

    if (shipment.status !== 'pending') {
        throw new Error('Cette demande n\'est plus disponible');
    }

    // Vérifier que le véhicule appartient au transporteur
    const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        transporter: transporterId
    });

    if (!vehicle) {
        throw new Error('Véhicule non trouvé ou non autorisé');
    }

    // Vérifier la capacité
    if (vehicle.capacity < shipment.weight) {
        throw new Error('La capacité du véhicule est insuffisante');
    }

    // Mettre à jour l'expédition
    shipment.transporter = transporterId;
    shipment.vehicle = vehicleId;
    shipment.status = 'accepted';

    // Calculer le prix (simple: 100 DA/km)
    if (shipment.route && shipment.route.distance) {
        shipment.price = Math.round(shipment.route.distance * 100);
    }

    await shipment.save();

    // Ajouter un événement au tracking
    await Tracking.findOneAndUpdate(
        { shipment: shipmentId },
        {
            $push: {
                events: {
                    type: 'in_transit',
                    timestamp: new Date(),
                    note: 'Demande acceptée par le transporteur'
                }
            }
        }
    );

    // Marquer le véhicule comme non disponible
    vehicle.isAvailable = false;
    await vehicle.save();

    return shipment;
};

/**
 * Mettre à jour le statut d'une expédition
 */
export const updateShipmentStatus = async (shipmentId, transporterId, newStatus) => {
    const shipment = await Shipment.findOne({
        _id: shipmentId,
        transporter: transporterId
    });

    if (!shipment) {
        throw new Error('Expédition non trouvée');
    }

    const validTransitions = {
        'accepted': ['in_transit', 'cancelled'],
        'in_transit': ['delivered', 'cancelled'],
    };

    if (!validTransitions[shipment.status]?.includes(newStatus)) {
        throw new Error('Transition de statut invalide');
    }

    shipment.status = newStatus;

    if (newStatus === 'delivered') {
        shipment.delivery.date = new Date();

        // Libérer le véhicule
        await Vehicle.findByIdAndUpdate(shipment.vehicle, {
            isAvailable: true
        });

        // Mettre à jour les stats du transporteur
        await User.findByIdAndUpdate(transporterId, {
            $inc: { 'transporterProfile.totalDeliveries': 1 }
        });
    }

    await shipment.save();

    // Ajouter un événement au tracking
    await Tracking.findOneAndUpdate(
        { shipment: shipmentId },
        {
            $push: {
                events: {
                    type: newStatus === 'delivered' ? 'delivered' : 'in_transit',
                    timestamp: new Date(),
                    note: `Statut changé en ${newStatus}`
                }
            }
        }
    );

    return shipment;
};

/**
 * Annuler une demande (client uniquement, si pending)
 */
export const cancelShipment = async (shipmentId, clientId) => {
    const shipment = await Shipment.findOne({
        _id: shipmentId,
        client: clientId
    });

    if (!shipment) {
        throw new Error('Expédition non trouvée');
    }

    if (shipment.status !== 'pending') {
        throw new Error('Impossible d\'annuler une demande déjà acceptée');
    }

    shipment.status = 'cancelled';
    await shipment.save();

    return shipment;
};

/**
 * Calculer la distance entre deux points
 */
export const calculateDistance = (point1, point2) => {
    return getDistance(
        { latitude: point1[1], longitude: point1[0] },
        { latitude: point2[1], longitude: point2[0] }
    ) / 1000; // Convertir en km
};
