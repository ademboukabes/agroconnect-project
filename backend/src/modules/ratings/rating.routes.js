import express from 'express';
import { getDriverRating, calculateDriverRating, estimateTripPrice } from './rating.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/driver/:driverId', protect, getDriverRating);
router.post('/calculate/:driverId', protect, calculateDriverRating);
router.post('/estimate-price', protect, estimateTripPrice);

export default router;
