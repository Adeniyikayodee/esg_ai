// src/services/valyuClient.service.ts
import axios, { AxiosInstance } from 'axios';
import config from '../config';

interface ValyuEnrichmentResponse {
    ticker: string;
    sector: string;
    market_cap: number;
    co2_emission: number;
    sources: Array<{
        title: string;
        url: string;
        dataset_name: string;
    }>;
}

interface ValyuSearchResponse {
    results: Array<{
        ticker: string;
        company_name: string;
        sector: string;
        market_cap: number;
        co2_emission: number;
        sources: Array<{
            title: string;
            url: string;
            dataset_name: string;
        }>;
    }>;
}

class ValyuClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: config.valyu.apiUrl,
            headers: {
                'Authorization': `Bearer ${config.valyu.apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
    }

    async enrichHolding(ticker: string): Promise<ValyuEnrichmentResponse> {
        try {
            const response = await this.client.post('/enrich', {
                ticker,
                fields: ['sector', 'market_cap', 'co2_emission']
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to enrich ${ticker}:`, error);
            // Return mock data if API fails
            return {
                ticker,
                sector: 'Unknown',
                market_cap: 0,
                co2_emission: 0,
                sources: []
            };
        }
    }

    async searchCompanies(
        query: string,
        maxResults: number = 100
    ): Promise<ValyuSearchResponse['results']> {
        try {
            const response = await this.client.post('/search', {
                query,
                max_num_results: maxResults
            });
            return response.data.results || [];
        } catch (error) {
            console.error('Valyu search failed:', error);
            return [];
        }
    }
}

const valyuClient = new ValyuClient();

export const enrichHolding = (ticker: string) => valyuClient.enrichHolding(ticker);
export const searchCompanies = (query: string, maxResults?: number) =>
    valyuClient.searchCompanies(query, maxResults);