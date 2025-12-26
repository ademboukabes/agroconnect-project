import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./services/socket.service.js";

const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        const server = createServer(app);

        const io = initializeSocket(server);
        console.log('Socket.io initialized');

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`WebSocket ready for real-time tracking`);
        });
    } catch (error) {
        console.error("Failed to connect to database. Server not started.");
        process.exit(1);
    }
};

startServer();
