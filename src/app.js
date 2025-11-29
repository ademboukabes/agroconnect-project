import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import vehicleRoutes from './modules/transport/transport.routes.js';
import shipmentRoutes from './modules/shipments/shipment.routes.js';
import trackingRoutes from './modules/tracking/tracking.routes.js';
import ratingRoutes from './modules/ratings/rating.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware (à retirer en production)
app.use((req, res, next) => {
    console.log('📨 Request:', {
        method: req.method,
        url: req.url,
        contentType: req.get('Content-Type'),
        body: req.body
    });
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/ratings', ratingRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'AgroConnect API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            vehicles: '/api/vehicles',
            shipments: '/api/shipments',
            tracking: '/api/tracking'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

export default app;
