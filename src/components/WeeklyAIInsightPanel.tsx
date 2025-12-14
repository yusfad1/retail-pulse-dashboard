import { Sparkles, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";

interface WeeklyAIInsightPanelProps {
  aiSummary: string | null;
  isLoading: boolean;
  onGenerateNewInsight: () => void;
}

const WeeklyAIInsightPanel = ({ 
  aiSummary, 
  isLoading, 
  onGenerateNewInsight 
}: WeeklyAIInsightPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border p-6 relative overflow-hidden group">
      {/* Subtle glow effect */}
      <div className="absolute -top-20 -right-20 size-60 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-border pb-4">
        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
          <Sparkles className="size-5" />
        </div>
        <h3 className="text-foreground text-lg font-bold leading-tight">Weekly AI Insight</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 mb-6 relative z-10 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex gap-2 items-center mb-2">
              <div className="size-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary font-medium">Generating insight...</span>
            </div>
            <div className="h-2 bg-muted rounded-full w-3/4 animate-pulse" />
            <div className="h-2 bg-muted rounded-full w-full animate-pulse" style={{ animationDelay: "75ms" }} />
            <div className="h-2 bg-muted rounded-full w-5/6 animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="h-2 bg-muted rounded-full w-2/3 animate-pulse" style={{ animationDelay: "225ms" }} />
            <div className="h-2 bg-muted rounded-full w-4/5 animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
        ) : aiSummary ? (
          <div className="text-gray-200 text-sm leading-relaxed font-body whitespace-pre-line">
            {aiSummary}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No insight available. Click "Generate New Insight" to get started.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto relative z-10 pt-4 border-t border-border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-muted-foreground">Was this helpful?</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsUp className="size-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsDown className="size-4" />
            </button>
          </div>
        </div>
        
        <button 
          onClick={onGenerateNewInsight}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3.5 px-4 rounded-full hover:brightness-110 hover:shadow-[0_0_15px_hsl(209,100%,60%,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          <RefreshCw className={`size-5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Generating..." : "Generate New Insight"}
        </button>
      </div>
    </div>
  );
};

export default WeeklyAIInsightPanel;
