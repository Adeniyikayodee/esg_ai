/**
 * API client for calling the backend company comparison endpoint
 */

export interface CompanyRow {
    Company: string;
    "Free Cash Flow (2024)": string;
    "Market Cap (2024)": string;
    Sector: string;
    "Carbon Emissions (2024 MtCO2e)": string;
    "Sources (Title)": string;
    "Source URLs": string;
}

export interface CompanyComparisonResponse {
    base_company: string;
    rows: CompanyRow[];
}

/**
 * Call the company comparison API with a base company name
 */
export async function fetchCompanyComparison(
    baseCompany: string
): Promise<CompanyComparisonResponse> {
    try {
        const params = new URLSearchParams({
            base_company: baseCompany,
        });

        // Try direct backend URL first, then fallback to proxy
        const urls = [
            `http://localhost:8000/api/comparison/company-comparison?${params.toString()}`,
            `/api/comparison/company-comparison?${params.toString()}`
        ];

        let lastError: Error | null = null;

        for (const url of urls) {
            try {
                console.log('Trying URL:', url);
                const response = await fetch(url);

                if (!response.ok) {
                    const text = await response.text();
                    console.error('API response not OK:', response.status, text);
                    throw new Error(`API error: ${response.status} - ${text.slice(0, 200)}`);
                }

                const contentType = response.headers.get('content-type');
                if (!contentType?.includes('application/json')) {
                    const text = await response.text();
                    console.error('Invalid content type:', contentType, 'Response:', text.slice(0, 200));
                    throw new Error(`Invalid content type: ${contentType}`);
                }

                const data = await response.json() as CompanyComparisonResponse;
                console.log('Successfully received data:', data);
                return data;
            } catch (error) {
                lastError = error as Error;
                console.warn(`Failed to fetch from ${url}:`, error);
                // Continue to next URL
            }
        }

        // If we get here, all URLs failed
        throw lastError || new Error('All API endpoints failed');
    } catch (error) {
        console.error("Error calling company comparison API:", error);
        throw error;
    }
}
