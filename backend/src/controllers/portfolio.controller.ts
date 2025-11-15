// src/controllers/portfolio.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../database';
import { Portfolio } from '../models/Portfolio';
import { Holding } from '../models/Holding';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import * as valyuClient from '../services/valyuClient.service';

// Upload portfolio with CSV
export const uploadPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Portfolio name is required' });
        }

        // Parse CSV
        const holdings: Array<{ ticker: string; weight_pct: number }> = [];

        await new Promise((resolve, reject) => {
            const stream = Readable.from(req.file!.buffer);

            stream
                .pipe(parse({
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                }))
                .on('data', (row: any) => {
                    holdings.push({
                        ticker: row.ticker || row.Ticker || row.TICKER,
                        weight_pct: parseFloat(row.weight_pct || row.weight || row.Weight)
                    });
                })
                .on('error', reject)
                .on('end', resolve);
        });

        if (holdings.length === 0) {
            return res.status(400).json({ error: 'CSV file is empty or invalid' });
        }

        // Validate weights sum to 100
        const totalWeight = holdings.reduce((sum, h) => sum + h.weight_pct, 0);
        if (Math.abs(totalWeight - 100) > 0.01) {
            return res.status(400).json({
                error: `Weights must sum to 100%, got ${totalWeight.toFixed(2)}%`
            });
        }

        // Create portfolio
        const portfolioRepo = AppDataSource.getRepository(Portfolio);
        const holdingRepo = AppDataSource.getRepository(Holding);

        const portfolio = portfolioRepo.create({ name });
        await portfolioRepo.save(portfolio);

        // Create holdings
        const holdingEntities = holdings.map(h =>
            holdingRepo.create({
                portfolio_id: portfolio.id,
                ticker: h.ticker,
                weight_pct: h.weight_pct
            })
        );

        await holdingRepo.save(holdingEntities);

        // Fetch portfolio with holdings
        const result = await portfolioRepo.findOne({
            where: { id: portfolio.id },
            relations: ['holdings']
        });

        res.status(201).json({
            message: 'Portfolio uploaded successfully',
            portfolio: result
        });

    } catch (error) {
        next(error);
    }
};

// Get portfolio by ID
export const getPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const portfolioRepo = AppDataSource.getRepository(Portfolio);
        const portfolio = await portfolioRepo.findOne({
            where: { id },
            relations: ['holdings'],
            order: {
                holdings: {
                    weight_pct: 'DESC'
                }
            }
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        res.json(portfolio);
    } catch (error) {
        next(error);
    }
};

// Analyse portfolio (enrich with Valyu data)
export const analysePortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const holdingRepo = AppDataSource.getRepository(Holding);
        const holdings = await holdingRepo.find({
            where: { portfolio_id: id }
        });

        if (holdings.length === 0) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        // Enrich each holding with Valyu data
        const enrichedHoldings = await Promise.all(
            holdings.map(async (holding) => {
                try {
                    const enrichedData = await valyuClient.enrichHolding(holding.ticker);

                    holding.sector = enrichedData.sector;
                    holding.market_cap = enrichedData.market_cap;
                    holding.co2_emission = enrichedData.co2_emission;
                    holding.data_sources = enrichedData.sources;

                    return holding;
                } catch (error) {
                    console.error(`Failed to enrich ${holding.ticker}:`, error);
                    return holding;
                }
            })
        );

        await holdingRepo.save(enrichedHoldings);

        res.json({
            message: 'Portfolio analysis complete',
            holdings_enriched: enrichedHoldings.filter(h => h.sector).length,
            total_holdings: enrichedHoldings.length
        });
    } catch (error) {
        next(error);
    }
};