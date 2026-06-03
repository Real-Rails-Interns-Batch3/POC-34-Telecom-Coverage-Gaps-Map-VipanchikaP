"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import NetworkDashboard, { TelecomPoint } from "@/components/NetworkDashboard";

// Dynamically import MapView to disable SSR since maps rely on client-side browser APIs
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

  // 1. Side effect: Fetches macro metrics whenever the region filter changes
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

  // 2. Side effect: Fetches raw individual points for the export system from FastAPI
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
    <main className="flex min-h-screen bg-[#030712] text-slate-100 tracking-tight font-sans select-none">
      
      {/* MAIN STAGE (70%): High-performance interactive visualization/map */}
      <section className="w-[70%] border-r border-[#1F2937] p-6">
        {/* Subtle glassmorphism container wrapper with exact 1px border specs */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117]/80 backdrop-blur-md p-6 shadow-2xl">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Telecom Coverage Gaps Map
          </h1>

          <p className="mt-2 text-sm text-[#38BDF8] uppercase tracking-widest font-semibold">
            Real Rails Intelligence Dashboard
          </p>

          <div className="mt-6 h-[80vh] overflow-hidden rounded-xl border border-[#1F2937]">
            <MapView selectedRegion={selectedRegion} />
          </div>
        </div>
      </section>

      {/* INTELLIGENCE SIDEBAR (30%): Structured Terminal Engine */}
      <aside className="w-[30%] overflow-y-auto bg-[#0B1117]/90 backdrop-blur-md border-l border-[#1F2937] p-6 flex flex-col gap-6">
        
        {/* SECTION A: Title & High-level Metrics */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Infrastructure Intelligence
          </h2>

          <div className="flex flex-col gap-4">
            {/* POPULATION CARD */}
            <div className="rounded-xl border border-[#1F2937] bg-[#030712]/60 p-5 transition-all hover:border-[#1F2937]/90">
              <p className="text-xs uppercase tracking-wider text-[#818CF8] font-bold">
                Population Served
              </p>
              <h3 className="mt-2 text-4xl font-bold text-white tracking-tight">
                {loading ? (
                  <span className="text-xl font-medium text-slate-600 animate-pulse">Loading...</span>
                ) : (
                  Number(metrics?.population_served || 0).toLocaleString()
                )}
              </h3>
            </div>

            {/* NATIONAL COVERAGE CARD */}
            <div className="rounded-xl border border-[#1F2937] bg-[#030712]/60 p-5 transition-all hover:border-[#1F2937]/90">
              <p className="text-xs uppercase tracking-wider text-[#38BDF8] font-bold">
                National Coverage Score
              </p>
              <h3 className="mt-2 text-4xl font-bold text-white tracking-tight">
                {loading ? (
                  <span className="text-xl font-medium text-slate-600 animate-pulse">Loading...</span>
                ) : (
                  `${metrics?.national_coverage_score ?? 0}%`
                )}
              </h3>
            </div>

            {/* GAP SCORE CARD */}
            <div className="rounded-xl border border-[#1F2937] bg-[#030712]/60 p-5 transition-all hover:border-[#1F2937]/90">
              <p className="text-xs uppercase tracking-wider text-[#818CF8] font-bold">
                Gap Score
              </p>
              <h3 className="mt-2 text-4xl font-bold text-white tracking-tight">
                {loading ? (
                  <span className="text-xl font-medium text-slate-600 animate-pulse">Loading...</span>
                ) : (
                  metrics?.gap_score ?? 0
                )}
              </h3>
            </div>
          </div>
        </div>

        {/* SECTION B: "Why This Matters" (Infrastructure Context) */}
        <div className="rounded-xl border border-[#1F2937] bg-[#030712]/50 p-5 backdrop-blur-sm">
          <h3 className="font-bold text-[#38BDF8] text-xs uppercase tracking-wider">
            Why This Matters
          </h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Telecom infrastructure gaps isolate regional nodes, introducing digital inequality, 
            capital market exclusion, delayed crisis response parameters, and systemic drag 
            on active digital enterprise integration.
          </p>
        </div>

        {/* SECTION C: "Who Controls the Rail" (Governance / Institutional Context) */}
        <div className="rounded-xl border border-[#1F2937] bg-[#030712]/50 p-5 backdrop-blur-sm">
          <h3 className="font-bold text-[#818CF8] text-xs uppercase tracking-wider">
            Who Controls the Rail
          </h3>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between border-b border-[#1F2937]/40 pb-1.5">
              <span className="text-slate-400">Primary Oversight:</span>
              <span className="text-white font-medium">Telecom Regulatory Authority</span>
            </div>
            <div className="flex justify-between border-b border-[#1F2937]/40 pb-1.5">
              <span className="text-slate-400">Data Rights:</span>
              <span className="text-white font-medium">Public-Private Consortium</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Data Custody:</span>
              <span className="text-[#38BDF8] font-medium">Real Rails Ops Network</span>
            </div>
          </div>
        </div>

        {/* SECTION D & E: Functional Filters, Tooltips & Download Sample System */}
        <div className="space-y-4">
          {/* REGION FILTER */}
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Filter by Region
            </label>

            <select
              className="mt-2 w-full rounded-lg border border-[#1F2937] bg-[#030712] p-2.5 text-white transition-all duration-200 outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 shadow-[0_0_8px_0.5px_rgba(56,189,248,0.15)] focus:shadow-[0_0_10px_0.5px_rgba(56,189,248,0.3)] font-medium tracking-tight cursor-pointer text-xs uppercase"
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

          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-3 text-xs text-red-400 backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Integrated internal component containing network telemetry analytics and export logic */}
          <NetworkDashboard points={points} />
        </div>

      </aside>
    </main>
  );
}