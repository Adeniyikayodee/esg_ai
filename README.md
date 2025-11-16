# CLIM.IO

CLIM.IO is a climate-aware fund intelligence tool that helps investors and portfolio managers align portfolios with environmental, social, and governance (ESG) objectives. It combines AI-powered portfolio insights with live ESG and financial data from the **VALYU API**.

**Live site:** https://esgai-phi.vercel.app/

---

## 1. Code and Repro Instructions

### 1.1. Prerequisites

- Node.js (LTS recommended)
- npm / yarn / pnpm
- A **VALYU** API key

### 1.2. Environment variables

Create a `.env.local` file in the project root and add:

```bash
VALYU_API_KEY=your_valyu_api_key_here
VALYU_API_BASE_URL=https://api.valyu.example  # replace with the actual base URL
```

Add any additional keys for logging, analytics, or monitoring services that you integrate during deployment.

### 1.3. Installation

```bash
# 1. Clone the repository
git clone <YOUR_REPO_URL>
cd <YOUR_PROJECT_FOLDER>

# 2. Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 1.4. Local development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Once the dev server starts, open the printed local URL in your browser to access the **CLIM.IO** interface.

### 1.5. Production build

```bash
npm run build
npm run start
```

This flow aligns with typical Vercel and Node.js deployment pipelines.

---

## 3. Project Overview

### 3.1. Problem

Portfolio teams face pressure to integrate climate and ESG considerations into investment decisions while still monitoring performance, risk, and concentration. ESG data sits across multiple platforms and formats, so a simple question such as:

- How climate-aligned is this fund?
- Which holdings drag the portfolio away from ESG targets?
- What rebalancing moves shift the portfolio toward a climate goal with minimal disruption?

often turns into a manual exercise across spreadsheets, PDFs, and dashboards.

### 3.2. What CLIM.IO does

**CLIM.IO** focuses on climate-aligned fund analytics with three core capabilities:

- **Ingest portfolios**  
  Users can load holdings (for example, tickers and weights) for a fund or model portfolio.

- **Enrich with ESG and financial data via VALYU**  
  The application calls the **VALYU API** to retrieve:
  - ESG and climate metrics per security  
  - Financial indicators relevant for portfolio construction

- **Surface portfolio-level insights**  
  CLIM.IO aggregates security-level data into:
  - Portfolio-level ESG and climate scores  
  - Contribution analysis to highlight holdings that drive climate or ESG risk  
  - Simple “what-if” style insights for reallocations and re-weighting

This flow turns a static fund holding file into an interactive climate-aware view of the portfolio.

### 3.3. How VALYU is used

VALYU serves as the primary data backbone for the app:

- Provides up-to-date ESG and climate indicators at security level.
- Supplies core financial metrics so ESG alignment remains linked to performance and risk.
- Acts as a consistent, API-driven source of truth for portfolio enrichment.

CLIM.IO queries VALYU from a backend or serverless layer, normalises the responses, and then feeds clean, structured data into the analytics and UI components.

### 3.4. High-level architecture

Conceptually, CLIM.IO has three layers:

1. **Interface layer (Frontend)**  
   - Web UI deployed on Vercel  
   - Components for:
     - Portfolio upload or selection
     - ESG and climate visualisations (tables, charts, summaries)
     - Explanatory panels showing which holdings influence scores

2. **Application / orchestration layer**  
   - Business logic for:
     - Validating portfolio input formats
     - Orchestrating calls to VALYU
     - Aggregating, scoring, and ranking holdings
     - Structuring data for “fund-level” and “position-level” insights

3. **Data and integrations layer**  
   - **VALYU API** for ESG and financial data
   - Optional observability hooks (logging, metrics, tracing) designed for performance and robustness assessment in hackathon settings

### 3.5. Intended users

CLIM.IO targets:

- **Fund managers and PMs**  
  who want a fast read on the climate and ESG profile of a fund.

- **Sustainability, risk, and stewardship teams**  
  who monitor exposure to climate-sensitive sectors, issuers, or themes.

- **Innovation and climate-finance teams**  
  building internal prototypes that connect LLM-powered workflows with ESG data.

### 3.6. Current focus and future extensions

Current emphasis:

- Quick climate and ESG profiling of portfolios.
- Transparent link between holdings and their ESG contribution.
- Lightweight UX that supports demos, experiments, and early pilots.

Natural extensions:

- Constraint-based portfolio tilting toward climate targets.
- Scenario and stress analysis around specific themes or sectors.
- Exportable reports for investment committees and client updates.
- Deeper integration of AI assistants that explain ESG shifts in plain language.

---

## 4. Demo

- **Live app:** [https://esgai-phi.vercel.app/](https://esgai-phi.vercel.app/)
- **Demo video:** _Add your recorded demo link here (for example, Loom or YouTube)_

The live link gives reviewers and judges a hands-on view of **CLIM.IO**, while the demo video provides a guided walkthrough of the main flows and design decisions.
