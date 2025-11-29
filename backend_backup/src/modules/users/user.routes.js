import express from 'express';
import {
    getProfile,
    updateUserProfile,
    updateClientProfileController,
    updateTransporterProfileController,
    toggleTransporterAvailability
} from './user.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes sont protégées
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateUserProfile);
router.put('/client-profile', updateClientProfileController);
router.put('/transporter-profile', updateTransporterProfileController);
router.put('/toggle-availability', toggleTransporterAvailability);

export default router;
