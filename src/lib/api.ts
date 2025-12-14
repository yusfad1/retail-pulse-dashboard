// API Client for Retail Pulse AI Backend
// Base URL for the FastAPI backend
const API_BASE_URL = "http://localhost:8000";

// Types based on API contract
export interface MetadataResponse {
  stores: string[];
  years: number[];
  weeks: number[];
}

export interface KPIData {
  value: number;
  yoy_pct: number;
  z_vs_network: number;
  current_unusual: boolean;
  prior_abnormal: boolean;
}

export interface InsightResponse {
  store: string;
  year: number;
  week: number;
  network_store_count: number;
  kpis: {
    traffic: KPIData;
    net_sales: KPIData;
    [key: string]: KPIData;
  };
  ai_summary: string;
}

export interface InsightRequest {
  store: string;
  year: number;
  week: number;
}

/**
 * Fetch metadata (stores, years, weeks) - called once on app load
 */
export async function fetchMetadata(): Promise<MetadataResponse> {
  const response = await fetch(`${API_BASE_URL}/api/metadata`);
  if (!response.ok) {
    throw new Error(`Failed to fetch metadata: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch insight data for a specific store/year/week combination
 */
export async function fetchInsight(request: InsightRequest): Promise<InsightResponse> {
  const response = await fetch(`${API_BASE_URL}/api/insight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch insight: ${response.statusText}`);
  }
  return response.json();
}
