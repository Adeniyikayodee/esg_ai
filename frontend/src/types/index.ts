export interface Holding {
    id: number;
    companyName: string;
    ticker: string;
    sector: string;
    positionSize: number;
    marketValue: number;
    carbonRating: number;
    esgScore: number;
}

export interface Replacement {
    oldId: number;
    oldName: string;
    newId: number;
    newName: string;
}

export interface PortfolioMetrics {
    totalMarketValue: number;
    avgCarbonRating: number;
    avgEsgScore: number;
    holdings: number;
}