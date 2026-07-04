import React from 'react';

// Explicitly type the incoming dashboard statistics and interaction props
interface NetworkSidebarProps {
  stats?: {
    totalRegions?: number;
    avgCoverage?: string | number;
    avgGap?: string | number;
    criticalAreas?: number;
  };
  onExport?: () => void;
}

export default function NetworkSidebar({ stats, onExport }: NetworkSidebarProps) {
  // Fallback default values in case stats aren't loaded yet
  const {
    totalRegions = 0,
    avgCoverage = '0.0%',
    avgGap = '0.0',
    criticalAreas = 0
  } = stats || {};

  return (
    <div className="w-[280px] bg-[#0d1117] text-white font-sans p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      {/* Stats Section */}
      <div>
        <h2 className="text-[1.15rem] font-semibold mt-0 mb-3">Network Dashboard</h2>
        <div className="text-[0.95rem] mb-2 text-[#f0f6fc]">Total Regions: <span className="font-medium">{totalRegions}</span></div>
        <div className="text-[0.95rem] mb-2 text-[#f0f6fc]">Avg Coverage: <span className="font-medium">{avgCoverage}</span></div>
        <div className="text-[0.95rem] mb-2 text-[#f0f6fc]">Avg Gap: <span className="font-medium">{avgGap}</span></div>
        <div className="text-[0.95rem] mb-2 text-[#f0f6fc]">Critical Areas: <span className="font-medium">{criticalAreas}</span></div>
      </div>

      {/* Divider */}
      <hr className="border-0 border-t border-[#30363d] my-4" />

      {/* Export Button */}
      <button 
        onClick={onExport}
        className="w-full bg-[#161b22] text-white border border-[#30363d] px-4 py-2.5 text-[0.95rem] font-medium rounded-md cursor-pointer transition-colors duration-200 mb-6 hover:bg-[#21262d] hover:border-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#8b949e]"
      >
        Export CSV
      </button>

      {/* Legend Section */}
      <div>
        <h3 className="text-base font-semibold mt-0 mb-3">Legend</h3>
        
        <div className="flex items-center mb-2.5">
          <span className="w-3.5 h-3.5 rounded-full mr-3 inline-block bg-[#54d396] shadow-[0_0_4px_rgba(84,211,150,0.4)]"></span>
          <span className="text-[0.95rem] text-[#f0f6fc]">Low (0–20)</span>
        </div>
        
        <div className="flex items-center mb-2.5">
          <span className="w-3.5 h-3.5 rounded-full mr-3 inline-block bg-[#f1c453] shadow-[0_0_4px_rgba(241,196,83,0.4)]"></span>
          <span className="text-[0.95rem] text-[#f0f6fc]">Medium (21–50)</span>
        </div>
        
        <div className="flex items-center mb-2.5">
          <span className="w-3.5 h-3.5 rounded-full mr-3 inline-block bg-[#f85149] shadow-[0_0_4px_rgba(248,81,73,0.4)]"></span>
          <span className="text-[0.95rem] text-[#f0f6fc]">High (51+)</span>
        </div>
      </div>
    </div>
  );
}