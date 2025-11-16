import React from 'react';
import { Holding, Replacement } from '../types';

interface PortfolioTableProps {
    portfolio: Holding[];
    showStatus?: boolean;
    replacements?: Replacement[];
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({
    portfolio,
    showStatus = false,
    replacements = []
}) => {
    const getRatingColor = (rating: number, type: 'carbon' | 'esg') => {
        if (type === 'carbon') {
            if (rating <= 2) return 'bg-green-100 text-green-800';
            if (rating <= 3) return 'bg-yellow-100 text-yellow-800';
            return 'bg-red-100 text-red-800';
        } else {
            if (rating >= 80) return 'bg-green-100 text-green-800';
            if (rating >= 70) return 'bg-yellow-100 text-yellow-800';
            return 'bg-red-100 text-red-800';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position Size (%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbon Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESG Score</th>
                        {showStatus && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {portfolio.map((holding, idx) => {
                        const replacement = replacements.find(r => r.newId === holding.id);
                        return (
                            <tr key={holding.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{holding.companyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.ticker}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.sector}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.positionSize.toFixed(1)}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(holding.marketValue / 1000000).toFixed(2)}M</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRatingColor(holding.carbonRating, 'carbon')}`}>
                                        {holding.carbonRating}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRatingColor(holding.esgScore, 'esg')}`}>
                                        {holding.esgScore}
                                    </span>
                                </td>
                                {showStatus && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {replacement ? (
                                            <span className="text-green-600 font-medium">Replaced from {replacement.oldName}</span>
                                        ) : (
                                            <span className="text-gray-500">Original</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioTable;