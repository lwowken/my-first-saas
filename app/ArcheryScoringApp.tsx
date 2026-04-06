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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white px-4 pb-28 pt-4 text-black">
      <header className="sticky top-0 z-10 rounded-2xl border-2 border-black bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">Field Judge View</p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-600" htmlFor="archer-select">
            Active Archer
          </label>
          <select
            id="archer-select"
            value={selectedArcherId}
            onChange={(event) => selectArcher(event.target.value)}
            className="rounded-xl border-2 border-black bg-white px-3 py-3 text-base font-bold"
          >
            {archers.map((archer) => (
              <option key={archer.id} value={archer.id}>
                {archer.name} ({archer.category})
              </option>
            ))}
          </select>
        </div>
        <h1 className="mt-3 text-2xl font-black tracking-tight">{selectedArcher.name}</h1>
        <div className="mt-2 flex items-center justify-between text-sm font-semibold">
          <span className="rounded-full bg-black px-3 py-1 text-white">{selectedArcher.category}</span>
          <span>End {selectedArcher.currentEnd}</span>
        </div>
      </header>

      <section className="mt-4 rounded-2xl border-2 border-black bg-gray-50 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Current End</p>
        <div className="mt-2 grid grid-cols-6 gap-2">
          {Array.from({ length: maxArrowsPerEnd }).map((_, index) => {
            const score = selectedArcher.currentScores[index];

            return (
              <div
                key={`arrow-slot-${index}`}
                className="flex h-11 items-center justify-center rounded-lg border-2 border-black bg-white text-base font-extrabold"
              >
                {score ?? "-"}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm font-bold">
          <span>
            Arrow {Math.min(currentArrow, maxArrowsPerEnd)} / {maxArrowsPerEnd}
          </span>
          <span>Total: {endTotal}</span>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border-2 border-black bg-white p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Tap Score</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {SCORE_OPTIONS.map((score) => {
            const isActive = score === selectedArcher.pendingScore;
            return (
              <button
                key={String(score)}
                type="button"
                onClick={() => setPendingScore(score)}
                className={`min-h-16 rounded-xl border-2 text-2xl font-black shadow-sm transition active:scale-95 ${
                  isActive
                    ? "border-black bg-black text-white"
                    : "border-black bg-white text-black hover:bg-gray-100"
                }`}
              >
                {score}
              </button>
            );
          })}
        </div>
      </section>

      <Leaderboard archers={leaderboardRows} />

      <footer className="fixed bottom-0 left-0 right-0 border-t-2 border-black bg-white/95 p-4 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-2">
          <button
            type="button"
            onClick={handleSaveAsPdf}
            className="rounded-xl border-2 border-black bg-white px-4 py-3 text-base font-extrabold text-black"
          >
            Save as PDF
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={undoLastScore}
              disabled={selectedArcher.currentScores.length === 0}
              className="flex-1 rounded-xl border-2 border-black bg-white px-4 py-4 text-base font-extrabold text-black disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
            >
              Undo Last Score
            </button>
            <button
              type="button"
              onClick={isEndComplete ? startNextEnd : nextArrow}
              disabled={!isEndComplete && !canCommitArrow}
              className="flex-1 rounded-xl border-2 border-black bg-black px-4 py-4 text-base font-extrabold text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300"
            >
              {isEndComplete ? "Start Next End" : "Next Arrow"}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
