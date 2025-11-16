import React, { useState } from 'react';
import { fetchCompanyComparison, CompanyComparisonResponse } from '../utils/api';
import AnalyticsPanel, { AnalysisMetrics, TradeoffInsight } from './AnalyticsPanel';

const CompanyComparison: React.FC = () => {
    const [baseCompany, setBaseCompany] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CompanyComparisonResponse | null>(null);

    const generateMockMetrics = (): AnalysisMetrics => {
        const geminiTokens = Math.round(2800 + Math.random() * 1200);
        const valyuTokens = Math.round(1500 + Math.random() * 1000);
        const internalTokens = Math.round(700 + Math.random() * 300);
        const totalTokens = geminiTokens + valyuTokens + internalTokens;

        const geminiCost = (geminiTokens / 1000000) * 0.075;
        const valyuCost = (valyuTokens / 1000000) * 0.10;
        const internalCost = (internalTokens / 1000000) * 0.001;

        return {
            robustness: Math.floor(Math.random() * 20) + 80,
            traceability: Math.floor(Math.random() * 15) + 85,
            confidenceScore: Math.floor(Math.random() * 25) + 75,
            processingTime: Math.floor(Math.random() * 500) + 200,
            tokensUsed: totalTokens,
            costEstimate: geminiCost + valyuCost + internalCost,
            dataQuality: Math.floor(Math.random() * 15) + 82,
            modelVersion: 'gemini-2.0-flash-v1.2',
            analysisType: 'Company Peer Comparison',
            timestamp: new Date().toISOString(),
            tokenBreakdown: [
                {
                    provider: 'Gemini API (LLM)',
                    inputTokens: Math.round(geminiTokens * 0.55),
                    outputTokens: Math.round(geminiTokens * 0.45),
                    totalTokens: geminiTokens,
                    costPerMillion: 0.075,
                    estimatedCost: geminiCost
                },
                {
                    provider: 'Valyu API (Data)',
                    inputTokens: Math.round(valyuTokens * 0.65),
                    outputTokens: Math.round(valyuTokens * 0.35),
                    totalTokens: valyuTokens,
                    costPerMillion: 0.10,
                    estimatedCost: valyuCost
                },
                {
                    provider: 'Internal Processing',
                    inputTokens: Math.round(internalTokens * 0.6),
                    outputTokens: Math.round(internalTokens * 0.4),
                    totalTokens: internalTokens,
                    costPerMillion: 0.001,
                    estimatedCost: internalCost
                }
            ],
            decisionTrace: [
                {
                    step: 1,
                    action: 'Query financial database',
                    dataSource: 'Valyu Financial API',
                    tokensConsumed: Math.round(valyuTokens * 0.3),
                    result: 'Retrieved market cap, revenue, FCF, and carbon emissions for 50+ public companies',
                    confidence: 95
                },
                {
                    step: 2,
                    action: 'Filter by sector and size',
                    dataSource: 'Internal portfolio engine',
                    tokensConsumed: Math.round(internalTokens * 0.3),
                    result: 'Narrowed to 18 peers within 25% market cap and same sector',
                    confidence: 98
                },
                {
                    step: 3,
                    action: 'Extract and parse ESG scores',
                    dataSource: 'Valyu API + Gemini parsing',
                    tokensConsumed: Math.round((valyuTokens + geminiTokens) * 0.25),
                    result: 'Collected latest ESG scores, carbon intensity, and governance ratings',
                    confidence: 91
                },
                {
                    step: 4,
                    action: 'Semantic similarity analysis',
                    dataSource: 'Gemini LLM embeddings',
                    tokensConsumed: Math.round(geminiTokens * 0.3),
                    result: 'Ranked peers by business model, risk profile, and ESG alignment; top 5 identified',
                    confidence: 84
                },
                {
                    step: 5,
                    action: 'Generate insights and recommendations',
                    dataSource: 'Gemini synthesis + Internal metrics',
                    tokensConsumed: Math.round((geminiTokens + internalTokens) * 0.15),
                    result: 'Compiled detailed comparison insights, tradeoff analysis, and investment recommendations',
                    confidence: 86
                }
            ]
        };
    };

    const generateMockTradeoffs = (): TradeoffInsight[] => [
        {
            category: 'Speed vs Accuracy',
            description: 'Current model prioritizes accuracy over processing speed. Analysis takes 200-700ms but ensures high data quality.',
            impact: 'medium',
            recommendation: 'Consider this tradeoff acceptable for strategic portfolio decisions.'
        },
        {
            category: 'Data Coverage',
            description: 'Some companies have limited historical data availability (2024 data). May affect comparison accuracy.',
            impact: 'high',
            recommendation: 'Validate critical comparisons with additional data sources before making investment decisions.'
        },
        {
            category: 'Token Efficiency',
            description: 'Current analysis uses 5,000-8,000 tokens per comparison. Efficient for single comparisons.',
            impact: 'low',
            recommendation: 'Batch multiple comparisons for better token cost efficiency.'
        },
        {
            category: 'ESG Data Freshness',
            description: 'Environmental and Social data may lag market data by 1-2 quarters.',
            impact: 'medium',
            recommendation: 'Use ESG metrics as supporting indicators, not primary decision factors.'
        },
        {
            category: 'Model Limitations',
            description: 'AI model trained on historical data. May not capture emerging market risks or opportunities.',
            impact: 'medium',
            recommendation: 'Always validate AI recommendations with domain expertise and market analysis.'
        },
        {
            category: 'Sector Bias',
            description: 'Some industry sectors have more comprehensive data coverage than others.',
            impact: 'low',
            recommendation: 'Be cautious when comparing niche sectors with limited data.'
        }
    ];

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!baseCompany.trim()) {
            setError('Please enter a company name');
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const result = await fetchCompanyComparison(baseCompany);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Company Comparison
            </h2>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={baseCompany}
                        onChange={(e) => setBaseCompany(e.target.value)}
                        placeholder="Enter company name (e.g., Shell, Apple, Microsoft)"
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #e5e7eb',
                            fontSize: '1rem',
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? 'Loading...' : 'Compare'}
                    </button>
                </div>
            </form>

            {/* Error Message */}
            {error && (
                <div
                    style={{
                        padding: '1rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontSize: '0.875rem'
                    }}
                >
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Results Table */}
            {data && (
                <>
                    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6' }}>
                            <h3 style={{ fontWeight: 'bold' }}>
                                Companies Similar to {data.base_company}
                            </h3>
                        </div>

                        {data.rows.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Company</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Sector</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Free Cash Flow (2024)</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Market Cap (2024)</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Carbon Emissions (MtCO2e)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.rows.map((row, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '0.75rem' }}>{row.Company}</td>
                                                <td style={{ padding: '0.75rem' }}>{row.Sector}</td>
                                                <td style={{ padding: '0.75rem' }}>{row['Free Cash Flow (2024)']}</td>
                                                <td style={{ padding: '0.75rem' }}>{row['Market Cap (2024)']}</td>
                                                <td style={{ padding: '0.75rem' }}>{row['Carbon Emissions (2024 MtCO2e)']}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                No results found
                            </p>
                        )}

                        {/* Sources */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Sources</h4>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', whiteSpace: 'pre-wrap' }}>
                                Data sourced from Valyu financial and environmental databases.
                            </p>
                        </div>
                    </div>

                    {/* Analytics Panel */}
                    <AnalyticsPanel 
                        metrics={generateMockMetrics()} 
                        tradeoffs={generateMockTradeoffs()}
                    />
                </>
            )}
        </div>
    );
};

export default CompanyComparison;
