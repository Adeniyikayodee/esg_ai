// src/services/peerFinderAgent.service.ts
import { AppDataSource } from '../database';
import { Holding } from '../models/Holding';
import { PeerRecommendation } from '../models/PeerRecommendation';
import * as valyuClient from './valyuClient.service';

interface PeerCandidate {
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

export class PeerFinderAgent {
    async findPeers(holding: Holding): Promise<PeerRecommendation[]> {
        if (!holding.sector || !holding.market_cap) {
            throw new Error('Holding must be analyzed before finding peers');
        }

        // Build Valyu query
        const query = `top 100 public companies in sector ${holding.sector} with market cap around ${holding.market_cap}`;

        // Get candidates from Valyu
        const candidates = await valyuClient.searchCompanies(query, 100);

        // Filter candidates
        const filtered = this.filterCandidates(candidates, holding);

        // Sort by CO2 emission (ascending - lowest first)
        const sorted = this.sortByCO2(filtered);

        // Take top 10
        const topPeers = sorted.slice(0, 10);

        // Save to database
        return this.savePeerRecommendations(holding, topPeers);
    }

    private filterCandidates(
        candidates: any[],
        holding: Holding
    ): PeerCandidate[] {
        const filtered: PeerCandidate[] = [];

        for (const candidate of candidates) {
            // Skip if same ticker
            if (candidate.ticker === holding.ticker) continue;

            // Same sector check
            if (candidate.sector !== holding.sector) continue;

            // Similar market cap (within 20% band)
            const marketCap = Number(candidate.market_cap || 0);
            if (holding.market_cap) {
                const lowerBound = Number(holding.market_cap) * 0.8;
                const upperBound = Number(holding.market_cap) * 1.2;

                if (marketCap < lowerBound || marketCap > upperBound) continue;
            }

            // Must have CO2 data
            if (!candidate.co2_emission || candidate.co2_emission <= 0) continue;

            filtered.push({
                ticker: candidate.ticker,
                sector: candidate.sector,
                market_cap: marketCap,
                co2_emission: Number(candidate.co2_emission),
                sources: candidate.sources || []
            });
        }

        return filtered;
    }

    private sortByCO2(candidates: PeerCandidate[]): PeerCandidate[] {
        return candidates.sort((a, b) => a.co2_emission - b.co2_emission);
    }

    private async savePeerRecommendations(
        holding: Holding,
        peers: PeerCandidate[]
    ): Promise<PeerRecommendation[]> {
        const peerRepo = AppDataSource.getRepository(PeerRecommendation);

        // Clear existing recommendations for this holding
        await peerRepo.delete({ holding_id: holding.id });

        // Create new recommendations
        const recommendations: PeerRecommendation[] = [];

        for (let i = 0; i < peers.length; i++) {
            const peer = peers[i];
            const recommendation = peerRepo.create({
                portfolio_id: holding.portfolio_id,
                holding_id: holding.id,
                peer_ticker: peer.ticker,
                peer_sector: peer.sector,
                peer_market_cap: peer.market_cap,
                peer_co2_emission: peer.co2_emission,
                rank: i + 1,
                sources: peer.sources
            });

            recommendations.push(recommendation);
        }

        // Save all recommendations
        await peerRepo.save(recommendations);

        return recommendations;
    }
}