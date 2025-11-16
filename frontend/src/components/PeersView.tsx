import React, { useState, useMemo } from 'react';
import { Holding } from '../types';
import { filterPeers } from '../utils/portfolio';

interface PeersViewProps {
    originalPortfolio: Holding[];
    candidatePeers: Holding[];
    onReplace: (originalHolding: Holding, peer: Holding) => void;
}

const PeersView: React.FC<PeersViewProps> = ({ originalPortfolio, candidatePeers, onReplace }) => {
    const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);

    const filteredPeers = useMemo(() => {
        if (!selectedHolding) return [];
        return filterPeers(selectedHolding, candidatePeers);
    }, [selectedHolding, candidatePeers]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Holdings selector */}
            <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Select Holding to Optimize</h3>
                    <div className="space-y-2">
                        {originalPortfolio.map(holding => (
                            <button
                                key={holding.id}
                                onClick={() => setSelectedHolding(holding)}
                                className={`w-full text-left p-3 rounded border ${selectedHolding?.id === holding.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-medium">{holding.companyName}</div>
                                <div className="text-sm text-gray-500">{holding.ticker} • {holding.sector}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Carbon: {holding.carbonRating} • ESG: {holding.esgScore}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Selected holding details and peers */}
            <div className="lg:col-span-2">
                {selectedHolding ? (
                    <>
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h3 className="font-semibold mb-3">Selected Holding</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Company</p>
                                    <p className="font-medium">{selectedHolding.companyName} ({selectedHolding.ticker})</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Sector</p>
                                    <p className="font-medium">{selectedHolding.sector}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Carbon Rating</p>
                                    <p className="font-medium">{selectedHolding.carbonRating}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">ESG Score</p>
                                    <p className="font-medium">{selectedHolding.esgScore}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50">
                                <h3 className="font-semibold">Available Peer Replacements ({filteredPeers.length})</h3>
                            </div>
                            {filteredPeers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticker</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Value</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carbon</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ESG</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredPeers.map(peer => (
                                                <tr key={peer.id}>
                                                    <td className="px-6 py-4 text-sm">{peer.companyName}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{peer.ticker}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">${(peer.marketValue / 1000000).toFixed(2)}M</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {peer.carbonRating}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {peer.esgScore}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => onReplace(selectedHolding, peer)}
                                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                                        >
                                                            Replace
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="p-6 text-gray-500">No qualifying peers found for this holding.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-white shadow rounded-lg p-12 text-center text-gray-500">
                        Select a holding from the left to view replacement options
                    </div>
                )}
            </div>
        </div>
    );
};

export default PeersView;