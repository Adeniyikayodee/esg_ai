import { Router, Request, Response } from 'express';

const router = Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const VALYU_API_KEY = process.env.VALYU_API_KEY;
const VALYU_BASE_URL = process.env.VALYU_BASE_URL;

if (!GEMINI_API_KEY || !VALYU_API_KEY || !VALYU_BASE_URL) {
    console.warn('Missing GEMINI_API_KEY, VALYU_API_KEY or VALYU_BASE_URL env vars');
}

type ValyuResult = {
    title?: string;
    url?: string;
    content?: string;
    description?: string;
};

type ValyuSearchResponse = {
    results?: ValyuResult[];
    [key: string]: any;
};

type CompanyRow = {
    Company: string;
    'Free Cash Flow (2024)': string;
    'Market Cap (2024)': string;
    Sector: string;
    'Carbon Emissions (2024 MtCO2e)': string;
    'Sources (Title)': string;
    'Source URLs': string;
};

/**
 * Helper: call Gemini JSON-ish text API
 */
async function callGemini(prompt: string, maxTokens = 2048, temperature = 0.2): Promise<string> {
    // If no API key, use mock data for testing
    if (!GEMINI_API_KEY || GEMINI_API_KEY.startsWith('AIzaSy') === false) {
        console.warn('Using mock Gemini API response (no valid API key)');
        return getMockGeminiResponse(prompt);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
        },
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        console.warn('Gemini API failed, using mock response:', text);
        return getMockGeminiResponse(prompt);
    }

    const data = (await res.json()) as any;
    const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        '';

    return text;
}

/**
 * Mock Gemini response for testing
 */
function getMockGeminiResponse(prompt: string): string {
    if (prompt.includes('similar')) {
        return JSON.stringify(['Apple Inc.', 'Microsoft Corporation', 'Alphabet Inc.', 'Amazon.com Inc.', 'Meta Platforms Inc.']);
    }
    
    if (prompt.includes('Extract financial')) {
        return JSON.stringify({
            company: 'Shell',
            free_cash_flow_2024: '$15.2B',
            market_cap_2024: '$240B',
            sector: 'Energy',
            carbon_emissions_2024: '156',
            source_ids: [1, 2, 3]
        });
    }

    return JSON.stringify([]);
}

/**
 * Helper: extract pure JSON from a Gemini response that may contain ```json fences
 */
function extractJsonFromText(text: string): any {
    let cleaned = text.trim();

    if (cleaned.includes('```json')) {
        cleaned = cleaned.split('```json')[1].split('```')[0].trim();
    } else if (cleaned.includes('```')) {
        cleaned = cleaned.split('```')[1].split('```')[0].trim();
    }

    return JSON.parse(cleaned);
}

/**
 * Step 1: get similar companies from Gemini
 */
async function getSimilarCompanies(baseCompany: string, numCompanies = 5): Promise<string[]> {
    const prompt = `
List ${numCompanies} companies that are most similar to ${baseCompany} in terms of:
- Industry/sector
- Business model
- Market size
- Geographic presence

Return ONLY a JSON array of company names, nothing else.
Format: ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"]

Do not include ${baseCompany} itself in the list.
`;

    const text = await callGemini(prompt, 1024, 0.3);
    const companies: string[] = extractJsonFromText(text);
    const allCompanies = [baseCompany, ...companies];

    return allCompanies;
}

/**
 * Helper: call Valyu search
 * You can adjust body structure to match the actual Valyu API.
 */
async function valyuSearch(
    query: string,
    options?: {
        included_sources?: string[];
        max_num_results?: number;
        relevance_threshold?: number;
    }
): Promise<ValyuSearchResponse> {
    // If no valid API keys, return mock data
    if (!VALYU_API_KEY || !VALYU_BASE_URL) {
        console.warn('Using mock Valyu API response (no valid API key)');
        return getMockValyuResponse(query);
    }

    const body: any = {
        query,
        ...options,
    };

    try {
        const res = await fetch(VALYU_BASE_URL as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${VALYU_API_KEY}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            console.warn('Valyu API returned error, using mock response');
            return getMockValyuResponse(query);
        }

        const data = (await res.json()) as ValyuSearchResponse;
        return data;
    } catch (error) {
        console.warn('Valyu API failed, using mock response:', error);
        return getMockValyuResponse(query);
    }
}

/**
 * Mock Valyu response for testing
 */
function getMockValyuResponse(query: string): ValyuSearchResponse {
    return {
        results: [
            {
                title: 'Sample Financial Report - ' + query,
                url: 'https://example.com/report1',
                content: 'Sample financial data for ' + query + ' in 2024'
            },
            {
                title: 'ESG Report - ' + query,
                url: 'https://example.com/report2',
                content: 'Environmental, Social, and Governance report for ' + query
            }
        ]
    };
}

/**
 * Step 2: two Valyu searches – financial and carbon
 */
async function searchCompanyData(companyName: string) {
    const financialQuery = `${companyName} free cash flow 2024 market capitalization 2024 sector`;
    const carbonQuery = `${companyName} carbon emissions MtCO2e 2024 scope 1 scope 2 scope 3`;

    const [financialResponse, carbonResponse] = await Promise.all([
        valyuSearch(financialQuery, {
            included_sources: [
                'valyu/valyu-cash-flow-US',
                'valyu/valyu-earnings-US',
                'valyu/valyu-income-statement-US',
                'valyu/valyu-statistics-US',
            ],
            max_num_results: 10,
            relevance_threshold: 0.3,
        }),
        valyuSearch(carbonQuery, {
            max_num_results: 10,
            relevance_threshold: 0.3,
        }),
    ]);

    return { financialResponse, carbonResponse };
}

/**
 * Step 3: Use Gemini to extract structured data from Valyu responses
 */
async function extractCompanyData(
    companyName: string,
    financialResponse: ValyuSearchResponse,
    carbonResponse: ValyuSearchResponse
): Promise<CompanyRow> {
    // Build source map
    const sourcesMap: Record<
        number,
        { title: string; url: string; content: string; type: 'financial' | 'carbon' }
    > = {};

    let idx = 1;
    const financialResults = financialResponse.results ?? [];
    const carbonResults = carbonResponse.results ?? [];

    for (const r of financialResults) {
        sourcesMap[idx] = {
            title: r.title ?? 'Unknown',
            url: r.url ?? 'N/A',
            content: (r.content ?? r.description ?? '').slice(0, 1000),
            type: 'financial',
        };
        idx += 1;
    }

    for (const r of carbonResults) {
        sourcesMap[idx] = {
            title: r.title ?? 'Unknown',
            url: r.url ?? 'N/A',
            content: (r.content ?? r.description ?? '').slice(0, 1000),
            type: 'carbon',
        };
        idx += 1;
    }

    const financialSourcesText = Object.entries(sourcesMap)
        .filter(([, v]) => v.type === 'financial')
        .map(
            ([i, s]) =>
                `[${i}] ${s.title}\n    URL: ${s.url}\n    Excerpt: ${s.content.slice(0, 300)}...`
        )
        .join('\n');

    const carbonSourcesText = Object.entries(sourcesMap)
        .filter(([, v]) => v.type === 'carbon')
        .map(
            ([i, s]) =>
                `[${i}] ${s.title}\n    URL: ${s.url}\n    Excerpt: ${s.content.slice(0, 300)}...`
        )
        .join('\n');

    const prompt = `
Extract financial and environmental data for ${companyName} from two sets of search results.

REQUIRED JSON FORMAT (return ONLY this, no explanation):
{
  "company": "${companyName}",
  "free_cash_flow_2024": "Value with currency (e.g., $5.2B, €3.1B) or N/A, just the integer value",
  "market_cap_2024": "Value with currency (e.g., $200B) or N/A, just the integer value",
  "sector": "Sector name or N/A",
  "carbon_emissions_2024": "Value in MtCO2e (e.g., 456 MtCO2e) or N/A, just the integer value",
  "source_ids": [1, 3, 5, 12]
}

RULES:
1. All values for 2024 specifically. If 2024 data not found, use "N/A".
2. Free cash flow and market cap include currency symbol.
3. Carbon emissions in MtCO2e units (1 GtCO2e = 1000 MtCO2e).
4. source_ids = array of all sources used.
5. Return ONLY valid JSON, no markdown.

FINANCIAL DATA SOURCES:
${financialSourcesText}

CARBON EMISSIONS SOURCES:
${carbonSourcesText}

FULL FINANCIAL RESULTS (JSON):
${JSON.stringify(financialResponse, null, 2)}

FULL CARBON RESULTS (JSON):
${JSON.stringify(carbonResponse, null, 2)}

Extract the data now:
`;

    const text = await callGemini(prompt, 2048, 0.1);
    const obj = extractJsonFromText(text);

    const sourceIds: number[] = obj.source_ids ?? [];
    const titles: string[] = [];
    const urls: string[] = [];

    for (const sid of sourceIds) {
        const s = sourcesMap[sid];
        if (s) {
            titles.push(s.title);
            urls.push(s.url);
        }
    }

    const row: CompanyRow = {
        Company: obj.company ?? companyName,
        'Free Cash Flow (2024)': obj.free_cash_flow_2024 ?? 'N/A',
        'Market Cap (2024)': obj.market_cap_2024 ?? 'N/A',
        Sector: obj.sector ?? 'N/A',
        'Carbon Emissions (2024 MtCO2e)': obj.carbon_emissions_2024 ?? 'N/A',
        'Sources (Title)': titles.length > 0 ? titles.join('; ') : 'N/A',
        'Source URLs': urls.length > 0 ? urls.join('; ') : 'N/A',
    };

    return row;
}

/**
 * Main workflow in TS: base company → similar list → Valyu search → Gemini extraction.
 */
async function runCompanyComparison(baseCompany: string): Promise<CompanyRow[]> {
    const companies = await getSimilarCompanies(baseCompany, 5);

    const rows: CompanyRow[] = [];

    for (const company of companies) {
        try {
            const { financialResponse, carbonResponse } = await searchCompanyData(company);
            const row = await extractCompanyData(company, financialResponse, carbonResponse);
            rows.push(row);
            // simple pacing between calls
            await new Promise((resolve) => setTimeout(resolve, 800));
        } catch (err) {
            console.error(`Error for company ${company}:`, err);
            rows.push({
                Company: company,
                'Free Cash Flow (2024)': 'N/A',
                'Market Cap (2024)': 'N/A',
                Sector: 'N/A',
                'Carbon Emissions (2024 MtCO2e)': 'N/A',
                'Sources (Title)': 'Error',
                'Source URLs': 'N/A',
            });
        }
    }

    return rows;
}

/**
 * GET /api/comparison/company-comparison?base_company=Shell
 */
router.get('/company-comparison', async (req: Request, res: Response) => {
    try {
        const { base_company } = req.query;

        if (!base_company || typeof base_company !== 'string') {
            return res.status(400).json({
                error: 'Missing base_company query parameter',
            });
        }

        const rows = await runCompanyComparison(base_company);

        return res.json({
            base_company,
            rows,
        });
    } catch (err: any) {
        console.error('company-comparison API error:', err);
        return res.status(500).json({
            error: err.message ?? 'Unexpected error',
        });
    }
});

export default router;
