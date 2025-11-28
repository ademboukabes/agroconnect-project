import Vehicle from './vehicle.model.js';
import User from '../users/user.model.js';

/**
 * Service pour la gestion des véhicules
 */

/**
 * Obtenir tous les véhicules d'un transporteur
 */
export const getTransporterVehicles = async (transporterId) => {
    const vehicles = await Vehicle.find({ transporter: transporterId })
        .sort({ createdAt: -1 });
    return vehicles;
};

/**
 * Obtenir un véhicule par ID
 */
export const getVehicleById = async (vehicleId, transporterId) => {
    const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        transporter: transporterId
    });

    if (!vehicle) {
        throw new Error('Véhicule non trouvé');
    }

    return vehicle;
};

/**
 * Créer un nouveau véhicule
 */
export const createVehicle = async (transporterId, vehicleData) => {
    // Vérifier que l'utilisateur est un transporteur
    const user = await User.findById(transporterId);
    if (!user || user.role !== 'transporter') {
        throw new Error('Seuls les transporteurs peuvent ajouter des véhicules');
    }

    const vehicle = await Vehicle.create({
        ...vehicleData,
        transporter: transporterId
    });

    return vehicle;
};

/**
 * Mettre à jour un véhicule
 */
export const updateVehicle = async (vehicleId, transporterId, vehicleData) => {
    const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        transporter: transporterId
    });

    if (!vehicle) {
        throw new Error('Véhicule non trouvé');
    }

    // Mettre à jour les champs
    Object.keys(vehicleData).forEach(key => {
        if (key !== 'transporter') { // Ne pas permettre de changer le transporteur
            vehicle[key] = vehicleData[key];
        }
    });

    await vehicle.save();
    return vehicle;
};

/**
 * Supprimer un véhicule
 */
export const deleteVehicle = async (vehicleId, transporterId) => {
    const vehicle = await Vehicle.findOneAndDelete({
        _id: vehicleId,
        transporter: transporterId
    });

    if (!vehicle) {
        throw new Error('Véhicule non trouvé');
    }

    return vehicle;
};

/**
 * Mettre à jour la position d'un véhicule
 */
export const updateVehicleLocation = async (vehicleId, transporterId, coordinates) => {
    const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        transporter: transporterId
    });

    if (!vehicle) {
        throw new Error('Véhicule non trouvé');
    }

    vehicle.currentLocation.coordinates = coordinates;
    await vehicle.save();

    return vehicle;
};

/**
 * Rechercher des véhicules disponibles près d'une position
 */
export const findNearbyVehicles = async (coordinates, maxDistance = 100000) => {
    // maxDistance en mètres (100km par défaut)
    const vehicles = await Vehicle.find({
        isAvailable: true,
        currentLocation: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                $maxDistance: maxDistance
            }
        }
    }).populate('transporter', 'name phone transporterProfile');

    return vehicles;
};
