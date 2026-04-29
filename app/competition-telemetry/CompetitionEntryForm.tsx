"use client";

import { Activity, Gauge, Medal, Save, Trophy } from "lucide-react";
import type { FormEvent } from "react";
import {
  DIVISION_OPTIONS,
  type CompetitionDivision,
  type CompetitionEntryFormValues,
} from "./types";

interface CompetitionEntryFormProps {
  playerName: string;
  onSubmit: (values: CompetitionEntryFormValues) => void;
}

export default function CompetitionEntryForm({
  playerName,
  onSubmit,
}: CompetitionEntryFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const competitionName = String(formData.get("competitionName") ?? "").trim();
    const division = String(formData.get("division")) as CompetitionDivision;
    const score = Number(formData.get("score"));
    const rank = Number(formData.get("rank"));

    if (!competitionName || !Number.isFinite(score) || !Number.isFinite(rank)) {
      return;
    }

    onSubmit({
      competitionName,
      division,
      score: Math.max(0, Math.round(score)),
      rank: Math.max(1, Math.round(rank)),
    });

    event.currentTarget.reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-800/90 bg-zinc-950/80 p-5 shadow-2xl shadow-black/40 ring-1 ring-cyan-400/10 backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            <Activity className="h-4 w-4" aria-hidden="true" />
            Manual Result Input
          </div>
          <h2 className="mt-3 text-xl font-semibold text-zinc-50">
            Competition Entry Form
          </h2>
          <p className="mt-1 max-w-md text-sm text-zinc-400">{playerName}</p>
        </div>
        <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-300">
          <Trophy className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-zinc-300">
          Competition Name
          <input
            name="competitionName"
            required
            placeholder="e.g. KOTA3D 2026"
            className="h-11 rounded-md border border-zinc-800 bg-zinc-900/80 px-3 text-zinc-50 outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/20"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-300">
          Division
          <select
            name="division"
            defaultValue={DIVISION_OPTIONS[0]}
            className="h-11 rounded-md border border-zinc-800 bg-zinc-900/80 px-3 text-zinc-50 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/20"
          >
            {DIVISION_OPTIONS.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-zinc-300">
            <span className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-cyan-300" aria-hidden="true" />
              Score
            </span>
            <input
              name="score"
              type="number"
              min={0}
              required
              placeholder="562"
              className="h-11 rounded-md border border-zinc-800 bg-zinc-900/80 px-3 text-zinc-50 outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-zinc-300">
            <span className="flex items-center gap-2">
              <Medal className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              Rank
            </span>
            <input
              name="rank"
              type="number"
              min={1}
              required
              placeholder="1"
              className="h-11 rounded-md border border-zinc-800 bg-zinc-900/80 px-3 text-zinc-50 outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300 px-4 text-sm font-bold uppercase tracking-[0.18em] text-zinc-950 shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        Log Result
      </button>
    </form>
  );
}
