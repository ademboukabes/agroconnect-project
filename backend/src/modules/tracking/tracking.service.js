import Tracking from './tracking.model.js';
import Shipment from '../shipments/shipment.model.js';
import { emitLocationUpdate } from '../../services/socket.service.js';

/**
 * Service pour le tracking GPS en temps réel
 */

/**
 * Obtenir le tracking d'une expédition
 */
export const getShipmentTracking = async (shipmentId, userId) => {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new Error('Expédition non trouvée');
    }

    // Vérifier l'accès
    if (
        shipment.client.toString() !== userId &&
        (shipment.transporter && shipment.transporter.toString() !== userId)
    ) {
        throw new Error('Accès non autorisé');
    }

    const tracking = await Tracking.findOne({ shipment: shipmentId });

    if (!tracking) {
        throw new Error('Tracking non trouvé');
    }

    return tracking;
};

/**
 * Mettre à jour la position GPS (transporteur uniquement)
 */
export const updateTrackingLocation = async (shipmentId, transporterId, locationData) => {
    const shipment = await Shipment.findOne({
        _id: shipmentId,
        transporter: transporterId
    });

    if (!shipment) {
        throw new Error('Expédition non trouvée ou non autorisée');
    }

    if (shipment.status !== 'in_transit') {
        throw new Error('Le tracking n\'est disponible que pour les expéditions en transit');
    }

    const { longitude, latitude, speed, heading } = locationData;

    // Mettre à jour la position actuelle de l'expédition
    shipment.currentLocation.coordinates = [longitude, latitude];
    await shipment.save();

    // Ajouter la position à l'historique
    const tracking = await Tracking.findOneAndUpdate(
        { shipment: shipmentId },
        {
            $push: {
                locations: {
                    coordinates: [longitude, latitude],
                    timestamp: new Date(),
                    speed: speed || 0,
                    heading: heading || 0
                }
            }
        },
        { new: true }
    );

    // Émettre l'événement Socket.io pour mise à jour en temps réel
    emitLocationUpdate(shipmentId, {
        coordinates: [longitude, latitude],
        speed: speed || 0,
        heading: heading || 0,
        timestamp: new Date()
    });

    return tracking;
};

/**
 * Ajouter un événement au tracking
 */
export const addTrackingEvent = async (shipmentId, transporterId, eventData) => {
    const shipment = await Shipment.findOne({
        _id: shipmentId,
        transporter: transporterId
    });

    if (!shipment) {
        throw new Error('Expédition non trouvée ou non autorisée');
    }

    const tracking = await Tracking.findOneAndUpdate(
        { shipment: shipmentId },
        {
            $push: {
                events: {
                    ...eventData,
                    timestamp: new Date()
                }
            }
        },
        { new: true }
    );

    return tracking;
};

/**
 * Obtenir l'historique complet des positions
 */
export const getTrackingHistory = async (shipmentId, userId) => {
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
        throw new Error('Expédition non trouvée');
    }

    // Vérifier l'accès
    if (
        shipment.client.toString() !== userId &&
        (shipment.transporter && shipment.transporter.toString() !== userId)
    ) {
        throw new Error('Accès non autorisé');
    }

    const tracking = await Tracking.findOne({ shipment: shipmentId })
        .select('locations events')
        .lean();

    if (!tracking) {
        throw new Error('Tracking non trouvé');
    }

    return {
        locations: tracking.locations,
        events: tracking.events,
        totalDistance: calculateTotalDistance(tracking.locations)
    };
};

/**
 * Calculer la distance totale parcourue
 */
const calculateTotalDistance = (locations) => {
    if (locations.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
        const prev = locations[i - 1].coordinates;
        const curr = locations[i].coordinates;

        // Formule de Haversine simplifiée
        const R = 6371; // Rayon de la Terre en km
        const dLat = (curr[1] - prev[1]) * Math.PI / 180;
        const dLon = (curr[0] - prev[0]) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(prev[1] * Math.PI / 180) * Math.cos(curr[1] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        totalDistance += R * c;
    }

    return Math.round(totalDistance * 100) / 100; // Arrondir à 2 décimales
};
