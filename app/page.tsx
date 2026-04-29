"use client";

import { BarChart3, Radar } from "lucide-react";
import { useState } from "react";
import ArcheryDashboard from "./ArcheryDashboard";
import PersonalCompetitionTelemetry from "./competition-telemetry/PersonalCompetitionTelemetry";

type DashboardView = "leaderboard" | "telemetry";

export default function Home() {
  const [activeView, setActiveView] = useState<DashboardView>("leaderboard");

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex rounded-lg border border-zinc-800 bg-zinc-950/90 p-1 shadow-2xl shadow-black/40 ring-1 ring-cyan-300/10 backdrop-blur">
        <button
          type="button"
          onClick={() => setActiveView("leaderboard")}
          className={`flex h-10 items-center gap-2 rounded-md px-3 text-xs font-bold uppercase tracking-[0.16em] transition ${
            activeView === "leaderboard"
              ? "bg-cyan-300 text-zinc-950 shadow-lg shadow-cyan-950/40"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
          }`}
          aria-pressed={activeView === "leaderboard"}
        >
          <BarChart3 className="h-4 w-4" aria-hidden="true" />
          Leaderboard
        </button>
        <button
          type="button"
          onClick={() => setActiveView("telemetry")}
          className={`flex h-10 items-center gap-2 rounded-md px-3 text-xs font-bold uppercase tracking-[0.16em] transition ${
            activeView === "telemetry"
              ? "bg-emerald-300 text-zinc-950 shadow-lg shadow-emerald-950/40"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
          }`}
          aria-pressed={activeView === "telemetry"}
        >
          <Radar className="h-4 w-4" aria-hidden="true" />
          Telemetry
        </button>
      </div>

      {activeView === "leaderboard" ? (
        <ArcheryDashboard />
      ) : (
        <PersonalCompetitionTelemetry />
      )}
    </>
  );
}
