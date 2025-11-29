import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./services/socket.service.js";

// Connexion à MongoDB et démarrage du serveur
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        // Créer le serveur HTTP
        const server = createServer(app);

        // Initialiser Socket.io
        const io = initializeSocket(server);
        console.log('✅ Socket.io initialisé');

        // Démarrer le serveur
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 WebSocket ready for real-time tracking`);
        });
    } catch (error) {
        console.error("❌ Failed to connect to database. Server not started.");
        process.exit(1);
    }
};

startServer();
