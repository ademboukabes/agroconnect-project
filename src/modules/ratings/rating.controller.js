import User from '../users/user.model.js';
import Shipment from '../shipments/shipment.model.js';
import * as aiService from '../../services/ai-rating.service.js';

export const getDriverRating = async (req, res) => {
    try {
        const { driverId } = req.params;
        const user = await User.findById(driverId);

        if (!user || user.role !== 'transporter') {
            return res.status(404).json({ success: false, message: 'Transporteur non trouvé' });
        }

        res.json({
            success: true,
            data: {
                rating: user.transporterProfile.rating, // User rating (manual)
                aiRating: user.transporterProfile.aiRating, // AI rating
                history: user.transporterProfile.ratingHistory
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const calculateDriverRating = async (req, res) => {
    try {
        const { driverId } = req.params;
        const user = await User.findById(driverId);

        if (!user || user.role !== 'transporter') {
            return res.status(404).json({ success: false, message: 'Transporteur non trouvé' });
        }

        // Fetch completed shipments for this driver
        const shipments = await Shipment.find({
            transporter: driverId,
            status: 'delivered'
        });

        if (shipments.length === 0) {
            return res.json({ success: true, message: 'Aucun trajet à analyser' });
        }

        // Format trips for AI service
        const trips = shipments.map(s => ({
            vehicule: user.transporterProfile.vehicleType || 'Camion',
            produit: s.productType,
            ville: s.delivery.address,
            poids: s.weight,
            duree: 2, // Placeholder
            prix: s.price || 1000 // Placeholder
        }));

        // Call AI Service
        const aiResult = await aiService.rateDriver(driverId, trips);

        if (aiResult) {
            // Update user profile
            user.transporterProfile.aiRating = {
                score: aiResult.overall_rating,
                category: aiResult.category,
                lastUpdated: new Date(),
                totalTripsAnalyzed: aiResult.total_trips,
                consistency: aiResult.consistency
            };

            user.transporterProfile.ratingHistory.push({
                score: aiResult.overall_rating,
                category: aiResult.category
            });

            await user.save();
        }

        res.json({
            success: true,
            data: user.transporterProfile.aiRating
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const estimateTripPrice = async (req, res) => {
    try {
        const estimation = await aiService.estimatePrice(req.body);
        if (!estimation) {
            return res.status(503).json({ success: false, message: 'Service IA indisponible' });
        }
        res.json({ success: true, data: estimation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
