import KPICard from "./KPICard";
import type { InsightResponse } from "@/lib/api";

interface KPIGridProps {
  insightData: InsightResponse | null;
  isLoading: boolean;
}

// Format currency value
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format number with commas
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
};

// Format percentage for delta display
const formatDelta = (yoyPct: number): string => {
  const sign = yoyPct >= 0 ? "+" : "";
  return `${sign}${(yoyPct * 100).toFixed(1)}%`;
};

const KPIGrid = ({ insightData, isLoading }: KPIGridProps) => {
  // Build KPI data from backend response
  const kpiData = insightData
    ? [
        {
          title: "Net Sales",
          value: formatCurrency(insightData.kpis.net_sales?.value ?? 0),
          delta: formatDelta(insightData.kpis.net_sales?.yoy_pct ?? 0),
          deltaLabel: "vs last year",
          trend: (insightData.kpis.net_sales?.yoy_pct ?? 0) >= 0 ? ("up" as const) : ("down" as const),
          icon: "sales" as const,
          isUnusual: insightData.kpis.net_sales?.current_unusual ?? false,
        },
        {
          title: "Units Sold",
          value: formatNumber(insightData.kpis.units_sold?.value ?? 0),
          delta: formatDelta(insightData.kpis.units_sold?.yoy_pct ?? 0),
          deltaLabel: "vs last year",
          trend: (insightData.kpis.units_sold?.yoy_pct ?? 0) >= 0 ? ("up" as const) : ("down" as const),
          icon: "units" as const,
          isUnusual: insightData.kpis.units_sold?.current_unusual ?? false,
        },
        {
          title: "Margin %",
          value: `${((insightData.kpis.margin?.value ?? 0) * 100).toFixed(1)}%`,
          delta: formatDelta(insightData.kpis.margin?.yoy_pct ?? 0),
          deltaLabel: "vs last year",
          trend: (insightData.kpis.margin?.yoy_pct ?? 0) >= 0 ? ("up" as const) : ("down" as const),
          icon: "margin" as const,
          isUnusual: insightData.kpis.margin?.current_unusual ?? false,
        },
        {
          title: "Foot Traffic",
          value: formatNumber(insightData.kpis.traffic?.value ?? 0),
          delta: formatDelta(insightData.kpis.traffic?.yoy_pct ?? 0),
          deltaLabel: "vs last year",
          trend: (insightData.kpis.traffic?.yoy_pct ?? 0) >= 0 ? ("up" as const) : ("down" as const),
          icon: "traffic" as const,
          isUnusual: insightData.kpis.traffic?.current_unusual ?? false,
        },
      ]
    : [];

  // Loading skeleton
  if (isLoading || !insightData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded-2xl p-5 border border-border bg-card animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-8 w-8 bg-muted rounded-lg" />
            </div>
            <div className="h-8 w-28 bg-muted rounded mt-2" />
            <div className="h-4 w-24 bg-muted rounded mt-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};

export default KPIGrid;
