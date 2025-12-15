import { useEffect, useState, useCallback } from "react";
import TopBar from "@/components/TopBar";
import KPIGrid from "@/components/KPIGrid";
import RegionalPerformanceCard from "@/components/RegionalPerformanceCard";
import SalesTrajectoryCard from "@/components/SalesTrajectoryCard";
import WeeklyAIInsightPanel from "@/components/WeeklyAIInsightPanel";
import {
  fetchMetadata,
  fetchInsight,
  fetchRegionalPerformance,
  fetchSalesTrajectory,
  type MetadataResponse,
  type InsightResponse,
  type RegionalPerformanceResponse,
  type SalesTrajectoryResponse,
} from "@/lib/api";
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

  // Regional performance state
  const [regionalData, setRegionalData] = useState<RegionalPerformanceResponse | null>(null);
  const [regionalLoading, setRegionalLoading] = useState(false);

  // Sales trajectory state
  const [trajectoryData, setTrajectoryData] = useState<SalesTrajectoryResponse | null>(null);
  const [trajectoryLoading, setTrajectoryLoading] = useState(false);

  // Fetch all data for a given selection
  const loadAllData = useCallback(async (store: string, year: number, week: number) => {
    if (!store || !year || !week) return;

    setInsightLoading(true);
    setRegionalLoading(true);
    setTrajectoryLoading(true);

    // Fetch all endpoints in parallel
    const [insightResult, regionalResult, trajectoryResult] = await Promise.allSettled([
      fetchInsight({ store, year, week }),
      fetchRegionalPerformance(store, year, week),
      fetchSalesTrajectory(store, year, week),
    ]);

    // Handle insight
    if (insightResult.status === "fulfilled") {
      setInsightData(insightResult.value);
    } else {
      console.error("Failed to fetch insight:", insightResult.reason);
    }
    setInsightLoading(false);

    // Handle regional
    if (regionalResult.status === "fulfilled") {
      setRegionalData(regionalResult.value);
    } else {
      console.error("Failed to fetch regional performance:", regionalResult.reason);
    }
    setRegionalLoading(false);

    // Handle trajectory
    if (trajectoryResult.status === "fulfilled") {
      setTrajectoryData(trajectoryResult.value);
    } else {
      console.error("Failed to fetch sales trajectory:", trajectoryResult.reason);
    }
    setTrajectoryLoading(false);
  }, []);

  // Initial metadata load
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchMetadata();

        if (!data || !Array.isArray(data.stores) || !Array.isArray(data.years) || !Array.isArray(data.weeks)) {
          throw new Error("Invalid metadata response format");
        }

        if (data.stores.length === 0 || data.years.length === 0 || data.weeks.length === 0) {
          throw new Error("No data available in metadata");
        }

        setMetadata(data);

        const defaultStore = data.stores[0] ?? "";
        const defaultYear = data.years[0] ?? 0;
        const defaultWeek = data.weeks[0] ?? 0;

        if (!defaultStore || !defaultYear || !defaultWeek) {
          throw new Error("Unable to set default values from metadata");
        }

        setSelectedStore(defaultStore);
        setSelectedYear(defaultYear);
        setSelectedWeek(defaultWeek);

        await loadAllData(defaultStore, defaultYear, defaultWeek);
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
  }, [loadAllData, toast]);

  // Handle store change
  const handleStoreChange = useCallback((store: string) => {
    setSelectedStore(store);
    loadAllData(store, selectedYear, selectedWeek);
  }, [selectedYear, selectedWeek, loadAllData]);

  // Handle year change
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    loadAllData(selectedStore, year, selectedWeek);
  }, [selectedStore, selectedWeek, loadAllData]);

  // Handle week change
  const handleWeekChange = useCallback((week: number) => {
    setSelectedWeek(week);
    loadAllData(selectedStore, selectedYear, week);
  }, [selectedStore, selectedYear, loadAllData]);

  // Handle generate new insight
  const handleGenerateNewInsight = useCallback(() => {
    loadAllData(selectedStore, selectedYear, selectedWeek);
  }, [selectedStore, selectedYear, selectedWeek, loadAllData]);

  const isLoading = metadataLoading || insightLoading;

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
        isLoading={isLoading}
      />

      <main className="flex-1 px-6 py-6 overflow-hidden max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
          {/* Left Column - KPIs and Charts */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <KPIGrid insightData={insightData} isLoading={isLoading} />

            <div className="flex flex-col lg:flex-row gap-6">
              <RegionalPerformanceCard
                data={regionalData}
                isLoading={regionalLoading || metadataLoading}
              />
              <SalesTrajectoryCard
                data={trajectoryData}
                isLoading={trajectoryLoading || metadataLoading}
              />
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
