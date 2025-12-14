import { useEffect, useState, useCallback } from "react";
import TopBar from "@/components/TopBar";
import KPIGrid from "@/components/KPIGrid";
import RegionalPerformanceCard from "@/components/RegionalPerformanceCard";
import SalesTrajectoryCard from "@/components/SalesTrajectoryCard";
import WeeklyAIInsightPanel from "@/components/WeeklyAIInsightPanel";
import { fetchMetadata, fetchInsight, type MetadataResponse, type InsightResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  // Metadata state
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [metadataLoading, setMetadataLoading] = useState(true);

  // Selection state
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);

  // Insight state
  const [insightData, setInsightData] = useState<InsightResponse | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  // Fetch insight data
  const loadInsight = useCallback(async (store: string, year: number, week: number) => {
    if (!store || !year || !week) return;

    setInsightLoading(true);
    try {
      const data = await fetchInsight({ store, year, week });
      setInsightData(data);
    } catch (error) {
      console.error("Failed to fetch insight:", error);
      toast({
        title: "Error",
        description: "Failed to load insight data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setInsightLoading(false);
    }
  }, [toast]);

  // Initial metadata load
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchMetadata();

        // Validate response data
        if (!data || !Array.isArray(data.stores) || !Array.isArray(data.years) || !Array.isArray(data.weeks)) {
          throw new Error("Invalid metadata response format");
        }

        // Check if we have any data
        if (data.stores.length === 0 || data.years.length === 0 || data.weeks.length === 0) {
          throw new Error("No data available in metadata");
        }

        setMetadata(data);

        // Set sensible defaults: first store, first year, first week
        const defaultStore = data.stores[0] ?? "";
        const defaultYear = data.years[0] ?? 0;
        const defaultWeek = data.weeks[0] ?? 0;

        if (!defaultStore || !defaultYear || !defaultWeek) {
          throw new Error("Unable to set default values from metadata");
        }

        setSelectedStore(defaultStore);
        setSelectedYear(defaultYear);
        setSelectedWeek(defaultWeek);

        // Auto-load initial insight
        await loadInsight(defaultStore, defaultYear, defaultWeek);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
        const errorMessage = error instanceof Error
          ? error.message
          : "Failed to load application data. Please ensure the backend server is running at http://127.0.0.1:8000";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setMetadataLoading(false);
      }
    };

    loadMetadata();
  }, [loadInsight, toast]);

  // Handle store change
  const handleStoreChange = useCallback((store: string) => {
    setSelectedStore(store);
    loadInsight(store, selectedYear, selectedWeek);
  }, [selectedYear, selectedWeek, loadInsight]);

  // Handle year change
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    loadInsight(selectedStore, year, selectedWeek);
  }, [selectedStore, selectedWeek, loadInsight]);

  // Handle week change
  const handleWeekChange = useCallback((week: number) => {
    setSelectedWeek(week);
    loadInsight(selectedStore, selectedYear, week);
  }, [selectedStore, selectedYear, loadInsight]);

  // Handle generate new insight
  const handleGenerateNewInsight = useCallback(() => {
    loadInsight(selectedStore, selectedYear, selectedWeek);
  }, [selectedStore, selectedYear, selectedWeek, loadInsight]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <TopBar
        stores={metadata?.stores ?? []}
        years={metadata?.years ?? []}
        weeks={metadata?.weeks ?? []}
        selectedStore={selectedStore}
        selectedYear={selectedYear}
        selectedWeek={selectedWeek}
        onStoreChange={handleStoreChange}
        onYearChange={handleYearChange}
        onWeekChange={handleWeekChange}
        isLoading={metadataLoading || insightLoading}
      />

      <main className="flex-1 px-6 py-6 overflow-hidden max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
          {/* Left Column - KPIs and Charts */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <KPIGrid insightData={insightData} isLoading={insightLoading || metadataLoading} />

            <div className="flex flex-col lg:flex-row gap-6">
              <RegionalPerformanceCard />
              <SalesTrajectoryCard />
            </div>
          </div>

          {/* Right Column - AI Insight Panel */}
          <div className="xl:col-span-4 flex flex-col h-full min-h-[500px]">
            <WeeklyAIInsightPanel
              aiSummary={insightData?.ai_summary ?? null}
              isLoading={insightLoading}
              onGenerateNewInsight={handleGenerateNewInsight}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
