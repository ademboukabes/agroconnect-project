import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../modules/users/user.model.js';

/**
 * Configuration de Socket.io pour le tracking en temps réel
 */

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // En production, spécifiez votre domaine frontend
            methods: ["GET", "POST"]
        }
    });

    // Middleware d'authentification pour Socket.io
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');

            // Récupérer l'utilisateur
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(new Error('User not found'));
            }

            // Attacher l'utilisateur au socket
            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ Client connecté: ${socket.user.name} (${socket.user.role})`);

        // Rejoindre une room spécifique à l'expédition
        socket.on('join-shipment', (shipmentId) => {
            socket.join(`shipment-${shipmentId}`);
            console.log(`📦 ${socket.user.name} a rejoint le tracking de l'expédition ${shipmentId}`);
        });

        // Quitter une room
        socket.on('leave-shipment', (shipmentId) => {
            socket.leave(`shipment-${shipmentId}`);
            console.log(`📦 ${socket.user.name} a quitté le tracking de l'expédition ${shipmentId}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Client déconnecté: ${socket.user.name}`);
        });
    });

    return io;
};

/**
 * Émettre une mise à jour de position en temps réel
 */
export const emitLocationUpdate = (shipmentId, locationData) => {
    if (io) {
        io.to(`shipment-${shipmentId}`).emit('location-update', {
            shipmentId,
            location: locationData,
            timestamp: new Date()
        });
        console.log(`📍 Position mise à jour pour l'expédition ${shipmentId}`);
    }
};

/**
 * Émettre un événement de statut
 */
export const emitStatusUpdate = (shipmentId, statusData) => {
    if (io) {
        io.to(`shipment-${shipmentId}`).emit('status-update', {
            shipmentId,
            status: statusData,
            timestamp: new Date()
        });
        console.log(`📊 Statut mis à jour pour l'expédition ${shipmentId}`);
    }
};

/**
 * Émettre un événement personnalisé
 */
export const emitEvent = (shipmentId, eventType, eventData) => {
    if (io) {
        io.to(`shipment-${shipmentId}`).emit(eventType, {
            shipmentId,
            data: eventData,
            timestamp: new Date()
        });
    }
};

export const getIO = () => io;
