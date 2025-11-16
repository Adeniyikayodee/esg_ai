import React from 'react';
import { Holding } from '../types';
import { calculateMetrics } from '../utils/portfolio';
import MetricsCard from './MetricsCard';
import PortfolioTable from './PortfolioTable';

interface PortfolioViewProps {
    portfolio: Holding[];
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ portfolio }) => {
    const metrics = calculateMetrics(portfolio);

    return (
        <div>
            <MetricsCard metrics={metrics} title="Current Portfolio Metrics" />
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <PortfolioTable portfolio={portfolio} />
            </div>
        </div>
    );
};

export default PortfolioView;