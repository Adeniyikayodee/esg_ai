// src/controllers/holding.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../database';
import { Holding } from '../models/Holding';
import { PeerRecommendation } from '../models/PeerRecommendation';
import { PeerFinderAgent } from '../services/peerFinderAgent.service';

// Find peers for a holding
export const findPeers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { portfolioId, holdingId } = req.params;

        const holdingRepo = AppDataSource.getRepository(Holding);
        const holding = await holdingRepo.findOne({
            where: {
                id: holdingId,
                portfolio_id: portfolioId
            }
        });

        if (!holding) {
            return res.status(404).json({ error: 'Holding not found' });
        }

        if (!holding.sector || !holding.market_cap) {
            return res.status(400).json({
                error: 'Holding must be analyzed before finding peers'
            });
        }

        const peerFinder = new PeerFinderAgent();
        const peers = await peerFinder.findPeers(holding);

        res.json({
            original_holding: {
                ticker: holding.ticker,
                sector: holding.sector,
                market_cap: holding.market_cap,
                co2_emission: holding.co2_emission
            },
            peer_recommendations: peers,
            count: peers.length
        });
    } catch (error) {
        next(error);
    }
};

// Replace holding with a peer
export const replaceHolding = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { portfolioId, holdingId } = req.params;
        const { peer_ticker } = req.body;

        if (!peer_ticker) {
            return res.status(400).json({ error: 'peer_ticker is required' });
        }

        const holdingRepo = AppDataSource.getRepository(Holding);
        const peerRepo = AppDataSource.getRepository(PeerRecommendation);

        // Get original holding
        const holding = await holdingRepo.findOne({
            where: {
                id: holdingId,
                portfolio_id: portfolioId
            }
        });

        if (!holding) {
            return res.status(404).json({ error: 'Holding not found' });
        }

        // Get peer recommendation
        const peer = await peerRepo.findOne({
            where: {
                holding_id: holdingId,
                peer_ticker: peer_ticker
            }
        });

        if (!peer) {
            return res.status(404).json({ error: 'Peer recommendation not found' });
        }

        // Replace holding with peer data (keep same weight)
        const originalWeight = holding.weight_pct;
        holding.ticker = peer.peer_ticker;
        holding.sector = peer.peer_sector || holding.sector;
        holding.market_cap = peer.peer_market_cap || holding.market_cap;
        holding.co2_emission = peer.peer_co2_emission || holding.co2_emission;
        holding.data_sources = peer.sources || holding.data_sources;

        await holdingRepo.save(holding);

        res.json({
            message: 'Holding replaced successfully',
            original_ticker: req.params.holdingId,
            new_ticker: peer_ticker,
            weight_pct: originalWeight,
            co2_reduction: holding.co2_emission && peer.peer_co2_emission
                ? (Number(holding.co2_emission) - Number(peer.peer_co2_emission))
                : null
        });
    } catch (error) {
        next(error);
    }
};