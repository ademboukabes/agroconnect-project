import express from 'express';
import {
    getTracking,
    updateLocation,
    addEvent,
    getHistory
} from './tracking.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(protect);

// Routes accessibles par client et transporteur
router.get('/:shipmentId', getTracking);
router.get('/:shipmentId/history', getHistory);

// Routes pour transporteurs uniquement
router.post('/:shipmentId/update', authorize('transporter', 'admin'), updateLocation);
router.post('/:shipmentId/event', authorize('transporter', 'admin'), addEvent);

export default router;
