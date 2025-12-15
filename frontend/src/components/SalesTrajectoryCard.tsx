import { TrendingUp, AlertCircle } from "lucide-react";
import type { SalesTrajectoryResponse } from "@/lib/api";

interface SalesTrajectoryCardProps {
  data: SalesTrajectoryResponse | null;
  isLoading?: boolean;
}

const SalesTrajectoryCard = ({ data, isLoading }: SalesTrajectoryCardProps) => {
  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Calculate total store sales
  const totalSales = data?.store_sales.reduce((sum, val) => sum + val, 0) ?? 0;

  // Generate SVG path for a line
  const generatePath = (values: number[], maxValue: number, height: number, width: number) => {
    if (values.length === 0) return "";
    
    const points = values.map((val, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - (val / maxValue) * height;
      return `${x},${y}`;
    });
    
    return `M${points.join(" L")}`;
  };

  // Generate filled area path
  const generateAreaPath = (values: number[], maxValue: number, height: number, width: number) => {
    if (values.length === 0) return "";
    
    const linePath = generatePath(values, maxValue, height, width);
    return `${linePath} L${width},${height} L0,${height} Z`;
  };

  // Chart dimensions
  const chartWidth = 472;
  const chartHeight = 140;
  
  // Calculate max value for scaling
  const allValues = [...(data?.store_sales ?? []), ...(data?.network_avg_sales ?? [])];
  const maxValue = Math.max(...allValues) * 1.1 || 100;

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            8-Week Sales Trajectory
          </p>
          {isLoading ? (
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-foreground text-2xl font-bold tracking-tight">
              {formatCurrency(totalSales)}{" "}
              <span className="text-lg font-normal text-muted-foreground">Total</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 bg-background px-3 py-1 rounded-full border border-border">
          <TrendingUp className="size-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Trend</span>
        </div>
      </div>

      {data?.is_partial && (
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <AlertCircle className="size-3" />
          <span>Limited historical data available</span>
        </div>
      )}

      <div className="flex flex-col flex-1 min-h-[220px] pt-4 justify-end">
        {isLoading ? (
          <div className="h-[148px] w-full bg-muted animate-pulse rounded" />
        ) : data ? (
          <svg
            className="overflow-visible"
            fill="none"
            height="148"
            preserveAspectRatio="none"
            viewBox={`0 0 ${chartWidth} ${chartHeight + 10}`}
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Store sales area fill */}
            <path
              d={generateAreaPath(data.store_sales, maxValue, chartHeight, chartWidth)}
              fill="url(#paint0_linear_trajectory)"
            />
            {/* Network average line (dashed, muted) */}
            <path
              d={generatePath(data.network_avg_sales, maxValue, chartHeight, chartWidth)}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeWidth="2"
              opacity="0.5"
            />
            {/* Store sales line (primary) */}
            <path
              d={generatePath(data.store_sales, maxValue, chartHeight, chartWidth)}
              stroke="hsl(var(--primary))"
              strokeLinecap="round"
              strokeWidth="3"
            />
            {/* Data points for store sales */}
            {data.store_sales.map((val, i) => {
              const x = (i / (data.store_sales.length - 1)) * chartWidth;
              const y = chartHeight - (val / maxValue) * chartHeight;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="hsl(var(--primary))"
                  className="opacity-0 hover:opacity-100 transition-opacity"
                />
              );
            })}
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="paint0_linear_trajectory"
                x1={chartWidth / 2}
                x2={chartWidth / 2}
                y1="0"
                y2={chartHeight}
              >
                <stop stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        ) : null}

        <div className="flex justify-between mt-4 px-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-3 w-12 bg-muted animate-pulse rounded" />
            ))
          ) : (
            data?.weeks.map((week, index) => (
              <p
                key={index}
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  index === data.weeks.length - 1 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {week}
              </p>
            ))
          )}
        </div>

        {/* Legend */}
        {data && !isLoading && (
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-primary rounded" />
              <span className="text-xs text-muted-foreground">Your Store</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-muted-foreground/50 rounded" style={{ borderStyle: "dashed" }} />
              <span className="text-xs text-muted-foreground">Network Avg</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTrajectoryCard;
