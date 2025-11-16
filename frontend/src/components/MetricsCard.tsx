import React from 'react';
import { PortfolioMetrics } from '../types';

interface MetricsCardProps {
    metrics: PortfolioMetrics;
    title: string;
    variant?: 'default' | 'comparison';
}

const MetricsCard: React.FC<MetricsCardProps> = ({ metrics, title, variant = 'default' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${variant === 'comparison' ? 'border-2 border-green-100' : ''}`}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">Total Value</p>
                        <p className="text-2xl font-bold text-gray-900">${(metrics.totalMarketValue / 1000000).toFixed(2)}M</p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">Holdings</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.holdings}</p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">Carbon Rating</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.avgCarbonRating.toFixed(2)}</p>
                        <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${metrics.avgCarbonRating <= 2 ? 'bg-green-500' :
                                            metrics.avgCarbonRating <= 3 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                        }`}
                                    style={{ width: `${(5 - metrics.avgCarbonRating) * 20}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">ESG Score</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.avgEsgScore.toFixed(1)}</p>
                        <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${metrics.avgEsgScore >= 80 ? 'bg-green-500' :
                                            metrics.avgEsgScore >= 70 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                        }`}
                                    style={{ width: `${metrics.avgEsgScore}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsCard;