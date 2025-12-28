import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../modules/users/user.model.js';

/**
 * Configuration de Socket.io pour les notifications en temps réel
 */

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
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
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
        console.log(`Client connected: ${socket.user.name} (${socket.user.role})`);

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.user.name}`);
        });
    });

    return io;
};

/**
 * Émettre un événement de statut
 */
export const emitStatusUpdate = (shipmentId, statusData) => {
    if (io) {
        io.emit('status-update', {
            shipmentId,
            status: statusData,
            timestamp: new Date()
        });
    }
};

export const getIO = () => io;
