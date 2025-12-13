import { TrendingUp } from "lucide-react";

interface SalesTrajectoryCardProps {
  totalSales?: string;
}

const SalesTrajectoryCard = ({ totalSales = "$340k" }: SalesTrajectoryCardProps) => {
  // Week labels - can be replaced with dynamic data
  const weeks = ["Wk 26", "Wk 27", "Wk 28", "Wk 29", "Wk 30", "Wk 31", "Wk 32", "Current"];

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            8-Week Sales Trajectory
          </p>
          <p className="text-foreground text-2xl font-bold tracking-tight">
            {totalSales} <span className="text-lg font-normal text-muted-foreground">Total</span>
          </p>
        </div>
        <div className="flex items-center gap-1 bg-background px-3 py-1 rounded-full border border-border">
          <TrendingUp className="size-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Trend</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-[220px] pt-4 justify-end">
        <svg 
          className="overflow-visible" 
          fill="none" 
          height="148" 
          preserveAspectRatio="none" 
          viewBox="-3 0 478 150" 
          width="100%" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" 
            fill="url(#paint0_linear_trajectory)"
          />
          <path 
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" 
            stroke="hsl(209, 100%, 60%)" 
            strokeLinecap="round" 
            strokeWidth="3"
          />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_trajectory" x1="236" x2="236" y1="1" y2="149">
              <stop stopColor="hsl(209, 100%, 60%)" stopOpacity="0.3" />
              <stop offset="1" stopColor="hsl(209, 100%, 60%)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="flex justify-between mt-4 px-2">
          {weeks.map((week, index) => (
            <p 
              key={index} 
              className={`text-[11px] font-bold uppercase tracking-wider ${
                index === weeks.length - 1 ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {week}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesTrajectoryCard;
