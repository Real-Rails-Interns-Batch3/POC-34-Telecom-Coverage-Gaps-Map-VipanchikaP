import React from "react";

export type TelecomPoint = {
  id: number;
  name: string;
  coverage: number;
  gap: number;
};

export default function NetworkDashboard({ points }: { points: TelecomPoint[] }) {
  const totalRegions = points.length;

  const avgCoverage =
    totalRegions > 0
      ? (points.reduce((sum, p) => sum + p.coverage, 0) / totalRegions).toFixed(1)
      : "0.0";

  const avgGap =
    totalRegions > 0
      ? (points.reduce((sum, p) => sum + p.gap, 0) / totalRegions).toFixed(1)
      : "0.0";

  const criticalAreas = points.filter((p) => p.gap > 50).length;

  const exportCSV = () => {
    const csvContent = [
      ["Region", "Coverage", "Gap"],
      ...points.map((p) => [p.name, p.coverage, p.gap]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "telecom-report.csv";
    link.click();
  };

  return (
    <div className="w-full bg-[#0d1117] text-white font-sans p-5 rounded-xl border border-[#30363d] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      <div>
        <h2 className="text-[1.15rem] font-semibold mb-3 tracking-wide">
          Network Dashboard
        </h2>
        <div className="text-[0.95rem] mb-2 text-[#f0f6fc]">
          Total Regions: <span className="font-medium">{totalRegions}</span>
        </div>
        <div className="text-[0.95rem] mb-2 text-[#f0f6fc]">
          Avg Coverage: <span className="font-medium">{avgCoverage}%</span>
        </div>
        <div className="text-[0.95rem] mb-2 text-[#f0f6fc]">
          Avg Gap: <span className="font-medium">{avgGap}</span>
        </div>
        <div className="text-[0.95rem] mb-2 text-[#f0f6fc]">
          Critical Areas: <span className="font-medium">{criticalAreas}</span>
        </div>
      </div>

      <hr className="border-0 border-t border-[#30363d] my-4" />

      <button
        onClick={exportCSV}
        className="w-full bg-[#161b22] text-white border border-[#30363d] px-4 py-2.5 text-[0.95rem] font-medium rounded-md cursor-pointer transition-colors duration-200 mb-5 hover:bg-[#21262d] hover:border-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#8b949e]"
      >
        Export CSV
      </button>

      <div>
        <h3 className="text-base font-semibold mb-3">Legend</h3>
        
        <div className="flex items-center mb-2.5">
          <span className="w-3.5 h-3.5 rounded-full mr-3 inline-block bg-[#54d396] shadow-[0_0_4px_rgba(84,211,150,0.4)]"></span>
          <span className="text-[0.95rem] text-[#f0f6fc]">Low (0–20)</span>
        </div>

        <div className="flex items-center mb-2.5">
          <span className="w-3.5 h-3.5 rounded-full mr-3 inline-block bg-[#f1c453] shadow-[0_0_4px_rgba(241,196,83,0.4)]"></span>
          <span className="text-[0.95rem] text-[#f0f6fc]">Medium (21–50)</span>
        </div>

        <div className="flex items-center">
          <span className="w-3.5 h-3.5 rounded-full mr-3 inline-block bg-[#f85149] shadow-[0_0_4px_rgba(248,81,73,0.4)]"></span>
          <span className="text-[0.95rem] text-[#f0f6fc]">High (51+)</span>
        </div>
      </div>
    </div>
  );
}