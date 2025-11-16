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

        const response = await fetch(`/api/comparison/company-comparison?${params.toString()}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `API error: ${response.status}`);
        }

        const data = await response.json() as CompanyComparisonResponse;
        return data;
    } catch (error) {
        console.error("Error calling company comparison API:", error);
        throw error;
    }
}
