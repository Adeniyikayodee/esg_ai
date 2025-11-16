# Analytics Panel - Visual Display Guide

## 1. API Token Usage Breakdown Table

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔑 API TOKEN USAGE BREAKDOWN                                       │
├─────────────────────────────────────────────────────────────────────┤
│ API Provider          | Input    | Output   | Total   | Cost        │
├──────────────────────┼──────────┼──────────┼─────────┼─────────────┤
│ Gemini API (LLM)     | 1,500    | 1,000    | 2,500   | $0.0002     │
│ Valyu API (Data)     | 900      | 500      | 1,400   | $0.0001     │
│ Internal Processing  | 400      | 300      | 700     | $0.0000     │
└─────────────────────────────────────────────────────────────────────┘

Total Tokens: 4,600 | Total Cost: $0.0203 USD
```

## 2. Decision Trace - Process Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔍 DECISION TRACE & PROCESS FLOW                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Search peer candidates                                            │
│  │  From: Valyu Financial Database                                   │
│  │  ├─ 1,120 tokens consumed                                         │
│  │  └─ 92% confidence                                                │
│  │  📌 Found 12 peer companies with similar sector, market cap,      │
│  │     and ESG profile                                               │
│  │                                                                    │
│  ├─────────────────────────────────────────────────────────────────│
│  │                                                                    │
│  ② Extract financial metrics                                         │
│  │  From: Valyu API + Gemini parsing                                 │
│  │  ├─ 980 tokens consumed                                           │
│  │  └─ 88% confidence                                                │
│  │  📌 Extracted revenue, FCF, carbon emissions, and ESG scores      │
│  │     for all candidates                                            │
│  │                                                                    │
│  ├─────────────────────────────────────────────────────────────────│
│  │                                                                    │
│  ③ Calculate similarity scores                                       │
│  │  From: Gemini semantic analysis                                   │
│  │  ├─ 625 tokens consumed                                           │
│  │  └─ 85% confidence                                                │
│  │  📌 Ranked peers by financial and ESG alignment; top match has    │
│  │     94% similarity                                                │
│  │                                                                    │
│  ├─────────────────────────────────────────────────────────────────│
│  │                                                                    │
│  ④ Analyze replacement impact                                        │
│  │  From: Internal portfolio engine + Gemini insights                │
│  │  ├─ 1,080 tokens consumed                                         │
│  │  └─ 79% confidence                                                │
│  │  📌 Computed portfolio-level impact: improves ESG by 4.2 pts,    │
│  │     maintains diversification                                     │
│  │                                                                    │
│  ├─────────────────────────────────────────────────────────────────│
│  │                                                                    │
│  ⑤ Generate recommendations                                          │
│  │  From: Gemini synthesis of all analysis                           │
│  │  ├─ 795 tokens consumed                                           │
│  │  └─ 82% confidence                                                │
│  │  📌 Recommendation: Replace with 89% confidence; monitor sector   │
│  │     concentration                                                 │
│  │                                                                    │
│  └─────────────────────────────────────────────────────────────────│
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 3. Full Analytics Panel Layout

```
┌───────────────────────────────────────────────────────────────────────┐
│                  🔬 ANALYSIS METRICS & INSIGHTS                       │
│           peer-replacement-analysis • 2025-11-16 16:30:45 UTC        │
├───────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────┬──────────────────────────────────────┐ │
│  │ 🎯 QUALITY METRICS       │ 💰 USAGE & PERFORMANCE             │ │
│  ├──────────────────────────┼──────────────────────────────────────┤ │
│  │                          │                                      │ │
│  │ Robustness: 91% ████████ │ ⚡ Processing Time: 450 ms         │ │
│  │ Traceability: 88% █████ │ 🔤 Tokens Used: 4,600 tokens       │ │
│  │ Confidence Score: 82% ██ │ 💵 Estimated Cost: $0.0203 USD     │ │
│  │ Data Quality: 89% ███████│                                      │ │
│  │                          │                                      │ │
│  └──────────────────────────┴──────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │ Model Version: gemini-2.0-flash-v1                            │   │
│  │ Analysis Timestamp: November 16, 2025 4:30:45 PM             │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  🔑 API TOKEN USAGE BREAKDOWN                                        │
│  [Token Breakdown Table - See above]                                 │
│                                                                         │
│  🔍 DECISION TRACE & PROCESS FLOW                                    │
│  [Decision Timeline - See above]                                     │
│                                                                         │
│  ⚙️ TRADEOFF INSIGHTS & RECOMMENDATIONS                               │
│  ┌────────────────────────────┬────────────────────────────────────┐ │
│  │ Sector Concentration       │ Liquidity Risk                     │ │
│  │ [MEDIUM]                   │ [HIGH]                             │ │
│  │ Replacing Energy with Tech │ Market cap of $50B may affect      │ │
│  │ Monitor sector weights     │ exit flexibility                   │ │
│  │ to maintain target         │ Verify adequate trading volume     │ │
│  │ allocation                 │ before confirming                  │ │
│  ├────────────────────────────┼────────────────────────────────────┤ │
│  │ ESG Score Change           │ Carbon Rating Impact               │ │
│  │ [LOW]                      │ [MEDIUM]                           │ │
│  │ Improves from 72 to 76     │ Carbon rating improves from 2 to 1 │ │
│  │ ESG improvement aligns     │ Replacement reduces portfolio      │ │
│  │ with portfolio goals       │ carbon footprint                   │ │
│  └────────────────────────────┴────────────────────────────────────┘ │
│                                                                         │
│  Score Interpretation:                                                │
│  ■ ≥80: Excellent   ■ 60-79: Good   ■ <60: Needs Improvement        │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
```

## 4. Color-Coding System

### Confidence Badges
- 🟢 **Green** (≥80%): Excellent confidence - proceed with recommendation
- 🟡 **Amber** (60-79%): Good confidence - review before acting
- 🔴 **Red** (<60%): Needs improvement - validate with additional sources

### Impact Severity
- 🔴 **HIGH** (Red): Major portfolio impact, requires careful review
- 🟡 **MEDIUM** (Amber): Moderate impact, recommend monitoring
- 🔵 **LOW** (Blue): Minor impact, generally safe to proceed

## 5. Token Breakdown Visual Representation

```
Total API Tokens: 4,600

Gemini (54%)  ██████████████████████████
Valyu (30%)   ██████████████
Internal (16%) ████████

Cost Breakdown:
Gemini:   $0.000188 (63%)
Valyu:    $0.000140 (34%)
Internal: $0.000000 (3%)
─────────────────────
Total:    $0.000328 USD
```

## 6. User Workflow

### When Replacing a Holding:
```
User clicks "Replace" 
    ↓
Analytics Panel appears showing:
  - API Token breakdown (Gemini, Valyu, Internal)
  - 5-step decision trace with confidence scores
  - Tradeoff insights and recommendations
  - Final recommendation with reasoning
    ↓
User reviews data
    ↓
Confirms replacement with full traceability
```

### When Comparing Companies:
```
User enters company name
    ↓
Comparison Analysis runs
    ↓
Results table appears + Analytics Panel showing:
  - Token consumption per API
  - How peers were selected (5-step process)
  - Data quality and confidence metrics
  - Cost of the analysis
    ↓
User reviews peer recommendations
    ↓
Can select peers for replacement with full audit trail
```

## 7. Professional Qualities

✅ **Transparency**: Every token is tracked and visible
✅ **Auditability**: Complete decision path documented
✅ **Accountability**: Cost visibility for each analysis
✅ **Traceability**: Know which API/data source was used at each step
✅ **Enterprise-Grade**: Professional UX suitable for financial institutions
✅ **Compliance-Ready**: Audit trail for regulatory requirements

---

**Example Scenario:**
A portfolio manager wants to replace Shell (Energy, ESG 65) with a better peer.

1. System queries Valyu DB → finds 12 energy sector peers (92% confidence, 1,120 tokens)
2. Gemini analyzes ESG alignment → identifies Equinor as top match (85% confidence, 625 tokens)
3. Internal engine calculates impact → ESG improves to 76, diversification maintained (79% confidence)
4. Final recommendation → Replace Shell with Equinor (82% confidence)
5. Total cost: $0.0203 | Total tokens: 4,600

User sees full breakdown and can confidently make the decision.
