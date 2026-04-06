"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ArcheryEngine, type Archer, type Distance } from "@/lib/ArcheryEngine";

export type ScoreValue = number | "X";

export type ArcherSession = Archer & {
  distance: Distance;
  currentEnd: number;
  currentScores: ScoreValue[];
  pendingScore: ScoreValue | null;
  completedEndScores: ScoreValue[][];
};

export type LeaderboardRow = {
  id: string;
  name: string;
  category: Archer["category"];
  currentEnd: number;
  rawScore: number;
  normalizedScore: number;
};

type MatchStoreValue = {
  archers: ArcherSession[];
  selectedArcherId: string;
  selectedArcher: ArcherSession;
  maxArrowsPerEnd: number;
  selectArcher: (archerId: string) => void;
  setPendingScore: (score: ScoreValue) => void;
  nextArrow: () => void;
  undoLastScore: () => void;
  startNextEnd: () => void;
  leaderboardRows: LeaderboardRow[];
};

const MAX_ARROWS_PER_END = 6;
const engine = new ArcheryEngine();

const MatchStoreContext = createContext<MatchStoreValue | null>(null);

const initialArchers: ArcherSession[] = [
  {
    id: "archer-1",
    name: "Chile Champ",
    age: 12,
    category: "Chile",
    distance: 30,
    currentEnd: 1,
    currentScores: [],
    pendingScore: null,
    completedEndScores: [],
  },
  {
    id: "archer-2",
    name: "Adult Arrow",
    age: 31,
    category: "Adult",
    distance: 30,
    currentEnd: 1,
    currentScores: [],
    pendingScore: null,
    completedEndScores: [],
  },
  {
    id: "archer-3",
    name: "Junior Ace",
    age: 16,
    category: "Junior",
    distance: 15,
    currentEnd: 1,
    currentScores: [],
    pendingScore: null,
    completedEndScores: [],
  },
];

function toNumericScore(score: ScoreValue): number {
  return score === "X" ? 10 : score;
}

function totalRawScore(archer: ArcherSession): number {
  const completed = archer.completedEndScores
    .flat()
    .reduce<number>((sum, score) => sum + toNumericScore(score), 0);

  const current = archer.currentScores.reduce<number>(
    (sum, score) => sum + toNumericScore(score),
    0,
  );

  return completed + current;
}

export function MatchStoreProvider({ children }: { children: React.ReactNode }) {
  const [archers, setArchers] = useState<ArcherSession[]>(initialArchers);
  const [selectedArcherId, setSelectedArcherId] = useState(initialArchers[0].id);

  const selectArcher = (archerId: string) => {
    setSelectedArcherId(archerId);
  };

  const setPendingScore = (score: ScoreValue) => {
    setArchers((prev) =>
      prev.map((archer) =>
        archer.id === selectedArcherId ? { ...archer, pendingScore: score } : archer,
      ),
    );
  };

  const nextArrow = () => {
    setArchers((prev) =>
      prev.map((archer) => {
        if (archer.id !== selectedArcherId || archer.pendingScore === null) return archer;
        if (archer.currentScores.length >= MAX_ARROWS_PER_END) return archer;

        return {
          ...archer,
          currentScores: [...archer.currentScores, archer.pendingScore],
          pendingScore: null,
        };
      }),
    );
  };

  const undoLastScore = () => {
    setArchers((prev) =>
      prev.map((archer) => {
        if (archer.id !== selectedArcherId || archer.currentScores.length === 0) return archer;

        return {
          ...archer,
          pendingScore: null,
          currentScores: archer.currentScores.slice(0, -1),
        };
      }),
    );
  };

  const startNextEnd = () => {
    setArchers((prev) =>
      prev.map((archer) => {
        if (archer.id !== selectedArcherId || archer.currentScores.length < MAX_ARROWS_PER_END)
          return archer;

        return {
          ...archer,
          currentEnd: archer.currentEnd + 1,
          completedEndScores: [...archer.completedEndScores, archer.currentScores],
          currentScores: [],
          pendingScore: null,
        };
      }),
    );
  };

  const leaderboardRows = useMemo<LeaderboardRow[]>(
    () =>
      [...archers]
        .map((archer) => {
          const rawScore = totalRawScore(archer);
          return {
            id: archer.id,
            name: archer.name,
            category: archer.category,
            currentEnd: archer.currentEnd,
            rawScore,
            normalizedScore: engine.calculateNormalizedScore(archer, rawScore, archer.distance),
          };
        })
        .sort((a, b) => b.normalizedScore - a.normalizedScore),
    [archers],
  );

  const selectedArcher =
    archers.find((archer) => archer.id === selectedArcherId) ??
    (() => {
      throw new Error("Selected archer missing from store");
    })();

  return (
    <MatchStoreContext.Provider
      value={{
        archers,
        selectedArcherId,
        selectedArcher,
        maxArrowsPerEnd: MAX_ARROWS_PER_END,
        selectArcher,
        setPendingScore,
        nextArrow,
        undoLastScore,
        startNextEnd,
        leaderboardRows,
      }}
    >
      {children}
    </MatchStoreContext.Provider>
  );
}

export function useMatchStore(): MatchStoreValue {
  const context = useContext(MatchStoreContext);
  if (!context) throw new Error("useMatchStore must be used within MatchStoreProvider");
  return context;
}
