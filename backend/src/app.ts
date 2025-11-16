// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import portfolioRoutes from './routes/portfolio.routes';
import holdingRoutes from './routes/holding.routes';
import comparisonRoutes from './routes/comparison.routes';

dotenv.config();

const app: Application = express();

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Fund Manager API',
        version: '1.0.0',
        endpoints: {
            upload: 'POST /api/portfolio/upload',
            get: 'GET /api/portfolio/:id',
            analyse: 'POST /api/portfolio/:id/analyse',
            peers: 'POST /api/portfolio/:portfolioId/holding/:holdingId/peers',
            replace: 'POST /api/portfolio/:portfolioId/holding/:holdingId/replace'
        }
    });
});

// API Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/portfolio', holdingRoutes);
app.use('/api/comparison', comparisonRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        error: true,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default app;