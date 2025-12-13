import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Percent, Footprints } from "lucide-react";

type TrendDirection = "up" | "down";

interface KPICardProps {
  title: string;
  value: string;
  delta: string;
  deltaLabel: string;
  trend: TrendDirection;
  icon: "sales" | "units" | "margin" | "traffic";
}

const iconMap = {
  sales: DollarSign,
  units: ShoppingBag,
  margin: Percent,
  traffic: Footprints,
};

const KPICard = ({ title, value, delta, deltaLabel, trend, icon }: KPICardProps) => {
  const IconComponent = iconMap[icon];
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-primary" : "text-destructive";

  return (
    <div className="flex flex-col gap-1 rounded-2xl p-5 border border-border bg-card hover:border-primary/50 transition-colors group cursor-default">
      <div className="flex justify-between items-start">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <span className="text-primary bg-primary/10 p-1.5 rounded-lg">
          <IconComponent className="size-4" />
        </span>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-foreground text-3xl font-bold tracking-tight">{value}</p>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <TrendIcon className={`size-4 ${trendColor}`} />
        <p className={`text-sm font-medium ${trendColor}`}>{delta}</p>
        <p className="text-muted-foreground text-xs ml-1">{deltaLabel}</p>
      </div>
    </div>
  );
};

export default KPICard;
