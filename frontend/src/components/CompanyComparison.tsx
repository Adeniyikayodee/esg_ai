import React, { useState } from 'react';
import { fetchCompanyComparison, CompanyComparisonResponse } from '../utils/api';

const CompanyComparison: React.FC = () => {
    const [baseCompany, setBaseCompany] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CompanyComparisonResponse | null>(null);

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
            )}
        </div>
    );
};

export default CompanyComparison;
