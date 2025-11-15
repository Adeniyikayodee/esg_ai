// src/config/index.ts
import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    database: {
        url: string;
    };
    valyu: {
        apiKey: string;
        apiUrl: string;
    };
    cors: {
        clientUrl: string;
    };
}

const config: Config = {
    port: parseInt(process.env.PORT || '8000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL || 'postgresql://fundmanager:fundmanager123@localhost:5432/fundmanager_db'
    },
    valyu: {
        apiKey: process.env.VALYU_API_KEY || '',
        apiUrl: process.env.VALYU_API_URL || 'https://api.valyu.com/deepsearch'
    },
    cors: {
        clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
    }
};

// Validate required environment variables
const validateConfig = (): void => {
    const required = ['DATABASE_URL'];
    const missing: string[] = [];

    for (const key of required) {
        if (!process.env[key]) {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    }

    if (!config.valyu.apiKey) {
        console.warn('⚠️  VALYU_API_KEY not set - Valyu integration will not work');
    }
};

validateConfig();

export default config;