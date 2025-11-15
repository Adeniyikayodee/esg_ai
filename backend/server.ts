// server.ts
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { initializeDatabase } from './src/database';
import app from './src/app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        // Initialize database connection
        await initializeDatabase();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
            console.log(`🔥 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();