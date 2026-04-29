"use client";

import { Crosshair, LockKeyhole, UserRoundCheck } from "lucide-react";
import { useMemo, useState } from "react";
import CompetitionEntryForm from "./CompetitionEntryForm";
import { MOCK_PERSONAL_RESULT } from "./mockData";
import PersonalRecordCard from "./PersonalRecordCard";
import type { CompetitionEntryFormValues, CompetitionResult } from "./types";

export default function PersonalCompetitionTelemetry() {
  const [results, setResults] = useState<CompetitionResult[]>([MOCK_PERSONAL_RESULT]);

  const latestResult = results[0];
  const personalBestScore = useMemo(
    () => Math.max(...results.map((result) => result.score)),
    [results],
  );

  function handleEntry(values: CompetitionEntryFormValues) {
    const nextResult: CompetitionResult = {
      ...values,
      playerName: MOCK_PERSONAL_RESULT.playerName,
      loggedAt: new Date().toISOString(),
    };

    setResults((currentResults) => [nextResult, ...currentResults]);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_34%),linear-gradient(180deg,#030303_0%,#09090b_48%,#020617_100%)] px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="rounded-lg border border-zinc-800/90 bg-zinc-950/70 p-5 shadow-2xl shadow-black/50 ring-1 ring-white/5 backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                <Crosshair className="h-4 w-4" aria-hidden="true" />
                Individual View Only
              </div>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl">
                Personal Competition Telemetry
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Precision logging for one student profile, focused on personal records,
                rank capture, and competition history without global leaderboard logic.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-80">
              <div className="rounded-lg border border-zinc-800 bg-black/30 p-4">
                <LockKeyhole className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Scope
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">Private</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-black/30 p-4">
                <UserRoundCheck className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Athlete
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-zinc-100">
                  {latestResult.playerName}
                </p>
              </div>
            </div>
          </div>
        </header>

        <PersonalRecordCard
          result={latestResult}
          personalBestScore={personalBestScore}
        />

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <CompetitionEntryForm
              playerName={MOCK_PERSONAL_RESULT.playerName}
              onSubmit={handleEntry}
            />
          </div>

          <section className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-5 lg:col-span-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Private Result Stream
                </p>
                <h2 className="mt-2 text-xl font-semibold text-zinc-50">
                  Personal Logs
                </h2>
              </div>
              <p className="font-mono text-sm text-cyan-300">
                {results.length.toString().padStart(2, "0")} entries
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {results.map((result, index) => (
                <article
                  key={`${result.competitionName}-${result.loggedAt}-${index}`}
                  className="grid gap-3 rounded-lg border border-zinc-800 bg-black/25 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold text-zinc-100">
                      {result.competitionName}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{result.division}</p>
                  </div>
                  <div className="font-mono text-2xl font-semibold text-cyan-100">
                    {result.score}
                  </div>
                  <div className="font-mono text-2xl font-semibold text-emerald-100">
                    #{result.rank}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
