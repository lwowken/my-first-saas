import type { LeaderboardRow } from "./MatchStore";

type LeaderboardProps = {
  archers: LeaderboardRow[];
};

export default function Leaderboard({ archers }: LeaderboardProps) {
  const sorted = [...archers].sort((a, b) => b.normalizedScore - a.normalizedScore);

  return (
    <section className="mt-4 rounded-2xl border-2 border-black bg-white p-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-gray-700">Leaderboard</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-2 py-2 text-left">#</th>
              <th className="px-2 py-2 text-left">Archer</th>
              <th className="px-2 py-2 text-left">Cat.</th>
              <th className="px-2 py-2 text-right">Raw</th>
              <th className="px-2 py-2 text-right">Norm</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((archer, index) => (
              <tr key={archer.id} className="border-b border-black/20 odd:bg-gray-50">
                <td className="px-2 py-2 font-bold">{index + 1}</td>
                <td className="px-2 py-2 font-semibold">{archer.name}</td>
                <td className="px-2 py-2">{archer.category}</td>
                <td className="px-2 py-2 text-right tabular-nums">{archer.rawScore}</td>
                <td className="px-2 py-2 text-right font-black tabular-nums">
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