import { Award, CircuitBoard, Crown, Radar, SignalHigh } from "lucide-react";
import type { CompetitionResult } from "./types";

interface PersonalRecordCardProps {
  result: CompetitionResult;
  personalBestScore: number;
}

const MAX_SCORE_REFERENCE = 720;

export default function PersonalRecordCard({
  result,
  personalBestScore,
}: PersonalRecordCardProps) {
  const scoreProgress = Math.min(
    100,
    Math.round((result.score / Math.max(personalBestScore, MAX_SCORE_REFERENCE)) * 100),
  );
  const bestDelta = result.score - personalBestScore;
  const loggedDate = new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(result.loggedAt));

  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <div className="relative overflow-hidden rounded-lg border border-cyan-300/20 bg-zinc-950 p-6 shadow-2xl shadow-black/50 ring-1 ring-cyan-300/10 lg:col-span-3">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 85% 12%, rgba(34, 211, 238, 0.18), transparent 30%), linear-gradient(135deg, rgba(16, 185, 129, 0.08), transparent 42%)",
          }}
        />
        <div className="relative flex flex-col gap-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                <SignalHigh className="h-4 w-4" aria-hidden="true" />
                Latest Personal Telemetry
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-zinc-50">
                {result.competitionName}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">{result.division}</p>
            </div>
            <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-200">
              <CircuitBoard className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-800/90 bg-black/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Score
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-mono text-6xl font-semibold leading-none text-cyan-100 drop-shadow-[0_0_18px_rgba(34,211,238,0.25)]">
                  {result.score}
                </span>
                <span className="pb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  pts
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] p-5 shadow-[inset_0_0_32px_rgba(16,185,129,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/80">
                Rank
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-mono text-6xl font-semibold leading-none text-emerald-100 drop-shadow-[0_0_18px_rgba(16,185,129,0.24)]">
                  #{result.rank}
                </span>
                <Crown className="mb-3 h-6 w-6 text-emerald-300" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:col-span-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/90 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Personal Best Ring
              </p>
              <p className="mt-2 text-sm text-zinc-300">{result.playerName}</p>
            </div>
            <Radar className="h-5 w-5 text-cyan-300" aria-hidden="true" />
          </div>
          <div className="mt-6 flex items-center justify-center">
            <div
              className="grid h-44 w-44 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#22d3ee ${scoreProgress}%, rgba(39, 39, 42, 0.95) 0)`,
              }}
            >
              <div className="grid h-36 w-36 place-items-center rounded-full border border-zinc-800 bg-zinc-950 text-center shadow-inner shadow-black">
                <div>
                  <p className="font-mono text-4xl font-semibold text-zinc-50">
                    {scoreProgress}%
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    PB Load
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/90 p-4">
            <Award className="h-5 w-5 text-emerald-300" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              PB Delta
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold text-zinc-50">
              {bestDelta >= 0 ? "+" : ""}
              {bestDelta}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/90 p-4">
            <SignalHigh className="h-5 w-5 text-cyan-300" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Logged
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-50">{loggedDate}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
