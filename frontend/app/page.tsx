"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import NetworkDashboard, { TelecomPoint } from "@/components/NetworkDashboard";

// Dynamically import MapView to disable SSR since maps often rely on client-side browser APIs
const MapView = dynamic(
  () => import("@/components/MapView"),
  { ssr: false }
);

interface DashboardMetrics {
  population_served: string;
  national_coverage_score: number;
  gap_score: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [error, setError] = useState<string | null>(null);
  
  // State to store raw point metrics for our exportable Network Dashboard panel
  const [points, setPoints] = useState<TelecomPoint[]>([]);

  // 1. Existing side effect: Fetches macro metrics whenever the region filter changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    const queryParam = selectedRegion !== "All Regions" 
      ? `?region=${encodeURIComponent(selectedRegion)}` 
      : "";
    
    fetch(`http://127.0.0.1:8000/api/v1/dashboard/metrics${queryParam}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data: DashboardMetrics) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Data Handshake Failed:", err);
        setError("Failed to fetch current metrics from backend server");
        setLoading(false);
      });
  }, [selectedRegion]);

  // 2. NEW SIDE EFFECT: Fetches raw individual points for the export system from FastAPI
  useEffect(() => {
    const queryParam = selectedRegion !== "All Regions" 
      ? `?region=${encodeURIComponent(selectedRegion)}` 
      : "";

    fetch(`http://127.0.0.1:8000/api/v1/dashboard/points${queryParam}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data: TelecomPoint[]) => setPoints(data))
      .catch((err) => console.error("Failed to load dashboard points:", err));
  }, [selectedRegion]);

  return (
    <main className="flex min-h-screen bg-[#030712] text-slate-100">
      {/* LEFT MAP SECTION */}
      <section className="w-[70%] border-r border-slate-800/60 p-6">
        <div className="rounded-2xl border border-slate-800/50 bg-[#0B1117] p-6 shadow-xl">
          <h1 className="text-4xl font-bold text-slate-50">
            Telecom Coverage Gaps Map
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Real Rails Intelligence Dashboard
          </p>

          <div className="mt-6 h-[80vh] overflow-hidden rounded-xl border border-slate-800">
            <MapView selectedRegion={selectedRegion} />
          </div>
        </div>
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="w-[30%] overflow-y-auto bg-[#0B1117] p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold">
            Infrastructure Intelligence
          </h2>

          {/* REGION FILTER */}
          <div className="mt-4">
            <label className="text-sm text-slate-400">
              Filter by Region
            </label>

            <select
              className="mt-2 w-full rounded-lg border border-slate-700 bg-[#111827] p-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="All Regions">All Regions</option>
              <option value="Urban Core">Urban Core</option>
              <option value="Rural East">Rural East</option>
              <option value="Mountain Zone">Mountain Zone</option>
              <option value="Coastal South">Coastal South</option>
            </select>
          </div>
        </div>

        {/* ERROR NOTICE DISPLAY */}
        {error && (
          <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-xs text-red-400 animate-fade-in">
            {error}
          </div>
        )}

        {/* METRICS STACK */}
        <div className="flex flex-col gap-4">
          {/* POPULATION */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Population Served
            </p>
            <h3 className="mt-2 text-4xl font-bold">
              {loading ? (
                <span className="text-xl font-medium text-slate-500 animate-pulse">Loading...</span>
              ) : (
                metrics?.population_served || "0"
              )}
            </h3>
          </div>

          {/* COVERAGE */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              National Coverage Score
            </p>
            <h3 className="mt-2 text-4xl font-bold">
              {loading ? (
                <span className="text-xl font-medium text-slate-500 animate-pulse">Loading...</span>
              ) : (
                `${metrics?.national_coverage_score ?? 0}%`
              )}
            </h3>
          </div>

          {/* GAP SCORE */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Gap Score
            </p>
            <h3 className="mt-2 text-4xl font-bold">
              {loading ? (
                <span className="text-xl font-medium text-slate-500 animate-pulse">Loading...</span>
              ) : (
                metrics?.gap_score ?? 0
              )}
            </h3>
          </div>
        </div>

        {/* 3. PLUGGED IN COMPONENT: RENDERS THE EXPORT SYSTEM PANEL RIGHT HERE */}
        <NetworkDashboard points={points} />

        {/* INFO CARD */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
          <h3 className="font-semibold">
            Why This Matters
          </h3>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Telecom infrastructure gaps create digital inequality, economic
            exclusion, weak emergency response access, and reduced participation in
            modern digital economies.
          </p>
        </div>
      </aside>
    </main>
  );
}