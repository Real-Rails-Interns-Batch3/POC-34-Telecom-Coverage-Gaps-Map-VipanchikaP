"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// Lightweight local SVG icon substitutes to avoid external dependency on `lucide-react`
import React from "react";

// Injected dynamic host check for production vs local development environment stability
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const SvgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

export const Info = (props: React.SVGProps<SVGSVGElement>) => <SvgIcon {...props} />;
export const X = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);
export const SlidersHorizontal = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 6h16" />
    <path d="M10 6v12" />
    <path d="M4 18h16" />
    <path d="M14 18V6" />
  </svg>
);
export const InfoIcon = Info;
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
  // --- Back-end State Hooks (Preserved) ---
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<TelecomPoint[]>([]);

  // --- Cinematic UI Layout Controls ---
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 1. Preserved Side Effect: Macro metrics fetch configuration
  useEffect(() => {
    setLoading(true);
    setError(null);

    const queryParam = selectedRegion !== "All Regions" 
      ? `?region=${encodeURIComponent(selectedRegion)}` 
      : "";
    
    fetch(`${API_BASE_URL}/api/v1/dashboard/metrics${queryParam}`)
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

  // 2. Preserved Side Effect: Raw map points fetch configuration
  useEffect(() => {
    const queryParam = selectedRegion !== "All Regions" 
      ? `?region=${encodeURIComponent(selectedRegion)}` 
      : "";

    fetch(`${API_BASE_URL}/api/v1/dashboard/points${queryParam}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data: TelecomPoint[]) => setPoints(data))
      .catch((err) => console.error("Failed to load dashboard points:", err));
  }, [selectedRegion]);

  return (
    /* PILLAR I: Custom Deep DNA Background (Obsidian Slate: #0e0b16, Luminance less than 10%) */
    <div className="relative w-screen h-screen overflow-hidden bg-[#0e0b16] text-slate-100 tracking-tight font-sans select-none">
      
      {/* PILLAR III: Minimalist Transparent Header Bar */}
      <header className="absolute top-0 left-0 z-40 w-full h-16 flex items-center justify-between px-6 bg-gradient-to-b from-[#0e0b16]/90 via-[#0e0b16]/40 to-transparent backdrop-blur-[2px] border-b border-purple-500/10">
        <div>
          <h1 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Infocreon Internship - <span className="text-purple-400">Telecom Infrastructure Engine</span>
          </h1>
        </div>
        
        {/* Top-Right Control Actions */}
        <div className="flex items-center gap-3">
          {/* Main Map Layer Filter Trigger Toggle */}
          <button 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0e0b16]/80 text-xs font-medium text-slate-300 hover:text-purple-400 hover:border-purple-500/40 transition-all duration-200"
          >
            <SlidersHorizontal width={14} height={14} />
            <span>Telemetry Controls</span>
          </button>

          {/* Core Info Icon Trigger */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-lg border border-slate-800 bg-[#0e0b16]/80 text-slate-400 hover:text-purple-400 hover:border-purple-500/40 transition-all duration-200"
          >
            <Info width={15} height={15} />
          </button>
        </div>
      </header>

      {/* PILLAR II: 100% Full viewport Stage Box */}
      <main className="w-full h-full z-10 relative">
        <MapView selectedRegion={selectedRegion} />

        {/* Dynamic Map Status Indicator Widget (Bottom Left) */}
        <div className="absolute bottom-6 left-6 z-30 p-4 rounded-xl border border-slate-800/80 bg-[#0e0b16]/90 backdrop-blur-md shadow-2xl max-w-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Active Node Region Context:</p>
          </div>
          <p className="text-xs font-bold text-white mt-1 uppercase tracking-wide">{selectedRegion}</p>
        </div>
      </main>

      {/* PILLAR II: Slide-Over Intelligence Panel Overlay */}
      <div 
        className={`absolute top-0 right-0 z-50 h-full w-[420px] max-w-[90vw] bg-[#0e0b16]/95 border-l border-slate-800/80 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Container Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-900">
          <div>
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase block">Infrastructure Analytics</span>
            <h2 className="text-md font-bold text-white tracking-tight">Intelligence Matrix</h2>
          </div>
          <button 
            onClick={() => setIsPanelOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X width={16} height={16} />
          </button>
        </div>

        {/* Scrollable Content Engine Wrapper */}
        <div className="p-6 space-y-5 overflow-y-auto h-[calc(100%-76px)]">
          
          {/* REGION FILTER DROPDOWN */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
              Filter Active Region Node
            </label>
            <select
              className="w-full rounded-lg border border-slate-800 bg-[#0e0b16] p-2 text-white outline-none focus:border-purple-500 transition-all cursor-pointer text-xs uppercase"
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
            <div className="rounded-lg border border-red-950 bg-red-950/20 p-2.5 text-xs text-red-400 font-mono">
              {error}
            </div>
          )}

          {/* TELEMETRY CARDS METRICS SECTION */}
          <div className="space-y-3">
            {/* POPULATION CARD */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-purple-400 font-mono font-bold">
                Population Served
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white tracking-tight">
                {loading ? (
                  <span className="text-xs font-medium text-slate-600 animate-pulse">Querying Database...</span>
                ) : (
                  Number(metrics?.population_served || 0).toLocaleString()
                )}
              </h3>
            </div>

            {/* NATIONAL COVERAGE CARD */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-purple-400 font-mono font-bold">
                National Coverage Score
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white tracking-tight">
                {loading ? (
                  <span className="text-xs font-medium text-slate-600 animate-pulse">Querying Database...</span>
                ) : (
                  `${metrics?.national_coverage_score ?? 0}%`
                )}
              </h3>
            </div>

            {/* GAP SCORE CARD */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-purple-400 font-mono font-bold">
                Gap Score
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white tracking-tight">
                {loading ? (
                  <span className="text-xs font-medium text-slate-600 animate-pulse">Querying Database...</span>
                ) : (
                  metrics?.gap_score ?? 0
                )}
              </h3>
            </div>
          </div>

          {/* DATA METADATA CUSTODY PROFILE */}
          <div className="rounded-xl border border-slate-900 bg-slate-950/20 p-4 space-y-2 text-[11px]">
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-500">Primary Oversight:</span>
              <span className="text-slate-300 font-medium">Telecom Regulatory Authority</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data Rights Portfolio:</span>
              <span className="text-purple-400 font-medium">Public-Private Consortium</span>
            </div>
          </div>

          {/* EXTERNAL INJECTED COMPONENT CONTROLS */}
          <div className="pt-2 border-t border-slate-900">
            <NetworkDashboard points={points} />
          </div>

        </div>
      </div>

      {/* PILLAR III: Developer Signature Authentication Popover Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-[380px] bg-[#0e0b16] border border-slate-800 rounded-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            
            <div className="mb-5">
              <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase block mb-0.5">System Verification</span>
              <h3 className="text-sm font-bold text-white">Lead Architect Signature</h3>
            </div>

            <div className="space-y-2 font-mono text-xs border-y border-slate-900 py-3.5 my-4">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">ARCHITECT:</span>
                <span className="text-slate-200 font-semibold tracking-wide">Vipanjika P</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">ASSIGNMENT:</span>
                <span className="text-slate-200">Batch 2 Interns</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">CORE STACK:</span>
                <span className="text-purple-400">Next.js, FastAPI, Tailwind, React Leaflet</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition-all border border-slate-800"
              >
                Dismiss Sign-off
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}