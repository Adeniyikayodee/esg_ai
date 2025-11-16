import { Holding, PortfolioMetrics } from '../types';

export const calculateMetrics = (portfolio: Holding[]): PortfolioMetrics => {
    const totalMarketValue = portfolio.reduce((sum, h) => sum + h.marketValue, 0);
    const avgCarbonRating = portfolio.reduce((sum, h) => sum + h.carbonRating, 0) / portfolio.length;
    const avgEsgScore = portfolio.reduce((sum, h) => sum + h.esgScore, 0) / portfolio.length;

    return {
        totalMarketValue,
        avgCarbonRating,
        avgEsgScore,
        holdings: portfolio.length
    };
};

export const exportToCSV = (portfolio: Holding[], replacements: any[]) => {
    const headers = ['Company', 'Ticker', 'Sector', 'Position Size (%)', 'Market Value', 'Carbon Rating', 'ESG Score', 'Status'];

    const rows = portfolio.map(holding => {
        const replacement = replacements.find(r => r.newId === holding.id);
        const status = replacement ? `Replaced from ${replacement.oldName}` : 'Original';

        return [
            holding.companyName,
            holding.ticker,
            holding.sector,
            holding.positionSize.toString(),
            holding.marketValue.toString(),
            holding.carbonRating.toString(),
            holding.esgScore.toString(),
            status
        ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'new_portfolio.csv';
    a.click();
    URL.revokeObjectURL(url);
};

export const filterPeers = (selectedHolding: Holding, candidatePeers: Holding[]): Holding[] => {
    return candidatePeers.filter(peer => {
        const sameSector = peer.sector === selectedHolding.sector;
        const marketValueRange = peer.marketValue >= selectedHolding.marketValue * 0.75 &&
            peer.marketValue <= selectedHolding.marketValue * 1.25;
        const betterCarbon = peer.carbonRating < selectedHolding.carbonRating;
        const betterESG = peer.esgScore > selectedHolding.esgScore;

        return sameSector && marketValueRange && betterCarbon && betterESG;
    });
};