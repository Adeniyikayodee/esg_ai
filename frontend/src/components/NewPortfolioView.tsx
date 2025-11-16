import React from 'react';
import { Holding, Replacement } from '../types';
import { calculateMetrics, exportToCSV } from '../utils/portfolio';
import MetricsCard from './MetricsCard';
import PortfolioTable from './PortfolioTable';

interface NewPortfolioViewProps {
    originalPortfolio: Holding[];
    newPortfolio: Holding[];
    replacements: Replacement[];
}

const NewPortfolioView: React.FC<NewPortfolioViewProps> = ({
    originalPortfolio,
    newPortfolio,
    replacements
}) => {
    const oldMetrics = calculateMetrics(originalPortfolio);
    const newMetrics = calculateMetrics(newPortfolio);

    const carbonImprovement = ((oldMetrics.avgCarbonRating - newMetrics.avgCarbonRating) / oldMetrics.avgCarbonRating * 100).toFixed(1);
    const esgImprovement = ((newMetrics.avgEsgScore - oldMetrics.avgEsgScore) / oldMetrics.avgEsgScore * 100).toFixed(1);

    const handleExport = () => {
        exportToCSV(newPortfolio, replacements);
    };

    return (
        <div>
            {/* Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <MetricsCard metrics={oldMetrics} title="Original Portfolio" />
                <MetricsCard metrics={newMetrics} title="New Portfolio" />
            </div>

            {/* Improvement summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-green-800 font-semibold">Portfolio Improvements</p>
                        <p className="text-green-600 text-sm">
                            Carbon Rating: {carbonImprovement}% better • ESG Score: {esgImprovement}% higher
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
                    >
                        Export Portfolio
                    </button>
                </div>
            </div>

            {/* New portfolio table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <PortfolioTable portfolio={newPortfolio} showStatus={true} replacements={replacements} />
            </div>
        </div>
    );
};

export default NewPortfolioView;