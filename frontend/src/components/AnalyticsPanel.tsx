import React from 'react';

export interface APITokenBreakdown {
    provider: string; // 'Gemini', 'Valyu', 'Internal'
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    costPerMillion: number; // USD per 1M tokens
    estimatedCost: number;
}

export interface DecisionTrace {
    step: number;
    action: string;
    dataSource: string;
    tokensConsumed: number;
    result: string;
    confidence: number;
}

export interface AnalysisMetrics {
    robustness: number; // 0-100
    traceability: number; // 0-100
    confidenceScore: number; // 0-100
    processingTime: number; // ms
    tokensUsed: number;
    costEstimate: number; // USD
    dataQuality: number; // 0-100
    modelVersion: string;
    analysisType: string;
    timestamp: string;
    tokenBreakdown?: APITokenBreakdown[];
    decisionTrace?: DecisionTrace[];
}

export interface TradeoffInsight {
    category: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    recommendation: string;
}

interface AnalyticsPanel {
    metrics: AnalysisMetrics;
    tradeoffs: TradeoffInsight[];
}

const AnalyticsPanel: React.FC<AnalyticsPanel> = ({ metrics, tradeoffs }) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return '#16a34a';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
        switch (impact) {
            case 'high':
                return '#ef4444';
            case 'medium':
                return '#f59e0b';
            case 'low':
                return '#3b82f6';
            default:
                return '#6b7280';
        }
    };

    const ScoreCard = ({ label, value, unit }: { label: string; value: number; unit?: string }) => (
        <div style={{
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '0.75rem',
            borderLeft: `4px solid ${getScoreColor(value)}`
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
            }}>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    fontWeight: '600'
                }}>
                    {label}
                </p>
                <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: getScoreColor(value)
                }}>
                    {value}
                    {unit && <span style={{ fontSize: '0.875rem', marginLeft: '0.25rem' }}>{unit}</span>}
                </span>
            </div>
            <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${Math.min(value, 100)}%`,
                    backgroundColor: getScoreColor(value),
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );

    return (
        <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginTop: '1.5rem'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid #e5e7eb'
            }}>
                <div style={{
                    fontSize: '1.5rem',
                    marginRight: '0.75rem'
                }}>
                    🔬
                </div>
                <div>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        color: '#111827',
                        margin: '0 0 0.25rem 0'
                    }}>
                        Analysis Metrics & Insights
                    </h3>
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        margin: '0'
                    }}>
                        {metrics.analysisType} • {metrics.timestamp}
                    </p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '1.5rem'
            }}>
                {/* Left Column - Quality Metrics */}
                <div>
                    <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: '#374151',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        🎯 Quality Metrics
                    </h4>
                    <ScoreCard label="Robustness" value={metrics.robustness} unit="%" />
                    <ScoreCard label="Traceability" value={metrics.traceability} unit="%" />
                    <ScoreCard label="Confidence Score" value={metrics.confidenceScore} unit="%" />
                    <ScoreCard label="Data Quality" value={metrics.dataQuality} unit="%" />
                </div>

                {/* Right Column - Usage & Cost */}
                <div>
                    <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: '#374151',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        💰 Usage & Performance
                    </h4>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '0.75rem',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                            ⚡ Processing Time
                        </p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>
                            {metrics.processingTime}
                            <span style={{ fontSize: '0.875rem', marginLeft: '0.25rem' }}>ms</span>
                        </p>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '0.75rem',
                        borderLeft: '4px solid #8b5cf6'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                            🔤 Tokens Used
                        </p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0' }}>
                            {metrics.tokensUsed.toLocaleString()}
                            <span style={{ fontSize: '0.875rem', marginLeft: '0.25rem' }}>tokens</span>
                        </p>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        borderLeft: '4px solid #06b6d4'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                            💵 Estimated Cost
                        </p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4', margin: '0' }}>
                            ${metrics.costEstimate.toFixed(4)}
                            <span style={{ fontSize: '0.875rem', marginLeft: '0.25rem' }}>USD</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Model & System Info */}
            <div style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                }}>
                    <div>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#9ca3af',
                            margin: '0 0 0.25rem 0',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            Model Version
                        </p>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#374151',
                            margin: '0',
                            fontFamily: 'monospace'
                        }}>
                            {metrics.modelVersion}
                        </p>
                    </div>
                    <div>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#9ca3af',
                            margin: '0 0 0.25rem 0',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            Analysis Timestamp
                        </p>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#374151',
                            margin: '0',
                            fontFamily: 'monospace'
                        }}>
                            {new Date(metrics.timestamp).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tradeoffs Section */}
            {tradeoffs.length > 0 && (
                <div>
                    <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: '#374151',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>⚙️</span>
                        Tradeoff Insights & Recommendations
                    </h4>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem'
                    }}>
                        {tradeoffs.map((tradeoff, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: 'white',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    borderLeft: `4px solid ${getImpactColor(tradeoff.impact)}`,
                                    border: `1px solid ${getImpactColor(tradeoff.impact)}33`
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                    marginBottom: '0.5rem'
                                }}>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold',
                                        color: '#111827',
                                        margin: '0'
                                    }}>
                                        {tradeoff.category}
                                    </p>
                                    <span style={{
                                        fontSize: '0.625rem',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        backgroundColor: getImpactColor(tradeoff.impact),
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.25rem',
                                        textTransform: 'uppercase'
                                    }}>
                                        {tradeoff.impact}
                                    </span>
                                </div>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280',
                                    margin: '0.5rem 0',
                                    lineHeight: '1.4'
                                }}>
                                    {tradeoff.description}
                                </p>
                                <div style={{
                                    padding: '0.5rem',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '0.25rem',
                                    marginTop: '0.5rem'
                                }}>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: '#374151',
                                        margin: '0',
                                        fontStyle: 'italic'
                                    }}>
                                        💡 {tradeoff.recommendation}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* API Token Breakdown */}
            {metrics.tokenBreakdown && metrics.tokenBreakdown.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: '#374151',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>🔑</span>
                        API Token Usage Breakdown
                    </h4>

                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.875rem'
                        }}>
                            <thead>
                                <tr style={{
                                    backgroundColor: '#f3f4f6',
                                    borderBottom: '1px solid #e5e7eb'
                                }}>
                                    <th style={{
                                        padding: '0.75rem',
                                        textAlign: 'left',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>API Provider</th>
                                    <th style={{
                                        padding: '0.75rem',
                                        textAlign: 'right',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>Input</th>
                                    <th style={{
                                        padding: '0.75rem',
                                        textAlign: 'right',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>Output</th>
                                    <th style={{
                                        padding: '0.75rem',
                                        textAlign: 'right',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>Total</th>
                                    <th style={{
                                        padding: '0.75rem',
                                        textAlign: 'right',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.tokenBreakdown.map((breakdown, idx) => (
                                    <tr
                                        key={idx}
                                        style={{
                                            borderBottom: idx < metrics.tokenBreakdown!.length - 1 ? '1px solid #e5e7eb' : 'none',
                                            backgroundColor: idx % 2 === 0 ? '#fafafa' : 'white'
                                        }}
                                    >
                                        <td style={{
                                            padding: '0.75rem',
                                            fontWeight: '600',
                                            color: '#111827'
                                        }}>
                                            {breakdown.provider}
                                        </td>
                                        <td style={{
                                            padding: '0.75rem',
                                            textAlign: 'right',
                                            color: '#6b7280'
                                        }}>
                                            {breakdown.inputTokens.toLocaleString()}
                                        </td>
                                        <td style={{
                                            padding: '0.75rem',
                                            textAlign: 'right',
                                            color: '#6b7280'
                                        }}>
                                            {breakdown.outputTokens.toLocaleString()}
                                        </td>
                                        <td style={{
                                            padding: '0.75rem',
                                            textAlign: 'right',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}>
                                            {breakdown.totalTokens.toLocaleString()}
                                        </td>
                                        <td style={{
                                            padding: '0.75rem',
                                            textAlign: 'right',
                                            fontWeight: '600',
                                            color: '#06b6d4'
                                        }}>
                                            ${breakdown.estimatedCost.toFixed(4)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Decision Trace - How we arrived at the decision */}
            {metrics.decisionTrace && metrics.decisionTrace.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: '#374151',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>🔍</span>
                        Decision Trace & Process Flow
                    </h4>

                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        padding: '1rem'
                    }}>
                        {metrics.decisionTrace.map((trace, idx) => (
                            <div key={idx} style={{ marginBottom: idx < metrics.decisionTrace!.length - 1 ? '1.25rem' : '0' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem'
                                }}>
                                    {/* Timeline dot */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        minWidth: '40px'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: '#16a34a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '0.875rem'
                                        }}>
                                            {trace.step}
                                        </div>
                                        {idx < metrics.decisionTrace!.length - 1 && (
                                            <div style={{
                                                width: '2px',
                                                height: '60px',
                                                backgroundColor: '#d1d5db',
                                                marginTop: '0.5rem'
                                            }} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, paddingTop: '0.25rem' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div>
                                                <p style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#111827',
                                                    margin: '0 0 0.25rem 0'
                                                }}>
                                                    {trace.action}
                                                </p>
                                                <p style={{
                                                    fontSize: '0.75rem',
                                                    color: '#6b7280',
                                                    margin: '0'
                                                }}>
                                                    From: <span style={{ fontWeight: '600' }}>{trace.dataSource}</span>
                                                </p>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    backgroundColor: '#dbeafe',
                                                    color: '#1e40af',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '0.25rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {trace.tokensConsumed} tokens
                                                </span>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    backgroundColor: trace.confidence >= 80 ? '#dcfce7' : trace.confidence >= 60 ? '#fef3c7' : '#fee2e2',
                                                    color: trace.confidence >= 80 ? '#166534' : trace.confidence >= 60 ? '#92400e' : '#991b1b',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '0.25rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {trace.confidence}% confidence
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{
                                            backgroundColor: '#f9fafb',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '0.25rem',
                                            borderLeft: '3px solid #06b6d4'
                                        }}>
                                            <p style={{
                                                fontSize: '0.75rem',
                                                color: '#374151',
                                                margin: '0',
                                                fontStyle: 'italic'
                                            }}>
                                                📌 {trace.result}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Legend */}
            <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb',
                fontSize: '0.75rem',
                color: '#9ca3af'
            }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Score Interpretation:</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div>
                        <span style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#16a34a',
                            borderRadius: '2px',
                            marginRight: '0.25rem'
                        }} />
                        ≥80: Excellent
                    </div>
                    <div>
                        <span style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#f59e0b',
                            borderRadius: '2px',
                            marginRight: '0.25rem'
                        }} />
                        60-79: Good
                    </div>
                    <div>
                        <span style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#ef4444',
                            borderRadius: '2px',
                            marginRight: '0.25rem'
                        }} />
                        &lt;60: Needs Improvement
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
