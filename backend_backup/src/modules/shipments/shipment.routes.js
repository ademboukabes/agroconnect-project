import express from 'express';
import {
    createShipmentRequest,
    getMyRequests,
    getMyDeliveries,
    getAvailableRequests,
    getShipment,
    acceptShipmentRequest,
    updateStatus,
    cancelShipmentRequest
} from './shipment.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(protect);

// Routes pour les clients
router.post('/', authorize('user', 'admin'), createShipmentRequest);
router.get('/my-requests', authorize('user', 'admin'), getMyRequests);
router.delete('/:id', authorize('user', 'admin'), cancelShipmentRequest);

// Routes pour les transporteurs
router.get('/available', authorize('transporter', 'admin'), getAvailableRequests);
router.get('/my-deliveries', authorize('transporter', 'admin'), getMyDeliveries);
router.post('/:id/accept', authorize('transporter', 'admin'), acceptShipmentRequest);
router.put('/:id/status', authorize('transporter', 'admin'), updateStatus);

// Routes accessibles par client et transporteur
router.get('/:id', getShipment);

export default router;
