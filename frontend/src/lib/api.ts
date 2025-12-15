// API Client for Retail Pulse AI Backend
// Base URL for the FastAPI backend
// In development, Vite proxy handles /api requests, so we use relative paths
// In production, you may need to set this to the actual backend URL
const API_BASE_URL = import.meta.env.DEV ? "" : "http://127.0.0.1:8000";

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
  try {
    const response = await fetch(`${API_BASE_URL}/api/metadata`, {
      method: "GET",
      headers: {
        "accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Failed to fetch metadata: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to backend server. Please ensure it's running at http://127.0.0.1:8000");
    }
    throw error;
  }
}

/**
 * Fetch insight data for a specific store/year/week combination
 */
export async function fetchInsight(request: InsightRequest): Promise<InsightResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/insight`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Failed to fetch insight: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to backend server. Please ensure it's running at http://127.0.0.1:8000");
    }
    throw error;
  }
}
