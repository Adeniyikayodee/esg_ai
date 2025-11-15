// src/database.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Portfolio } from './models/Portfolio';
import { Holding } from './models/Holding';
import { PeerRecommendation } from './models/PeerRecommendation';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://fundmanager:fundmanager123@localhost:5432/fundmanager_db',
    synchronize: process.env.NODE_ENV === 'development', // Auto-create tables in dev
    logging: process.env.NODE_ENV === 'development',
    entities: [Portfolio, Holding, PeerRecommendation],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
};

// Helper to get repository instances
export const getRepository = <T>(entity: any) => {
    return AppDataSource.getRepository<T>(entity);
};