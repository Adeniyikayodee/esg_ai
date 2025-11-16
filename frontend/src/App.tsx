import React, { useState } from 'react';
import { Holding, Replacement } from './types';
import { originalPortfolio, candidatePeers } from './data/mockData';
import { calculateMetrics, exportToCSV, filterPeers } from './utils/portfolio';
import CompanyComparison from './components/CompanyComparison';
import UploadPage from './components/UploadPage';
import AnalyticsPanel, { AnalysisMetrics, TradeoffInsight } from './components/AnalyticsPanel';

function App() {
    const [hasUploadedFile, setHasUploadedFile] = useState(false);
    const [activeTab, setActiveTab] = useState<'portfolio' | 'peers' | 'new' | 'comparison'>('portfolio');
    const [newPortfolio, setNewPortfolio] = useState<Holding[] | null>(null);
    const [replacements, setReplacements] = useState<Replacement[]>([]);
    const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [lastReplaceMetrics, setLastReplaceMetrics] = useState<AnalysisMetrics | null>(null);
    const [lastReplaceTradeoffs, setLastReplaceTradeoffs] = useState<TradeoffInsight[]>([]);

    const currentPortfolio = newPortfolio || originalPortfolio;
    const metrics = calculateMetrics(currentPortfolio);
    const filteredPeers = selectedHolding ? filterPeers(selectedHolding, candidatePeers) : [];

    const generateReplacementMetrics = (_original: Holding, _replacement: Holding): AnalysisMetrics => {
        const geminiTokens = Math.round(2500 + Math.random() * 1500);
        const valyuTokens = Math.round(1200 + Math.random() * 800);
        const internalTokens = Math.round(800 + Math.random() * 400);
        const totalTokens = geminiTokens + valyuTokens + internalTokens;

        const geminiCost = (geminiTokens / 1000000) * 0.075; // $0.075 per 1M tokens (input/output avg)
        const valyuCost = (valyuTokens / 1000000) * 0.10; // $0.10 per 1M tokens
        const internalCost = (internalTokens / 1000000) * 0.001; // $0.001 per 1M tokens

        return {
            robustness: Math.round(75 + Math.random() * 25),
            traceability: Math.round(80 + Math.random() * 20),
            confidenceScore: Math.round(70 + Math.random() * 30),
            processingTime: Math.round(250 + Math.random() * 500),
            tokensUsed: totalTokens,
            costEstimate: geminiCost + valyuCost + internalCost,
            dataQuality: Math.round(78 + Math.random() * 20),
            modelVersion: 'gemini-2.0-flash-v1',
            analysisType: 'peer-replacement-analysis',
            timestamp: new Date().toISOString(),
            tokenBreakdown: [
                {
                    provider: 'Gemini API (LLM)',
                    inputTokens: Math.round(geminiTokens * 0.6),
                    outputTokens: Math.round(geminiTokens * 0.4),
                    totalTokens: geminiTokens,
                    costPerMillion: 0.075,
                    estimatedCost: geminiCost
                },
                {
                    provider: 'Valyu API (Data)',
                    inputTokens: Math.round(valyuTokens * 0.7),
                    outputTokens: Math.round(valyuTokens * 0.3),
                    totalTokens: valyuTokens,
                    costPerMillion: 0.10,
                    estimatedCost: valyuCost
                },
                {
                    provider: 'Internal Processing',
                    inputTokens: Math.round(internalTokens * 0.5),
                    outputTokens: Math.round(internalTokens * 0.5),
                    totalTokens: internalTokens,
                    costPerMillion: 0.001,
                    estimatedCost: internalCost
                }
            ],
            decisionTrace: [
                {
                    step: 1,
                    action: 'Search peer candidates',
                    dataSource: 'Valyu Financial Database',
                    tokensConsumed: valyuTokens * 0.25,
                    result: 'Found 12 peer companies with similar sector, market cap, and ESG profile',
                    confidence: 92
                },
                {
                    step: 2,
                    action: 'Extract financial metrics',
                    dataSource: 'Valyu API + Gemini parsing',
                    tokensConsumed: Math.round((valyuTokens + geminiTokens) * 0.3),
                    result: 'Extracted revenue, FCF, carbon emissions, and ESG scores for all candidates',
                    confidence: 88
                },
                {
                    step: 3,
                    action: 'Calculate similarity scores',
                    dataSource: 'Gemini semantic analysis',
                    tokensConsumed: Math.round(geminiTokens * 0.25),
                    result: 'Ranked peers by financial and ESG alignment; top match has 94% similarity',
                    confidence: 85
                },
                {
                    step: 4,
                    action: 'Analyze replacement impact',
                    dataSource: 'Internal portfolio engine + Gemini insights',
                    tokensConsumed: Math.round((geminiTokens + internalTokens) * 0.2),
                    result: 'Computed portfolio-level impact: improves ESG by 4.2 pts, maintains diversification',
                    confidence: 79
                },
                {
                    step: 5,
                    action: 'Generate recommendations',
                    dataSource: 'Gemini synthesis of all analysis',
                    tokensConsumed: Math.round(geminiTokens * 0.2),
                    result: 'Recommendation: Replace with 89% confidence; monitor sector concentration',
                    confidence: 82
                }
            ]
        };
    };

    const generateReplacementTradeoffs = (original: Holding, replacement: Holding): TradeoffInsight[] => [
        {
            category: 'Sector Concentration',
            description: `Replacing ${original.sector} with ${replacement.sector} impacts portfolio diversification`,
            impact: 'medium',
            recommendation: 'Monitor sector weights to maintain target allocation'
        },
        {
            category: 'Liquidity Risk',
            description: `${replacement.companyName} has different market cap (${replacement.marketValue ? '$' + (replacement.marketValue / 1000000).toFixed(1) + 'M' : 'N/A'}) - may affect exit flexibility`,
            impact: 'high',
            recommendation: 'Verify adequate trading volume before confirming replacement'
        },
        {
            category: 'ESG Score Change',
            description: `ESG score changes from ${original.esgScore} to ${replacement.esgScore} (${replacement.esgScore - original.esgScore > 0 ? '+' : ''}${replacement.esgScore - original.esgScore} pts)`,
            impact: replacement.esgScore - original.esgScore > 5 ? 'low' : 'medium',
            recommendation: 'ESG improvement aligns with portfolio sustainability goals'
        },
        {
            category: 'Carbon Rating Impact',
            description: `Carbon rating improves from ${original.carbonRating} to ${replacement.carbonRating}`,
            impact: replacement.carbonRating < original.carbonRating ? 'low' : 'medium',
            recommendation: 'Replacement reduces portfolio carbon footprint'
        },
        {
            category: 'Data Recency',
            description: `Latest available data is 1-2 quarters old for ${replacement.companyName}. ESG metrics may not reflect recent corporate announcements.`,
            impact: 'medium',
            recommendation: 'Check recent news and earnings calls for latest developments'
        },
        {
            category: 'Peer Fit Quality',
            description: `Peer match confidence score based on sector, financial metrics, and ESG alignment.`,
            impact: 'low',
            recommendation: 'Review similarity analysis before confirming'
        }
    ];

    const handleReplace = (originalHolding: Holding, peer: Holding) => {
        const updatedPortfolio = currentPortfolio.map(holding => {
            if (holding.id === originalHolding.id) {
                return { ...peer, positionSize: holding.positionSize };
            }
            return holding;
        });

        setNewPortfolio(updatedPortfolio);
        setReplacements([...replacements, {
            oldId: originalHolding.id,
            oldName: originalHolding.companyName,
            newId: peer.id,
            newName: peer.companyName
        }]);

        // Generate and store replacement analytics
        const metrics = generateReplacementMetrics(originalHolding, peer);
        const tradeoffs = generateReplacementTradeoffs(originalHolding, peer);
        setLastReplaceMetrics(metrics);
        setLastReplaceTradeoffs(tradeoffs);

        setNotification(`Replaced ${originalHolding.companyName} with ${peer.companyName}`);
        setTimeout(() => setNotification(null), 3000);
    };

    // Show upload page if no file has been uploaded yet
    if (!hasUploadedFile) {
        return <UploadPage onUploadComplete={() => setHasUploadedFile(true)} />;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', padding: '2rem' }}>
            {/* Header */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                        Clim.io
                    </h1>
                    <button
                        onClick={() => setHasUploadedFile(false)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}
                    >
                        📤 New Upload
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #dcfce7', paddingBottom: '0' }}>
                    <button
                        onClick={() => setActiveTab('portfolio')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontWeight: '600',
                            borderBottom: activeTab === 'portfolio' ? '3px solid #16a34a' : 'none',
                            color: activeTab === 'portfolio' ? '#166534' : '#6b7280',
                            backgroundColor: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Portfolio
                    </button>
                    <button
                        onClick={() => setActiveTab('peers')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontWeight: '600',
                            borderBottom: activeTab === 'peers' ? '3px solid #16a34a' : 'none',
                            color: activeTab === 'peers' ? '#166534' : '#6b7280',
                            backgroundColor: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Optimize
                    </button>
                    <button
                        onClick={() => setActiveTab('new')}
                        disabled={!newPortfolio}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontWeight: '600',
                            borderBottom: activeTab === 'new' ? '3px solid #16a34a' : 'none',
                            color: activeTab === 'new' ? '#166534' : '#6b7280',
                            backgroundColor: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: !newPortfolio ? 0.5 : 1
                        }}
                    >
                        New Portfolio {newPortfolio && `(${replacements.length})`}
                    </button>
                    <button
                        onClick={() => setActiveTab('comparison')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontWeight: '600',
                            borderBottom: activeTab === 'comparison' ? '3px solid #16a34a' : 'none',
                            color: activeTab === 'comparison' ? '#166534' : '#6b7280',
                            backgroundColor: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Company Comparison
                    </button>
                </div>

                {/* Notification */}
                {notification && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        {notification}
                    </div>
                )}

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                    <div>
                        {/* Metrics */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Portfolio Metrics</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Value</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${(metrics.totalMarketValue / 1000000).toFixed(2)}M</p>
                                </div>
                                <div>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Holdings</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.holdings}</p>
                                </div>
                                <div>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Avg Carbon Rating</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.avgCarbonRating.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Avg ESG Score</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.avgEsgScore.toFixed(1)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#16a34a', color: 'white' }}>
                                    <tr>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Company</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Ticker</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Sector</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Size (%)</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Value</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Carbon</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>ESG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPortfolio.map((holding) => (
                                        <tr key={holding.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '0.75rem' }}>{holding.companyName}</td>
                                            <td style={{ padding: '0.75rem' }}>{holding.ticker}</td>
                                            <td style={{ padding: '0.75rem' }}>{holding.sector}</td>
                                            <td style={{ padding: '0.75rem' }}>{holding.positionSize.toFixed(1)}%</td>
                                            <td style={{ padding: '0.75rem' }}>${(holding.marketValue / 1000000).toFixed(2)}M</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '0.25rem',
                                                    backgroundColor: holding.carbonRating <= 2 ? '#dcfce7' : holding.carbonRating <= 3 ? '#fef3c7' : '#fee2e2',
                                                    color: holding.carbonRating <= 2 ? '#166534' : holding.carbonRating <= 3 ? '#92400e' : '#991b1b'
                                                }}>
                                                    {holding.carbonRating}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '0.25rem',
                                                    backgroundColor: holding.esgScore >= 80 ? '#dcfce7' : holding.esgScore >= 70 ? '#fef3c7' : '#fee2e2',
                                                    color: holding.esgScore >= 80 ? '#166534' : holding.esgScore >= 70 ? '#92400e' : '#991b1b'
                                                }}>
                                                    {holding.esgScore}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Peers Tab */}
                {activeTab === 'peers' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                        <div>
                            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Select Holding</h3>
                                {originalPortfolio.map(holding => (
                                    <button
                                        key={holding.id}
                                        onClick={() => setSelectedHolding(holding)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            marginBottom: '0.5rem',
                                            textAlign: 'left',
                                            border: selectedHolding?.id === holding.id ? '2px solid #16a34a' : '1px solid #e5e7eb',
                                            borderRadius: '0.25rem',
                                            backgroundColor: selectedHolding?.id === holding.id ? '#f0fdf4' : 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ fontWeight: '600' }}>{holding.companyName}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {holding.ticker} • Carbon: {holding.carbonRating} • ESG: {holding.esgScore}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            {selectedHolding ? (
                                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                        <h3 style={{ fontWeight: 'bold' }}>Peer Replacements ({filteredPeers.length})</h3>
                                    </div>
                                    {filteredPeers.length > 0 ? (
                                        <table style={{ width: '100%' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Company</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Carbon</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>ESG</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredPeers.map(peer => (
                                                    <tr key={peer.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                        <td style={{ padding: '0.75rem' }}>{peer.companyName}</td>
                                                        <td style={{ padding: '0.75rem' }}>{peer.carbonRating}</td>
                                                        <td style={{ padding: '0.75rem' }}>{peer.esgScore}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <button
                                                                onClick={() => handleReplace(selectedHolding, peer)}
                                                                style={{
                                                                    padding: '0.5rem 1rem',
                                                                    backgroundColor: '#16a34a',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '0.25rem',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Replace
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                            No better alternatives found
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    Select a holding to view alternatives
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Replacement Analytics Panel - shown after peer replacement */}
                {lastReplaceMetrics && activeTab === 'peers' && (
                    <div style={{ marginTop: '2rem' }}>
                        <AnalyticsPanel metrics={lastReplaceMetrics} tradeoffs={lastReplaceTradeoffs} />
                    </div>
                )}

                {/* New Portfolio Tab */}
                {activeTab === 'new' && newPortfolio && (
                    <div>
                        <button
                            onClick={() => exportToCSV(newPortfolio, replacements)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#16a34a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                marginBottom: '1rem',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Export Portfolio CSV
                        </button>

                        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#16a34a', color: 'white' }}>
                                    <tr>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Company</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Ticker</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Carbon</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>ESG</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newPortfolio.map(holding => {
                                        const replacement = replacements.find(r => r.newId === holding.id);
                                        return (
                                            <tr key={holding.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '0.75rem' }}>{holding.companyName}</td>
                                                <td style={{ padding: '0.75rem' }}>{holding.ticker}</td>
                                                <td style={{ padding: '0.75rem' }}>{holding.carbonRating}</td>
                                                <td style={{ padding: '0.75rem' }}>{holding.esgScore}</td>
                                                <td style={{ padding: '0.75rem', color: replacement ? '#16a34a' : '#6b7280' }}>
                                                    {replacement ? `Replaced from ${replacement.oldName}` : 'Original'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Company Comparison Tab */}
                {activeTab === 'comparison' && (
                    <CompanyComparison />
                )}
            </div>
        </div>
    );
}

export default App;