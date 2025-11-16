import { Holding } from '../types';

export const originalPortfolio: Holding[] = [
    { id: 1, companyName: "Microsoft Corp", ticker: "MSFT", sector: "Technology", positionSize: 12.5, marketValue: 2500000, carbonRating: 3, esgScore: 75 },
    { id: 2, companyName: "Apple Inc", ticker: "AAPL", sector: "Technology", positionSize: 11.0, marketValue: 2200000, carbonRating: 2, esgScore: 82 },
    { id: 3, companyName: "Amazon.com", ticker: "AMZN", sector: "Consumer Discretionary", positionSize: 10.5, marketValue: 2100000, carbonRating: 4, esgScore: 68 },
    { id: 4, companyName: "Alphabet Inc", ticker: "GOOGL", sector: "Technology", positionSize: 9.8, marketValue: 1960000, carbonRating: 3, esgScore: 71 },
    { id: 5, companyName: "JPMorgan Chase", ticker: "JPM", sector: "Financials", positionSize: 9.5, marketValue: 1900000, carbonRating: 3, esgScore: 66 },
    { id: 6, companyName: "Johnson & Johnson", ticker: "JNJ", sector: "Healthcare", positionSize: 8.7, marketValue: 1740000, carbonRating: 2, esgScore: 78 },
    { id: 7, companyName: "Walmart Inc", ticker: "WMT", sector: "Consumer Staples", positionSize: 8.5, marketValue: 1700000, carbonRating: 4, esgScore: 65 },
    { id: 8, companyName: "Procter & Gamble", ticker: "PG", sector: "Consumer Staples", positionSize: 7.8, marketValue: 1560000, carbonRating: 3, esgScore: 73 },
    { id: 9, companyName: "Berkshire Hathaway", ticker: "BRK.B", sector: "Financials", positionSize: 7.5, marketValue: 1500000, carbonRating: 3, esgScore: 62 },
    { id: 10, companyName: "ExxonMobil", ticker: "XOM", sector: "Energy", positionSize: 14.2, marketValue: 2840000, carbonRating: 5, esgScore: 55 }
];

export const candidatePeers: Holding[] = [
    // Technology peers
    { id: 101, companyName: "Adobe Inc", ticker: "ADBE", sector: "Technology", positionSize: 0, marketValue: 2400000, carbonRating: 1, esgScore: 85 },
    { id: 102, companyName: "Salesforce", ticker: "CRM", sector: "Technology", positionSize: 0, marketValue: 2100000, carbonRating: 1, esgScore: 88 },
    { id: 103, companyName: "ServiceNow", ticker: "NOW", sector: "Technology", positionSize: 0, marketValue: 1800000, carbonRating: 1, esgScore: 83 },
    { id: 104, companyName: "Oracle Corp", ticker: "ORCL", sector: "Technology", positionSize: 0, marketValue: 2300000, carbonRating: 2, esgScore: 77 },
    { id: 105, companyName: "SAP SE", ticker: "SAP", sector: "Technology", positionSize: 0, marketValue: 1900000, carbonRating: 1, esgScore: 86 },

    // Consumer Discretionary peers
    { id: 201, companyName: "Tesla Inc", ticker: "TSLA", sector: "Consumer Discretionary", positionSize: 0, marketValue: 2300000, carbonRating: 2, esgScore: 79 },
    { id: 202, companyName: "Nike Inc", ticker: "NKE", sector: "Consumer Discretionary", positionSize: 0, marketValue: 1950000, carbonRating: 2, esgScore: 81 },
    { id: 203, companyName: "Starbucks", ticker: "SBUX", sector: "Consumer Discretionary", positionSize: 0, marketValue: 1800000, carbonRating: 1, esgScore: 84 },

    // Financials peers
    { id: 301, companyName: "Bank of America", ticker: "BAC", sector: "Financials", positionSize: 0, marketValue: 1850000, carbonRating: 2, esgScore: 70 },
    { id: 302, companyName: "Wells Fargo", ticker: "WFC", sector: "Financials", positionSize: 0, marketValue: 1700000, carbonRating: 2, esgScore: 68 },
    { id: 303, companyName: "Goldman Sachs", ticker: "GS", sector: "Financials", positionSize: 0, marketValue: 1450000, carbonRating: 2, esgScore: 67 },
    { id: 304, companyName: "American Express", ticker: "AXP", sector: "Financials", positionSize: 0, marketValue: 1600000, carbonRating: 1, esgScore: 75 },

    // Healthcare peers
    { id: 401, companyName: "Pfizer Inc", ticker: "PFE", sector: "Healthcare", positionSize: 0, marketValue: 1680000, carbonRating: 1, esgScore: 82 },
    { id: 402, companyName: "Merck & Co", ticker: "MRK", sector: "Healthcare", positionSize: 0, marketValue: 1820000, carbonRating: 1, esgScore: 80 },
    { id: 403, companyName: "Abbott Labs", ticker: "ABT", sector: "Healthcare", positionSize: 0, marketValue: 1550000, carbonRating: 1, esgScore: 83 },

    // Consumer Staples peers
    { id: 501, companyName: "Coca-Cola", ticker: "KO", sector: "Consumer Staples", positionSize: 0, marketValue: 1620000, carbonRating: 2, esgScore: 76 },
    { id: 502, companyName: "PepsiCo", ticker: "PEP", sector: "Consumer Staples", positionSize: 0, marketValue: 1780000, carbonRating: 2, esgScore: 78 },
    { id: 503, companyName: "Unilever", ticker: "UL", sector: "Consumer Staples", positionSize: 0, marketValue: 1500000, carbonRating: 1, esgScore: 85 },
    { id: 504, companyName: "Nestle SA", ticker: "NESN", sector: "Consumer Staples", positionSize: 0, marketValue: 1850000, carbonRating: 2, esgScore: 77 },

    // Energy peers
    { id: 601, companyName: "NextEra Energy", ticker: "NEE", sector: "Energy", positionSize: 0, marketValue: 2600000, carbonRating: 1, esgScore: 89 },
    { id: 602, companyName: "Enphase Energy", ticker: "ENPH", sector: "Energy", positionSize: 0, marketValue: 2900000, carbonRating: 1, esgScore: 91 },
    { id: 603, companyName: "First Solar", ticker: "FSLR", sector: "Energy", positionSize: 0, marketValue: 2700000, carbonRating: 2, esgScore: 86 },
    { id: 604, companyName: "Orsted A/S", ticker: "ORSTED", sector: "Energy", positionSize: 0, marketValue: 3100000, carbonRating: 1, esgScore: 93 }
];