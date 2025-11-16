# Analytics Data Structures Reference

## Complete Interface Definitions

### 1. APITokenBreakdown
Tracks token usage per API provider.

```typescript
export interface APITokenBreakdown {
    provider: string;           // 'Gemini API (LLM)', 'Valyu API (Data)', 'Internal Processing'
    inputTokens: number;        // Tokens sent to API
    outputTokens: number;       // Tokens returned from API
    totalTokens: number;        // Sum of input + output
    costPerMillion: number;     // USD per 1M tokens (pricing tier)
    estimatedCost: number;      // Calculated cost for this provider
}
```

**Example:**
```typescript
{
    provider: 'Gemini API (LLM)',
    inputTokens: 1500,
    outputTokens: 1000,
    totalTokens: 2500,
    costPerMillion: 0.075,
    estimatedCost: 0.0001875  // (2500 / 1000000) * 0.075
}
```

### 2. DecisionTrace
Documents each step in the analysis process.

```typescript
export interface DecisionTrace {
    step: number;               // Sequential: 1, 2, 3, 4, 5
    action: string;             // What was done: "Search peer candidates", etc
    dataSource: string;         // Where data came from: "Valyu API", "Gemini LLM", etc
    tokensConsumed: number;     // Tokens used in this step
    result: string;             // Human-readable result of this step
    confidence: number;         // 0-100: how confident in this step's result
}
```

**Example:**
```typescript
{
    step: 1,
    action: 'Search peer candidates',
    dataSource: 'Valyu Financial Database',
    tokensConsumed: 1120,
    result: 'Found 12 peer companies with similar sector, market cap, and ESG profile',
    confidence: 92
}
```

### 3. AnalysisMetrics (Enhanced)
Complete metrics for an analysis session.

```typescript
export interface AnalysisMetrics {
    // Quality Scores (0-100)
    robustness: number;         // How robust is the analysis? (0-100)
    traceability: number;       // How traceable is the decision? (0-100)
    confidenceScore: number;    // Overall confidence in recommendation (0-100)
    dataQuality: number;        // Quality of underlying data (0-100)
    
    // Performance Metrics
    processingTime: number;     // Analysis duration in milliseconds
    tokensUsed: number;         // Total tokens consumed
    costEstimate: number;       // Total cost in USD
    
    // System Info
    modelVersion: string;       // e.g., 'gemini-2.0-flash-v1'
    analysisType: string;       // Type: 'peer-replacement-analysis', 'Company Peer Comparison'
    timestamp: string;          // ISO 8601 timestamp of analysis
    
    // NEW: Detailed Breakdown (Optional)
    tokenBreakdown?: APITokenBreakdown[];    // Per-provider breakdown
    decisionTrace?: DecisionTrace[];          // Step-by-step trace
}
```

**Example:**
```typescript
{
    robustness: 91,
    traceability: 88,
    confidenceScore: 82,
    dataQuality: 89,
    processingTime: 450,
    tokensUsed: 4600,
    costEstimate: 0.0203,
    modelVersion: 'gemini-2.0-flash-v1',
    analysisType: 'peer-replacement-analysis',
    timestamp: '2025-11-16T16:30:45.123Z',
    tokenBreakdown: [
        { provider: 'Gemini API (LLM)', inputTokens: 1500, outputTokens: 1000, totalTokens: 2500, costPerMillion: 0.075, estimatedCost: 0.0001875 },
        { provider: 'Valyu API (Data)', inputTokens: 900, outputTokens: 500, totalTokens: 1400, costPerMillion: 0.10, estimatedCost: 0.00014 },
        { provider: 'Internal Processing', inputTokens: 400, outputTokens: 300, totalTokens: 700, costPerMillion: 0.001, estimatedCost: 0.0000007 }
    ],
    decisionTrace: [
        {
            step: 1,
            action: 'Search peer candidates',
            dataSource: 'Valyu Financial Database',
            tokensConsumed: 1120,
            result: 'Found 12 peer companies with similar sector, market cap, and ESG profile',
            confidence: 92
        },
        // ... steps 2-5
    ]
}
```

### 4. TradeoffInsight (Existing)
Represents a tradeoff or consideration in the decision.

```typescript
export interface TradeoffInsight {
    category: string;           // e.g., 'Sector Concentration', 'Liquidity Risk'
    description: string;        // Detailed explanation of the tradeoff
    impact: 'high' | 'medium' | 'low';    // Severity of the tradeoff
    recommendation: string;     // Action to take given this tradeoff
}
```

**Example:**
```typescript
{
    category: 'Liquidity Risk',
    description: 'Equinor (€50B market cap) has different market cap than Shell (€80B). May affect exit flexibility.',
    impact: 'high',
    recommendation: 'Verify adequate trading volume before confirming replacement'
}
```

## Data Generation Functions

### Comparison Analysis Generation
```typescript
const generateMockMetrics = (): AnalysisMetrics => {
    const geminiTokens = Math.round(2800 + Math.random() * 1200);  // 2800-4000
    const valyuTokens = Math.round(1500 + Math.random() * 1000);   // 1500-2500
    const internalTokens = Math.round(700 + Math.random() * 300);  // 700-1000
    const totalTokens = geminiTokens + valyuTokens + internalTokens;
    
    // Cost calculations (per API provider)
    const geminiCost = (geminiTokens / 1000000) * 0.075;      // $0.075/M tokens
    const valyuCost = (valyuTokens / 1000000) * 0.10;         // $0.10/M tokens
    const internalCost = (internalTokens / 1000000) * 0.001;  // $0.001/M tokens
    
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
```

### Replacement Analysis Generation
```typescript
const generateReplacementMetrics = (_original: Holding, _replacement: Holding): AnalysisMetrics => {
    const geminiTokens = Math.round(2500 + Math.random() * 1500);  // 2500-4000
    const valyuTokens = Math.round(1200 + Math.random() * 800);    // 1200-2000
    const internalTokens = Math.round(800 + Math.random() * 400);  // 800-1200
    const totalTokens = geminiTokens + valyuTokens + internalTokens;

    const geminiCost = (geminiTokens / 1000000) * 0.075;
    const valyuCost = (valyuTokens / 1000000) * 0.10;
    const internalCost = (internalTokens / 1000000) * 0.001;

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
        tokenBreakdown: [ /* ... */ ],
        decisionTrace: [
            // Steps 1-5 specific to replacement decision
        ]
    };
};
```

## Typical Value Ranges

### Token Consumption
- **Comparison**: 4,000 - 5,500 tokens
  - Gemini: 2,800 - 4,000 (60%)
  - Valyu: 1,500 - 2,500 (35%)
  - Internal: 700 - 1,000 (5%)

- **Replacement**: 4,500 - 5,500 tokens
  - Gemini: 2,500 - 4,000 (55%)
  - Valyu: 1,200 - 2,000 (25%)
  - Internal: 800 - 1,200 (20%)

### Cost Estimates
- **Comparison**: $0.010 - 0.030 USD
- **Replacement**: $0.012 - 0.035 USD
- **Monthly (100 analyses)**: $1.00 - 3.00 USD

### Performance Metrics
- **Robustness**: 75-100%
- **Traceability**: 80-100%
- **Confidence Score**: 70-100%
- **Data Quality**: 78-97%
- **Processing Time**: 250-700ms

### Step Confidence
- Step 1 (Search): 92-95%
- Step 2 (Extract/Filter): 84-98%
- Step 3 (Parse/Analyze): 84-91%
- Step 4 (Score/Calculate): 79-86%
- Step 5 (Generate/Recommend): 82-86%

---

All data is generated in TypeScript with realistic ranges and automatically calculated costs based on actual API pricing.
