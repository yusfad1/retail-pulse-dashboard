import KPICard from "./KPICard";

// Mock data - replace with backend data later
const kpiData = [
  {
    title: "Net Sales",
    value: "$42,500",
    delta: "+12%",
    deltaLabel: "vs last week",
    trend: "up" as const,
    icon: "sales" as const,
  },
  {
    title: "Units Sold",
    value: "840",
    delta: "-5%",
    deltaLabel: "vs last week",
    trend: "down" as const,
    icon: "units" as const,
  },
  {
    title: "Margin %",
    value: "22%",
    delta: "+1.2%",
    deltaLabel: "vs target",
    trend: "up" as const,
    icon: "margin" as const,
  },
  {
    title: "Foot Traffic",
    value: "1,200",
    delta: "-2%",
    deltaLabel: "vs last week",
    trend: "down" as const,
    icon: "traffic" as const,
  },
];

const KPIGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};

export default KPIGrid;
