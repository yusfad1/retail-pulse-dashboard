// Mock data - replace with backend data later
const barData = [
  { day: "Mon", height: 30, isHighlighted: false },
  { day: "Tue", height: 45, isHighlighted: false },
  { day: "Wed", height: 50, isHighlighted: false },
  { day: "Thu", height: 85, isHighlighted: true },
  { day: "Fri", height: 60, isHighlighted: false },
  { day: "Sat", height: 75, isHighlighted: false },
  { day: "Sun", height: 90, isHighlighted: false },
];

interface RegionalPerformanceCardProps {
  percentVsRegion?: string;
}

const RegionalPerformanceCard = ({ percentVsRegion = "+8%" }: RegionalPerformanceCardProps) => {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            Regional Performance
          </p>
          <p className="text-foreground text-2xl font-bold tracking-tight">
            {percentVsRegion} <span className="text-lg font-normal text-muted-foreground">vs Region</span>
          </p>
        </div>
        <div className="flex items-center gap-1 bg-background px-3 py-1 rounded-full border border-border">
          <span className="size-2 rounded-full bg-primary" />
          <span className="text-xs font-medium text-foreground">This Week</span>
        </div>
      </div>

      <div className="grid flex-1 min-h-[220px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center mt-4">
        {barData.map((bar, index) => (
          <div key={index} className="group relative flex flex-col items-center justify-end w-full h-full gap-2">
            <div 
              className="bg-muted w-full rounded-t-sm group-hover:bg-primary/40 transition-all relative overflow-hidden"
              style={{ height: `${bar.height}%` }}
            >
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/50" />
            </div>
            <p className={`text-xs font-bold uppercase ${bar.isHighlighted ? 'text-foreground' : 'text-muted-foreground'}`}>
              {bar.day}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalPerformanceCard;
