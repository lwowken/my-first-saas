"use client";

import { useMemo, useState } from "react";

type AgeCategory = "Chile" | "Adult" | "Junior";
type ScoreValue = number | "X";

type ArcherInfo = {
  name: string;
  category: AgeCategory;
};

const SCORE_OPTIONS: ScoreValue[] = ["X", 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
const MAX_ARROWS_PER_END = 6;

export default function ArcheryScoringApp() {
  const [archer] = useState<ArcherInfo>({
    name: "Chile Champ",
    category: "Chile",
  });
  const [currentEnd, setCurrentEnd] = useState(1);
  const [currentScores, setCurrentScores] = useState<ScoreValue[]>([]);
  const [pendingScore, setPendingScore] = useState<ScoreValue | null>(null);

  const currentArrow = currentScores.length + 1;

  const totalForEnd = useMemo(
    () => currentScores.reduce((sum, score) => sum + (score === "X" ? 10 : score), 0),
    [currentScores],
  );

  const isEndComplete = currentScores.length >= MAX_ARROWS_PER_END;
  const canAddArrow = pendingScore !== null && !isEndComplete;

  const handleNextArrow = () => {
    if (!canAddArrow) return;

    setCurrentScores((previous) => [...previous, pendingScore]);
    setPendingScore(null);
  };

  const handleUndoLastScore = () => {
    setPendingScore(null);
    setCurrentScores((previous) => previous.slice(0, -1));
  };

  const handleStartNextEnd = () => {
    if (!isEndComplete) return;

    setCurrentEnd((previous) => previous + 1);
    setCurrentScores([]);
    setPendingScore(null);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white px-4 pb-24 pt-4 text-black">
      <header className="sticky top-0 z-10 rounded-2xl border-2 border-black bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">Field Judge View</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">{archer.name}</h1>
        <div className="mt-3 flex items-center justify-between text-sm font-semibold">
          <span className="rounded-full bg-black px-3 py-1 text-white">{archer.category}</span>
          <span>End {currentEnd}</span>
        </div>
      </header>

      <section className="mt-4 rounded-2xl border-2 border-black bg-gray-50 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Current End</p>
        <div className="mt-2 grid grid-cols-6 gap-2">
          {Array.from({ length: MAX_ARROWS_PER_END }).map((_, index) => {
            const score = currentScores[index];

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
            Arrow {Math.min(currentArrow, MAX_ARROWS_PER_END)} / {MAX_ARROWS_PER_END}
          </span>
          <span>Total: {totalForEnd}</span>
        </div>
      </section>

      <section className="mt-4 flex-1 rounded-2xl border-2 border-black bg-white p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Tap Score</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {SCORE_OPTIONS.map((score) => {
            const isActive = score === pendingScore;
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

      <footer className="fixed bottom-0 left-0 right-0 border-t-2 border-black bg-white/95 p-4 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-md gap-3">
          <button
            type="button"
            onClick={handleUndoLastScore}
            disabled={currentScores.length === 0}
            className="flex-1 rounded-xl border-2 border-black bg-white px-4 py-4 text-base font-extrabold text-black disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            Undo Last Score
          </button>
          <button
            type="button"
            onClick={isEndComplete ? handleStartNextEnd : handleNextArrow}
            disabled={!isEndComplete && !canAddArrow}
            className="flex-1 rounded-xl border-2 border-black bg-black px-4 py-4 text-base font-extrabold text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300"
          >
            {isEndComplete ? "Start Next End" : "Next Arrow"}
          </button>
        </div>
      </footer>
    </main>
  );
}
