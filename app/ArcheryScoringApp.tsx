"use client";

import Leaderboard from "./Leaderboard";
import { type ScoreValue, useMatchStore } from "./MatchStore";

const SCORE_OPTIONS: ScoreValue[] = ["X", 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

export default function ArcheryScoringApp() {
  const {
    archers,
    selectedArcher,
    selectedArcherId,
    maxArrowsPerEnd,
    selectArcher,
    setPendingScore,
    nextArrow,
    undoLastScore,
    startNextEnd,
    leaderboardRows,
  } = useMatchStore();

  const currentArrow = selectedArcher.currentScores.length + 1;
  const endTotal = selectedArcher.currentScores.reduce<number>(
  (sum, score) => sum + (score === "X" ? 10 : score),
  0,
);
  const isEndComplete = selectedArcher.currentScores.length >= maxArrowsPerEnd;
  const canCommitArrow = selectedArcher.pendingScore !== null && !isEndComplete;

  const handleSaveAsPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Official Match Report", 14, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Selected Archer: ${selectedArcher.name}`, 14, 28);
      doc.text(`Category: ${selectedArcher.category}`, 14, 34);
      doc.text(`Current End: ${selectedArcher.currentEnd}`, 14, 40);

      let y = 52;
      doc.setFont("helvetica", "bold");
      doc.text("Rankings", 14, y);
      y += 6;

      leaderboardRows.forEach((row, index) => {
        doc.setFont("helvetica", "normal");
        doc.text(
          `${index + 1}. ${row.name} (${row.category})  Raw: ${row.rawScore}  Norm: ${row.normalizedScore.toFixed(2)}`,
          14,
          y,
        );
        y += 6;
      });

      doc.save("archery-match-report.pdf");
    } catch (error) {
      console.error("Failed to generate PDF report", error);
      window.alert("PDF generation unavailable right now. Please ensure jspdf is installed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1120] px-4 py-6 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-28">
      <header className="sticky top-4 z-10 rounded-3xl border border-white/10 bg-[#111827]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Field Judge View</p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400" htmlFor="archer-select">
            Active Archer
          </label>
          <select
            id="archer-select"
            value={selectedArcherId}
            onChange={(event) => selectArcher(event.target.value)}
            className="rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-base font-semibold text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          >
            {archers.map((archer) => (
              <option key={archer.id} value={archer.id}>
                {archer.name} ({archer.category})
              </option>
            ))}
          </select>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">{selectedArcher.name}</h1>
        <div className="mt-3 flex items-center justify-between text-sm font-medium text-slate-300">
          <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-sky-200">
            {selectedArcher.category}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            End {selectedArcher.currentEnd}
          </span>
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-lg shadow-black/10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Current End</p>
        <div className="mt-2 grid grid-cols-6 gap-2">
          {Array.from({ length: maxArrowsPerEnd }).map((_, index) => {
            const score = selectedArcher.currentScores[index];

            return (
              <div
                key={`arrow-slot-${index}`}
                className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0f172a] text-base font-bold text-slate-100"
              >
                {score ?? "-"}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-300">
          <span>
            Arrow {Math.min(currentArrow, maxArrowsPerEnd)} / {maxArrowsPerEnd}
          </span>
          <span className="text-white">Total: {endTotal}</span>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-lg shadow-black/10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tap Score</p>
        <div className="mt-4 rounded-3xl border border-white/10 bg-[#0f172a] p-4">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {SCORE_OPTIONS.map((score) => {
            const isActive = score === selectedArcher.pendingScore;
            return (
              <button
                key={String(score)}
                type="button"
                onClick={() => setPendingScore(score)}
                className={`min-h-16 rounded-2xl border text-2xl font-semibold shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-slate-800 active:scale-[0.98] ${
                  isActive
                    ? "border-sky-400/60 bg-sky-500/15 text-sky-100 shadow-sky-900/30"
                    : "border-white/10 bg-[#111827] text-slate-100"
                }`}
              >
                {score}
              </button>
            );
          })}
        </div>
        </div>
      </section>

      <Leaderboard archers={leaderboardRows} />

      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0b1120]/90 p-4 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-3">
          <button
            type="button"
            onClick={handleSaveAsPdf}
            className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-base font-semibold text-slate-100 transition hover:border-sky-400/40 hover:bg-slate-800"
          >
            Save as PDF
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={undoLastScore}
              disabled={selectedArcher.currentScores.length === 0}
              className="flex-1 rounded-2xl border border-white/10 bg-[#111827] px-4 py-4 text-base font-semibold text-slate-100 transition hover:border-white/20 hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-slate-500"
            >
              Undo Last Score
            </button>
            <button
              type="button"
              onClick={isEndComplete ? startNextEnd : nextArrow}
              disabled={!isEndComplete && !canCommitArrow}
              className="flex-1 rounded-2xl border border-sky-400/40 bg-sky-500/15 px-4 py-4 text-base font-semibold text-sky-100 transition hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-slate-500"
            >
              {isEndComplete ? "Start Next End" : "Next Arrow"}
            </button>
          </div>
        </div>
      </footer>
      </div>
    </main>
  );
}
