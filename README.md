# CLIM.IO

CLIM.IO is a climate-aware fund intelligence tool that helps investors and portfolio managers align portfolios with environmental, social, and governance (ESG) objectives. It combines AI-powered portfolio insights with live ESG and financial data from the **VALYU API**.

**Live site:** https://esgai-phi.vercel.app/

---

## 1. Code and Repro Instructions

### 1.1. Prerequisites

- Node.js (LTS recommended)
- npm / yarn / pnpm
- A **VALYU** API key (for ESG and financial data)
- A **Gemini** API key (for LLM-powered peer discovery and data extraction)
- (Optional) Credentials for any Earth observation / geospatial backend you plug in

### 1.2. Environment variables

Create a `.env.local` file in the project root and add:

```bash
# Valyu configuration
VALYU_API_KEY=your_valyu_api_key_here
VALYU_API_BASE_URL=https://api.valyu.example   # replace with the actual Valyu search endpoint

# Gemini configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash   # or another compatible Gemini model


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

Portfolio teams face steady pressure to integrate climate and ESG considerations into investment decisions while monitoring performance, risk, and concentration. ESG data sits across multiple platforms and formats, so a simple question such as:

- How climate-aligned is this fund?
- Which holdings drag the portfolio away from ESG targets?
- What rebalancing moves shift the portfolio toward a climate goal with minimal disruption?

often turns into a manual exercise across spreadsheets, PDFs, and dashboards, with limited use of spatial or physical climate information and little automation around peer comparison.

### 3.2. What CLIM.IO does

**CLIM.IO** focuses on climate-aligned fund analytics with several core capabilities:

- **Ingest portfolios**  
  Users can load holdings (for example, tickers and weights) for a fund or model portfolio.

- **Enrich with ESG, climate, and financial data via VALYU**  
  The application calls the **VALYU API** to retrieve:
  - ESG and climate metrics per security  
  - Financial indicators relevant for portfolio construction  
  - Additional sustainability metrics (for example, sector-level decarbonisation progress, controversy flags, and transition indicators where available)

- **LLM-powered peer comparison**  
  A Gemini-based research layer proposes financially similar peers (sector, business model, market cap, geography), then uses Valyu search plus AI extraction to build a side-by-side table of free cash flow, market cap, sector, and carbon emissions. This helps fund managers identify lower-emission peers that preserve financial characteristics.

- **Integrate Earth observation and satellite information**  
  CLIM.IO is designed to incorporate geospatial climate indicators derived from **Sentinel-2** (optical imagery) and **Sentinel-5** (atmospheric composition) to:
  - Track physical climate signals around assets, sectors, or regions in near real time  
  - Overlay satellite-based indicators (for example, land-cover change, pollution hotspots, or emission proxies) on portfolios  
  - Enrich ESG metrics with spatial context that links reported data to observable patterns  

- **Surface portfolio-level insights**  
  CLIM.IO aggregates security-level data into:
  - Portfolio-level ESG and climate scores  
  - Contribution analysis that highlights holdings driving climate or ESG risk  
  - Simple “what-if” style insights for reallocations and re-weighting  

This flow turns a static fund holding file into an interactive, climate-aware view of the portfolio that combines financials, ESG metrics, peer alternatives, and geospatial context.

### 3.3. Plugin-style integration and workspace

CLIM.IO is built to run as both a **standalone app** and a **plugin layer** inside existing investment stacks:

- **Plugin mode**  
  - Exposes an API and integration hooks that allow CLIM.IO to plug into portfolio management systems, risk dashboards, order management systems, or ESG platforms.  
  - Can automatically scan a universe of funds or model portfolios, apply ESG and climate criteria, and return a ranked or filtered list of candidate funds that match a given brief (for example, “low carbon intensity”, “reduced coal exposure”, “climate-aligned peer set”).

- **Workspace mode**  
  - Provides a shared workspace where teams can:
    - Save portfolios, scenarios, and tilts  
    - Compare multiple funds or strategies side by side  
    - Add notes or rationales linked to specific screens or views  
    - Create a repeatable workflow for climate and ESG due diligence  

This design allows CLIM.IO to slot into existing processes with minimal friction: as a lightweight ESG fund selector, a climate overlay for current tools, or a collaborative workspace for sustainability and investment teams.

### 3.4. How VALYU is used

VALYU serves as the primary data backbone for the app:

- Provides up-to-date ESG and climate indicators at security level.  
- Supplies core financial metrics so ESG alignment stays linked to performance and risk.  
- Acts as a consistent, API-driven source of truth for portfolio enrichment.

CLIM.IO orchestrates Valyu in **micro-steps** rather than single, heavy queries: separate searches for financials and emissions, followed by targeted fallback searches when fields are missing. An LLM extraction layer then converts these heterogeneous results into strict JSON (for example, 2024 free cash flow, 2024 market cap, sector, MtCO₂e emissions) with source IDs that map back to Valyu results, titles, and URLs. This pattern respects timeouts while keeping the data product reliable and explainable.

### 3.5. High-level architecture

Conceptually, CLIM.IO has three layers:

1. **Interface layer (Frontend)**  
   - Web UI deployed on Vercel  
   - Components for:
     - Portfolio upload or selection  
     - ESG and climate visualisations (tables, charts, summaries)  
     - Explanatory panels showing which holdings influence scores  
     - Workspace views that group portfolios, scenarios, and notes  

2. **Application / orchestration layer**  
   - Business logic for:
     - Validating portfolio input formats  
     - Orchestrating calls to VALYU and, where configured, satellite or geospatial services  
     - Running the LLM-based peer comparison and data extraction pipeline  
     - Aggregating, scoring, and ranking holdings  
     - Structuring data for “fund-level”, “position-level”, and “scenario-level” insights  
     - Operating in plugin mode, where other systems call CLIM.IO endpoints to score and select funds automatically  

3. **Data and integrations layer**  
   - **VALYU API** for ESG and financial data  
   - Optional Earth observation pipelines for Sentinel-2 and Sentinel-5 based indicators  
   - Optional observability hooks (logging, metrics, tracing) designed for performance and robustness assessment in hackathon and production settings  
   - API endpoints that allow external systems to query scores, rankings, and reports programmatically  

### 3.6. Intended users

CLIM.IO targets:

- **Fund managers and PMs**  
  who want a fast read on the climate and ESG profile of a fund and concrete, lower-emission peers that preserve the investment case.

- **Sustainability, risk, and stewardship teams**  
  who monitor exposure to climate-sensitive sectors, issuers, or themes, and want additional confidence from satellite-based evidence and geospatial overlays.

- **Innovation and climate-finance teams**  
  building internal prototypes that connect LLM-powered workflows, ESG data, and Earth observation signals.

- **Platform owners and architects**  
  who want a plugin that can sit inside an existing investment platform and automate ESG-aware fund screening and selection.

### 3.7. Current focus and future extensions

Current emphasis:

- Quick climate and ESG profiling of portfolios.  
- Transparent link between holdings and their ESG and climate contribution.  
- Lightweight UX and plugin endpoints that support demos, experiments, and early pilots.  
- Early integration pathways for satellite-based indicators and geospatial overlays.  

Natural extensions:

- Constraint-based portfolio tilting toward climate targets.  
- Scenario and stress analysis around specific themes or sectors, including overlays that use Earth observation data for physical risk and transition risk views.  
- Exportable reports for investment committees, stewardship teams, and client updates.  
- Deeper integration of AI assistants that explain ESG shifts, climate signals, and satellite-based insights in plain language.  
- Richer plugin support for:
  - Automated fund screening and selection based on user-defined ESG and climate policies  
  - Periodic rescoring of approved fund lists as new data arrives  
- Expanded team workspace features:
  - Role-based access to portfolios and scenarios  
  - Commenting and review workflows around ESG and climate decisions  
  - Versioned “playbooks” that encode an organisation’s climate policy into repeatable steps  

---

## 4. Demo

- **Live app:** [https://esgai-phi.vercel.app/](https://esgai-phi.vercel.app/)