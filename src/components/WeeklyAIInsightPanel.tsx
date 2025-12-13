import { Sparkles, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";

// Mock insight data - replace with backend/AI generated data later
const insightData = {
  performanceHighlight: {
    text: "Store 042 outperformed regional benchmarks by",
    highlight: "8%",
    suffix: "this week. This surge was primarily driven by the 'Summer Essentials' campaign, which saw a 15% uplift in conversion.",
  },
  riskAlert: "Foot traffic dipped slightly on Tuesday due to weather conditions, however, high Average Transaction Value (ATV) compensated for the loss in volume.",
  recommendation: "Consider extending the accessory bundle promotion into next week to capitalize on the current margin growth trend.",
  isAnalyzing: true,
  analyzingText: "Analyzing inventory depth...",
};

interface WeeklyAIInsightPanelProps {
  onGenerateNewInsight?: () => void;
}

const WeeklyAIInsightPanel = ({ onGenerateNewInsight }: WeeklyAIInsightPanelProps) => {
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
        <div className="space-y-4">
          <p className="text-gray-200 text-sm leading-relaxed font-body">
            <strong className="text-foreground">Performance Highlight:</strong>{" "}
            {insightData.performanceHighlight.text}{" "}
            <span className="text-primary font-bold">{insightData.performanceHighlight.highlight}</span>{" "}
            {insightData.performanceHighlight.suffix}
          </p>
          
          <p className="text-gray-200 text-sm leading-relaxed font-body">
            <strong className="text-foreground">Risk Alert:</strong> {insightData.riskAlert}
          </p>
          
          <p className="text-gray-200 text-sm leading-relaxed font-body">
            <strong className="text-foreground">Recommendation:</strong> {insightData.recommendation}
          </p>

          {/* Analyzing state */}
          {insightData.isAnalyzing && (
            <div className="space-y-3 pt-4 opacity-50">
              <div className="flex gap-2 items-center mb-2">
                <div className="size-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-primary font-medium">{insightData.analyzingText}</span>
              </div>
              <div className="h-2 bg-muted rounded-full w-3/4 animate-pulse" />
              <div className="h-2 bg-muted rounded-full w-full animate-pulse" style={{ animationDelay: "75ms" }} />
              <div className="h-2 bg-muted rounded-full w-5/6 animate-pulse" style={{ animationDelay: "150ms" }} />
            </div>
          )}
        </div>
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
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3.5 px-4 rounded-full hover:brightness-110 hover:shadow-[0_0_15px_hsl(209,100%,60%,0.3)] transition-all active:scale-[0.98]"
        >
          <RefreshCw className="size-5" />
          Generate New Insight
        </button>
      </div>
    </div>
  );
};

export default WeeklyAIInsightPanel;
