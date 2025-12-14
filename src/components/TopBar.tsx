import { ChevronDown, Settings, Bell, Store, Calendar } from "lucide-react";

interface TopBarProps {
  stores: string[];
  years: number[];
  weeks: number[];
  selectedStore: string;
  selectedYear: number;
  selectedWeek: number;
  onStoreChange: (store: string) => void;
  onYearChange: (year: number) => void;
  onWeekChange: (week: number) => void;
  isLoading?: boolean;
  userAvatarUrl?: string;
}

const TopBar = ({ 
  stores,
  years,
  weeks,
  selectedStore,
  selectedYear,
  selectedWeek,
  onStoreChange,
  onYearChange,
  onWeekChange,
  isLoading = false,
  userAvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
}: TopBarProps) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-border bg-background/95 backdrop-blur-md px-6 py-3">
      {/* Logo and Brand */}
      <div className="flex items-center gap-4 text-foreground">
        <div className="size-8 text-primary">
          <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_6_319)">
              <path 
                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" 
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_6_319">
                <rect fill="white" height="48" width="48" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">
          Retail Pulse AI
        </h2>
      </div>

      {/* Center Selectors */}
      <div className="flex items-center gap-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Store Selector */}
        <div className="relative">
          <select
            value={selectedStore}
            onChange={(e) => onStoreChange(e.target.value)}
            disabled={isLoading || stores.length === 0}
            className="appearance-none flex items-center gap-2 bg-card border border-border pl-10 pr-8 py-2 rounded-full text-sm font-medium hover:bg-surface-hover transition-colors text-foreground min-w-[160px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {stores.map((store) => (
              <option key={store} value={store} className="bg-card text-foreground">
                {store.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <Store className="size-5 text-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="size-5 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Year Selector */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            disabled={isLoading || years.length === 0}
            className="appearance-none flex items-center gap-2 bg-card border border-border pl-10 pr-8 py-2 rounded-full text-sm font-medium hover:bg-surface-hover transition-colors text-foreground min-w-[100px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {years.map((year) => (
              <option key={year} value={year} className="bg-card text-foreground">
                {year}
              </option>
            ))}
          </select>
          <Calendar className="size-5 text-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="size-5 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Week Selector */}
        <div className="relative">
          <select
            value={selectedWeek}
            onChange={(e) => onWeekChange(Number(e.target.value))}
            disabled={isLoading || weeks.length === 0}
            className="appearance-none flex items-center gap-2 bg-card border border-border pl-4 pr-8 py-2 rounded-full text-sm font-medium hover:bg-surface-hover transition-colors text-foreground min-w-[90px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {weeks.map((week) => (
              <option key={week} value={week} className="bg-card text-foreground">
                Week {week}
              </option>
            ))}
          </select>
          <ChevronDown className="size-5 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center justify-end gap-4">
        <button className="flex size-10 items-center justify-center rounded-full bg-card text-foreground hover:bg-surface-hover transition-colors border border-transparent hover:border-border">
          <Settings className="size-5" />
        </button>
        <button className="flex size-10 items-center justify-center rounded-full bg-card text-foreground hover:bg-surface-hover transition-colors border border-transparent hover:border-border relative">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full" />
        </button>
        <div 
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-border"
          style={{ backgroundImage: `url("${userAvatarUrl}")` }}
          aria-label="User profile avatar"
        />
      </div>
    </header>
  );
};

export default TopBar;
