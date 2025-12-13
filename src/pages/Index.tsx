import TopBar from "@/components/TopBar";
import KPIGrid from "@/components/KPIGrid";
import RegionalPerformanceCard from "@/components/RegionalPerformanceCard";
import SalesTrajectoryCard from "@/components/SalesTrajectoryCard";
import WeeklyAIInsightPanel from "@/components/WeeklyAIInsightPanel";

const Index = () => {
  const handleGenerateNewInsight = () => {
    // TODO: Connect to backend AI service
    console.log("Generating new insight...");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <TopBar />
      
      <main className="flex-1 px-6 py-6 overflow-hidden max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
          {/* Left Column - KPIs and Charts */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <KPIGrid />
            
            <div className="flex flex-col lg:flex-row gap-6">
              <RegionalPerformanceCard />
              <SalesTrajectoryCard />
            </div>
          </div>

          {/* Right Column - AI Insight Panel */}
          <div className="xl:col-span-4 flex flex-col h-full min-h-[500px]">
            <WeeklyAIInsightPanel onGenerateNewInsight={handleGenerateNewInsight} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
