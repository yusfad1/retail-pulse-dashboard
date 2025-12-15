import type { RegionalPerformanceResponse } from "@/lib/api";

interface RegionalPerformanceCardProps {
  data: RegionalPerformanceResponse | null;
  isLoading?: boolean;
}

const RegionalPerformanceCard = ({ data, isLoading }: RegionalPerformanceCardProps) => {
  // Format gap percentage
  const formatGapPct = (gap: number) => {
    const sign = gap >= 0 ? "+" : "";
    return `${sign}${(gap * 100).toFixed(0)}%`;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate bar heights based on actual data
  const getBarData = () => {
    if (!data) return [];
    
    const storeSales = data.store_net_sales;
    const networkAvg = data.network_avg_net_sales;
    const maxValue = Math.max(storeSales, networkAvg) * 1.2;
    
    return [
      { label: "Network Avg", value: networkAvg, height: (networkAvg / maxValue) * 100, isStore: false },
      { label: "Your Store", value: storeSales, height: (storeSales / maxValue) * 100, isStore: true },
    ];
  };

  const barData = getBarData();

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            Regional Performance
          </p>
          {isLoading ? (
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          ) : data ? (
            <p className="text-foreground text-2xl font-bold tracking-tight">
              {formatGapPct(data.gap_pct)}{" "}
              <span className="text-lg font-normal text-muted-foreground">vs Region</span>
            </p>
          ) : (
            <p className="text-muted-foreground text-lg">No data</p>
          )}
        </div>
        {data && !isLoading && (
          <div className="flex items-center gap-1 bg-background px-3 py-1 rounded-full border border-border">
            <span className="text-xs font-medium text-foreground">
              Rank {data.rank} of {data.store_count}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 min-h-[220px] items-end justify-center gap-12 mt-4">
        {isLoading ? (
          <div className="flex gap-12 items-end">
            <div className="w-20 h-32 bg-muted animate-pulse rounded-t-sm" />
            <div className="w-20 h-48 bg-muted animate-pulse rounded-t-sm" />
          </div>
        ) : (
          barData.map((bar, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {formatCurrency(bar.value)}
              </span>
              <div
                className={`w-20 rounded-t-sm transition-all ${
                  bar.isStore
                    ? "bg-primary"
                    : "bg-muted"
                }`}
                style={{ height: `${bar.height * 1.8}px` }}
              />
              <p className={`text-xs font-bold uppercase ${
                bar.isStore ? "text-foreground" : "text-muted-foreground"
              }`}>
                {bar.label}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegionalPerformanceCard;
