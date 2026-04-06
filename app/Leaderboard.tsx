import type { LeaderboardRow } from "./MatchStore";

type LeaderboardProps = {
  archers: LeaderboardRow[];
};

export default function Leaderboard({ archers }: LeaderboardProps) {
  const sorted = [...archers].sort((a, b) => b.normalizedScore - a.normalizedScore);

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-lg shadow-black/10">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Leaderboard</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse text-sm text-slate-200">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-400">
              <th className="w-12 px-3 py-3 text-left font-semibold">#</th>
              <th className="px-3 py-3 text-left font-semibold">Archer</th>
              <th className="w-24 px-3 py-3 text-left font-semibold">Cat.</th>
              <th className="w-20 px-3 py-3 text-right font-semibold">Raw</th>
              <th className="w-24 px-3 py-3 text-right font-semibold">Norm</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((archer, index) => (
              <tr
                key={archer.id}
                className="border-b border-white/5 transition-colors odd:bg-white/[0.02] hover:bg-white/[0.04]"
              >
                <td className="px-3 py-3 font-semibold text-white">{index + 1}</td>
                <td className="truncate px-3 py-3 font-medium text-slate-100">{archer.name}</td>
                <td className="px-3 py-3 text-slate-300">{archer.category}</td>
                <td className="px-3 py-3 text-right tabular-nums text-slate-300">{archer.rawScore}</td>
                <td className="px-3 py-3 text-right font-extrabold tabular-nums text-white">
                  {archer.normalizedScore.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
