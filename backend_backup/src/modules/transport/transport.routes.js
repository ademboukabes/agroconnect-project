import express from 'express';
import {
    getVehicles,
    getVehicle,
    addVehicle,
    modifyVehicle,
    removeVehicle,
    updateLocation,
    searchNearbyVehicles
} from './transport.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Recherche de véhicules (accessible à tous les utilisateurs authentifiés)
router.post('/search/nearby', protect, searchNearbyVehicles);

// Routes protégées pour transporteurs uniquement
router.use(protect);
router.use(authorize('transporter', 'admin'));

router.route('/')
    .get(getVehicles)
    .post(addVehicle);

router.route('/:id')
    .get(getVehicle)
    .put(modifyVehicle)
    .delete(removeVehicle);

router.put('/:id/location', updateLocation);

export default router;
