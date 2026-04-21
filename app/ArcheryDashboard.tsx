"use client";

import { useEffect, useMemo, useState } from "react";

type ScoreToken = "X" | "M" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type HistoryPoint = {
  date: string;
  score: number;
};

type ArcherRecord = {
  id: string;
  name: string;
  division: string;
  club: string;
  distance: "30m" | "50m" | "70m";
  targetFace: "WA 80cm" | "WA 122cm" | "Raid Track 60cm" | "Raid Track 80cm";
  totalPoints: number;
  timePoints: number;
  currentEnd: ScoreToken[];
  completedEnds: ScoreToken[][];
  history: HistoryPoint[];
  verifiedBy: string | null;
};

type DashboardState = {
  archers: ArcherRecord[];
  selectedArcherId: string;
};

type LeaderboardRow = ArcherRecord & {
  rank: number;
};

const STORAGE_KEY = "archery-tracking-dashboard-v1";
const TODAY = "2026-04-21";
const SCORE_KEYS: ScoreToken[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, "X", "M"];
const DISTANCE_OPTIONS: ArcherRecord["distance"][] = ["30m", "50m", "70m"];
const TARGET_FACE_OPTIONS: ArcherRecord["targetFace"][] = [
  "WA 80cm",
  "WA 122cm",
  "Raid Track 60cm",
  "Raid Track 80cm",
];

const INITIAL_ARCHERS: ArcherRecord[] = [
  {
    id: "AR-01",
    name: "Alya Nordin",
    division: "Horse Archery Pro",
    club: "Velox Range",
    distance: "70m",
    targetFace: "Raid Track 80cm",
    totalPoints: 124,
    timePoints: 18.4,
    currentEnd: [10, 9, 8],
    completedEnds: [
      [10, 10, 9, 9, 8, 10],
      [9, 8, 10, 10, 9, 9],
    ],
    history: [
      { date: "2026-01-12", score: 108 },
      { date: "2026-02-03", score: 114 },
      { date: "2026-02-28", score: 121 },
      { date: "2026-03-17", score: 126 },
      { date: "2026-04-05", score: 130 },
    ],
    verifiedBy: "Field Judge 02",
  },
  {
    id: "AR-02",
    name: "Faris Iqbal",
    division: "Horse Archery Elite",
    club: "Black Fletch",
    distance: "70m",
    targetFace: "Raid Track 80cm",
    totalPoints: 138,
    timePoints: 16.2,
    currentEnd: [9, 10, 9, 8],
    completedEnds: [
      [10, 9, 9, 9, 10, 9],
      [10, 10, 8, 9, 10, 10],
    ],
    history: [
      { date: "2026-01-08", score: 110 },
      { date: "2026-02-14", score: 117 },
      { date: "2026-03-02", score: 123 },
      { date: "2026-03-23", score: 129 },
      { date: "2026-04-11", score: 136 },
    ],
    verifiedBy: "Opponent Witness",
  },
  {
    id: "AR-03",
    name: "Nadia Rahman",
    division: "Target Recurve",
    club: "Axis 10",
    distance: "50m",
    targetFace: "WA 122cm",
    totalPoints: 119,
    timePoints: 19.6,
    currentEnd: [10, 8, 9],
    completedEnds: [
      [8, 9, 8, 10, 9, 8],
      [10, 9, 9, 8, 8, 9],
    ],
    history: [
      { date: "2026-01-18", score: 98 },
      { date: "2026-02-22", score: 105 },
      { date: "2026-03-19", score: 113 },
      { date: "2026-04-02", score: 118 },
      { date: "2026-04-15", score: 122 },
    ],
    verifiedBy: null,
  },
  {
    id: "AR-04",
    name: "Irfan Salleh",
    division: "Horse Archery Open",
    club: "Night Range",
    distance: "30m",
    targetFace: "Raid Track 60cm",
    totalPoints: 112,
    timePoints: 21.1,
    currentEnd: [10, 10],
    completedEnds: [
      [9, 8, 7, 8, 9, 10],
      [8, 9, 8, 8, 9, 9],
    ],
    history: [
      { date: "2026-01-10", score: 91 },
      { date: "2026-02-16", score: 99 },
      { date: "2026-03-12", score: 104 },
      { date: "2026-04-01", score: 110 },
      { date: "2026-04-18", score: 115 },
    ],
    verifiedBy: "Marshal Desk",
  },
];

const INITIAL_STATE: DashboardState = {
  archers: INITIAL_ARCHERS,
  selectedArcherId: INITIAL_ARCHERS[0].id,
};

function scoreToValue(token: ScoreToken) {
  if (token === "X") return 10;
  if (token === "M") return 0;
  return token;
}

function formatScoreToken(token: ScoreToken | undefined) {
  return token === undefined ? "-" : String(token);
}

function sumTokens(scores: ScoreToken[]) {
  return scores.reduce((total, score) => total + scoreToValue(score), 0);
}

function formatDateLabel(value: string) {
  return value.slice(5);
}

function toCsvValue(value: string | number) {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function cardClassName(extra?: string) {
  return `rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] ${extra ?? ""}`.trim();
}

function TelemetryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 17h3l2.2-7 3.1 10 2.2-6H20" />
      <path d="M4 5h16" opacity="0.35" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 4v2M20 12h-2M12 20v-2M4 12h2" />
    </svg>
  );
}

function VaultIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 18V6" />
      <path d="M4 18h16" />
      <path d="m7 14 3-3 3 2 4-5" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 5 6v6c0 4.5 2.9 7.9 7 9 4.1-1.1 7-4.5 7-9V6Z" />
      <path d="m9.5 12 1.8 1.8 3.7-4.1" />
    </svg>
  );
}

function HistoryChart({ points }: { points: HistoryPoint[] }) {
  const width = 720;
  const height = 260;
  const padding = 28;
  const values = points.map((point) => point.score);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const mapped = points.map((point, index) => {
    const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
    const y =
      height - padding - ((point.score - min) / range) * (height - padding * 2);
    return { ...point, x, y };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[240px] w-full">
      <defs>
        <linearGradient id="history-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00d1ff" />
          <stop offset="100%" stopColor="#61f0ff" />
        </linearGradient>
      </defs>
      {mapped.map((point) => (
        <line
          key={`${point.date}-grid`}
          x1={point.x}
          y1={24}
          x2={point.x}
          y2={height - 28}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="4 8"
        />
      ))}
      <polyline
        fill="none"
        stroke="url(#history-line)"
        strokeWidth="4"
        points={mapped.map((point) => `${point.x},${point.y}`).join(" ")}
      />
      {mapped.map((point) => (
        <g key={`${point.date}-${point.score}`}>
          <circle cx={point.x} cy={point.y} r="4.5" fill="#61f0ff" />
          <text x={point.x} y={height - 8} textAnchor="middle" fill="#78716c" fontSize="11">
            {formatDateLabel(point.date)}
          </text>
          <text x={point.x} y={Math.max(point.y - 12, 18)} textAnchor="middle" fill="#f4f4f5" fontSize="12">
            {point.score}
          </text>
        </g>
      ))}
    </svg>
  );
}

function GroupingChart({ scores }: { scores: ScoreToken[] }) {
  const arrows = scores.map((score, index) => {
    const value = scoreToValue(score);
    const offset = (index % 3) * 18 - 18;
    return {
      id: `${score}-${index}`,
      value,
      x: 90 + offset + value * 2.2,
      y: 90 + (index * 17) % 34 - value * 1.1,
    };
  });

  return (
    <svg viewBox="0 0 180 180" className="mx-auto h-44 w-44">
      {[72, 54, 36, 20].map((radius) => (
        <circle
          key={radius}
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
        />
      ))}
      {arrows.map((arrow) => (
        <circle
          key={arrow.id}
          cx={arrow.x}
          cy={arrow.y}
          r="5"
          fill="#00d1ff"
          fillOpacity={0.85}
          stroke="#dffcff"
          strokeWidth="1"
        />
      ))}
      <circle cx="90" cy="90" r="3" fill="#ffffff" />
    </svg>
  );
}

export default function ArcheryDashboard() {
  const [state, setState] = useState<DashboardState>(INITIAL_STATE);
  const [storageReady, setStorageReady] = useState(false);
  const [verificationName, setVerificationName] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DashboardState;
        if (parsed.archers?.length && parsed.selectedArcherId) {
          setState(parsed);
        }
      }
    } catch {
      // Ignore malformed demo storage and fall back to seeded data.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, storageReady]);

  const leaderboard = useMemo<LeaderboardRow[]>(() => {
    return [...state.archers]
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        return a.timePoints - b.timePoints;
      })
      .map((archer, index) => ({ ...archer, rank: index + 1 }));
  }, [state.archers]);

  const selectedArcher =
    state.archers.find((archer) => archer.id === state.selectedArcherId) ?? state.archers[0];

  const selectedRanking =
    leaderboard.find((archer) => archer.id === selectedArcher.id) ?? leaderboard[0];

  const performanceHistory = useMemo(() => {
    const last = selectedArcher.history[selectedArcher.history.length - 1];
    if (last?.date === TODAY) return selectedArcher.history;
    return [...selectedArcher.history, { date: TODAY, score: selectedArcher.totalPoints }];
  }, [selectedArcher.history, selectedArcher.totalPoints]);

  const flattenedScores = [...selectedArcher.completedEnds.flat(), ...selectedArcher.currentEnd];
  const arrowsLogged = flattenedScores.length;
  const currentEndTotal = sumTokens(selectedArcher.currentEnd);
  const perfectHits = flattenedScores.filter((score) => scoreToValue(score) === 10).length;
  const misses = flattenedScores.filter((score) => scoreToValue(score) === 0).length;
  const accuracy = arrowsLogged === 0 ? 0 : Math.round((sumTokens(flattenedScores) / (arrowsLogged * 10)) * 100);

  const summaryCards = [
    { label: "Live Rank", value: `#${selectedRanking.rank}` },
    { label: "Total Points", value: String(selectedArcher.totalPoints) },
    { label: "Time Points", value: selectedArcher.timePoints.toFixed(1) },
    { label: "Verified", value: selectedArcher.verifiedBy ? "YES" : "PENDING" },
  ];

  const updateSelectedArcher = (updater: (archer: ArcherRecord) => ArcherRecord) => {
    setState((current) => ({
      ...current,
      archers: current.archers.map((archer) =>
        archer.id === current.selectedArcherId ? updater(archer) : archer,
      ),
    }));
  };

  const handleScoreInput = (token: ScoreToken) => {
    updateSelectedArcher((archer) => {
      if (archer.currentEnd.length >= 6) return archer;
      return {
        ...archer,
        totalPoints: archer.totalPoints + scoreToValue(token),
        currentEnd: [...archer.currentEnd, token],
        verifiedBy: null,
      };
    });
  };

  const handleUndo = () => {
    updateSelectedArcher((archer) => {
      const lastShot = archer.currentEnd[archer.currentEnd.length - 1];
      if (lastShot === undefined) return archer;
      return {
        ...archer,
        totalPoints: Math.max(0, archer.totalPoints - scoreToValue(lastShot)),
        currentEnd: archer.currentEnd.slice(0, -1),
        verifiedBy: null,
      };
    });
  };

  const handleCommitEnd = () => {
    updateSelectedArcher((archer) => {
      if (archer.currentEnd.length === 0) return archer;
      const history = [...archer.history];
      const latest = history[history.length - 1];
      if (latest?.date === TODAY) {
        latest.score = archer.totalPoints;
      } else {
        history.push({ date: TODAY, score: archer.totalPoints });
      }
      return {
        ...archer,
        completedEnds: [...archer.completedEnds, archer.currentEnd],
        currentEnd: [],
        history,
      };
    });
  };

  const handleVerify = () => {
    const trimmed = verificationName.trim();
    if (!trimmed) return;
    updateSelectedArcher((archer) => ({ ...archer, verifiedBy: trimmed }));
    setVerificationName("");
  };

  const handleDistanceChange = (value: ArcherRecord["distance"]) => {
    updateSelectedArcher((archer) => ({ ...archer, distance: value }));
  };

  const handleTargetFaceChange = (value: ArcherRecord["targetFace"]) => {
    updateSelectedArcher((archer) => ({ ...archer, targetFace: value }));
  };

  const handleExport = () => {
    const rows = [
      [
        "Rank",
        "Archer",
        "Division",
        "Club",
        "Distance",
        "Target Face",
        "Total Points",
        "Time Points",
        "Verified By",
      ],
      ...leaderboard.map((archer) => [
        archer.rank,
        archer.name,
        archer.division,
        archer.club,
        archer.distance,
        archer.targetFace,
        archer.totalPoints,
        archer.timePoints.toFixed(1),
        archer.verifiedBy ?? "Pending",
      ]),
    ];

    const csv = rows.map((row) => row.map(toCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `archery-report-${TODAY}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    const report = window.open("", "_blank", "width=1100,height=800");
    if (!report) return;

    report.document.write(`
      <html>
        <head>
          <title>Archery Tracking System Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
            h1 { margin-bottom: 8px; }
            p { color: #555; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            th, td { border: 1px solid #ddd; padding: 10px 12px; text-align: left; font-size: 14px; }
            th { background: #f4f4f5; }
          </style>
        </head>
        <body>
          <h1>Archery Tracking System Final Report</h1>
          <p>Generated on ${TODAY}. Use your browser print dialog to save as PDF.</p>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Archer</th>
                <th>Division</th>
                <th>Club</th>
                <th>Distance</th>
                <th>Target Face</th>
                <th>Total Points</th>
                <th>Time Points</th>
                <th>Verified By</th>
              </tr>
            </thead>
            <tbody>
              ${leaderboard
                .map(
                  (archer) => `
                    <tr>
                      <td>${archer.rank}</td>
                      <td>${archer.name}</td>
                      <td>${archer.division}</td>
                      <td>${archer.club}</td>
                      <td>${archer.distance}</td>
                      <td>${archer.targetFace}</td>
                      <td>${archer.totalPoints}</td>
                      <td>${archer.timePoints.toFixed(1)}</td>
                      <td>${archer.verifiedBy ?? "Pending"}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    report.document.close();
  };

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-4 text-zinc-100 md:px-6 md:py-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,209,255,0.1),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_25%)]" />
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <section className={cardClassName("overflow-hidden")}>
          <div className="flex flex-col gap-6 p-5 md:p-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-300">
                <TelemetryIcon />
                Archery Tracking System
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                Ultra-dark telemetry dashboard for field scoring, ranking, verification, and historical performance.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Mobile-first scoring on the field, real-time leaderboard for organizers, and export-ready reporting without the Excel re-entry stress.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{card.label}</div>
                  <div className="mt-2 font-mono text-2xl tracking-tight text-white">{card.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className={cardClassName("order-1 xl:col-span-4")}>
            <div className="flex h-full flex-col p-5 md:p-6">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Data Entry Module</div>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Scoring Pad</h2>
                </div>
                <div className="text-cyan-300">
                  <TargetIcon />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#090909] p-3">
                  <label className="text-[11px] uppercase tracking-[0.22em] text-zinc-500" htmlFor="archer-select">
                    Active Archer
                  </label>
                  <select
                    id="archer-select"
                    value={state.selectedArcherId}
                    onChange={(event) =>
                      setState((current) => ({ ...current, selectedArcherId: event.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
                  >
                    {state.archers.map((archer) => (
                      <option key={archer.id} value={archer.id}>
                        {archer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#090909] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Current End</div>
                  <div className="mt-2 font-mono text-2xl tracking-tight text-white">{currentEndTotal}</div>
                  <div className="mt-1 text-xs text-zinc-500">{selectedArcher.currentEnd.length}/6 arrows recorded</div>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#090909] p-3">
                  <label className="text-[11px] uppercase tracking-[0.22em] text-zinc-500" htmlFor="distance-select">
                    Target Distance
                  </label>
                  <select
                    id="distance-select"
                    value={selectedArcher.distance}
                    onChange={(event) => handleDistanceChange(event.target.value as ArcherRecord["distance"])}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
                  >
                    {DISTANCE_OPTIONS.map((distance) => (
                      <option key={distance} value={distance}>
                        {distance}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#090909] p-3">
                  <label className="text-[11px] uppercase tracking-[0.22em] text-zinc-500" htmlFor="target-face-select">
                    Target Face
                  </label>
                  <select
                    id="target-face-select"
                    value={selectedArcher.targetFace}
                    onChange={(event) => handleTargetFaceChange(event.target.value as ArcherRecord["targetFace"])}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
                  >
                    {TARGET_FACE_OPTIONS.map((face) => (
                      <option key={face} value={face}>
                        {face}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-3">
                {SCORE_KEYS.map((score) => (
                  <button
                    key={String(score)}
                    type="button"
                    onClick={() => handleScoreInput(score)}
                    className="min-h-20 rounded-[22px] border border-white/10 bg-[#090909] p-4 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.06]"
                  >
                    <div className="font-mono text-2xl tracking-tight text-white">{score}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-zinc-600">Input</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-[24px] border border-white/10 bg-[#090909] p-4">
                <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">Live Arrow Stream</div>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`arrow-slot-${index}`}
                      className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-[#050505] font-mono text-sm tracking-tight text-white"
                    >
                      {formatScoreToken(selectedArcher.currentEnd[index])}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:border-white/20"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedArcher((archer) => ({
                    ...archer,
                    totalPoints: Math.max(0, archer.totalPoints - sumTokens(archer.currentEnd)),
                    currentEnd: [],
                    verifiedBy: null,
                  }))}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:border-white/20"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleCommitEnd}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-3 text-sm text-cyan-200 transition hover:border-cyan-400/40"
                >
                  Commit
                </button>
              </div>
            </div>
          </section>

          <section className={cardClassName("order-2 xl:col-span-5")}>
            <div className="p-5 md:p-6">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Personal Vault</div>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Score vs. Date</h2>
                </div>
                <div className="text-cyan-300">
                  <VaultIcon />
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white">Historical performance curve</div>
                    <div className="mt-1 text-xs text-zinc-500">Local demo data plus the active live session</div>
                  </div>
                  <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                    PERSISTED
                  </div>
                </div>
                <div className="mt-4">
                  <HistoryChart points={performanceHistory} />
                </div>
              </div>
            </div>
          </section>

          <section className={cardClassName("order-3 xl:col-span-3")}>
            <div className="p-5 md:p-6">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Active End / Round</div>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Archer Focus</h2>
                </div>
                <div className="text-cyan-300">
                  <ShieldIcon />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm text-white">{selectedArcher.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {selectedArcher.division} · {selectedArcher.club}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs tracking-tight text-zinc-300">
                      #{selectedRanking.rank}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Distance</div>
                    <div className="mt-2 font-mono text-2xl tracking-tight text-white">{selectedArcher.distance}</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Time Points</div>
                    <div className="mt-2 font-mono text-2xl tracking-tight text-white">{selectedArcher.timePoints.toFixed(1)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Accuracy</div>
                    <div className="mt-2 font-mono text-xl tracking-tight text-white">{accuracy}%</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">10 / X Hits</div>
                    <div className="mt-2 font-mono text-xl tracking-tight text-white">{perfectHits}</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Misses</div>
                    <div className="mt-2 font-mono text-xl tracking-tight text-white">{misses}</div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Arrow Grouping Statistics</div>
                  <GroupingChart scores={flattenedScores.slice(-8)} />
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-400">
                    <div className="rounded-2xl border border-white/10 bg-[#050505] px-3 py-2">
                      Cluster radius <span className="font-mono text-white">18px</span>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#050505] px-3 py-2">
                      Logged arrows <span className="font-mono text-white">{arrowsLogged}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Verification Step</div>
                      <div className="mt-1 text-sm text-white">
                        {selectedArcher.verifiedBy ? `Signed off by ${selectedArcher.verifiedBy}` : "Awaiting opponent / witness sign-off"}
                      </div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs ${selectedArcher.verifiedBy ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border border-amber-400/20 bg-amber-400/10 text-amber-300"}`}>
                      {selectedArcher.verifiedBy ? "VERIFIED" : "PENDING"}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={verificationName}
                      onChange={(event) => setVerificationName(event.target.value)}
                      placeholder="Witness or opponent name"
                      className="flex-1 rounded-2xl border border-white/10 bg-[#050505] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40"
                    />
                    <button
                      type="button"
                      onClick={handleVerify}
                      className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-3 text-sm text-cyan-200 transition hover:border-cyan-400/40"
                    >
                      Sign Off
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={cardClassName("order-4 xl:col-span-7")}>
            <div className="p-5 md:p-6">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Live Leaderboard</div>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Ranked by total points, tie-broken by time-points</h2>
                </div>
                <div className="text-cyan-300">
                  <TelemetryIcon />
                </div>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#090909]">
                <div className="grid grid-cols-[72px_1.5fr_1fr_112px_112px] border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  <div>Rank</div>
                  <div>Archer</div>
                  <div>Division</div>
                  <div className="text-right">Points</div>
                  <div className="text-right">Time</div>
                </div>
                {leaderboard.map((archer) => (
                  <button
                    key={archer.id}
                    type="button"
                    onClick={() => setState((current) => ({ ...current, selectedArcherId: archer.id }))}
                    className={`grid w-full grid-cols-[72px_1.5fr_1fr_112px_112px] items-center border-b border-white/5 px-4 py-4 text-left transition hover:bg-white/[0.03] ${
                      archer.id === state.selectedArcherId ? "bg-cyan-400/[0.06]" : ""
                    }`}
                  >
                    <div className="font-mono tracking-tight text-white">#{archer.rank}</div>
                    <div>
                      <div className="text-sm text-white">{archer.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">{archer.club}</div>
                    </div>
                    <div className="text-sm text-zinc-400">{archer.division}</div>
                    <div className="text-right font-mono tracking-tight text-white">{archer.totalPoints}</div>
                    <div className="text-right font-mono tracking-tight text-cyan-300">{archer.timePoints.toFixed(1)}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className={cardClassName("order-5 xl:col-span-5")}>
            <div className="p-5 md:p-6">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Anti-Stress Engine</div>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">One-Click Export</h2>
                </div>
                <div className="text-cyan-300">
                  <ExportIcon />
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                  <div className="text-sm text-white">Generate an organized CSV plus a print-ready report for PDF handoff.</div>
                  <div className="mt-2 text-xs text-zinc-500">
                    This turns the live board into an exportable table so organizers avoid manual spreadsheet entry after the event.
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Export Scope</div>
                    <div className="mt-2 text-sm text-white">All competitors, rankings, time-points, verification status</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-[#090909] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Storage Status</div>
                    <div className="mt-2 font-mono text-sm tracking-tight text-white">
                      {storageReady ? "LOCALSTORAGE ONLINE" : "BOOTING"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  className="w-full rounded-[24px] border border-cyan-400/20 bg-cyan-400/[0.08] px-5 py-4 text-sm font-medium text-cyan-200 transition hover:border-cyan-400/40"
                >
                  Export PDF / Excel Report
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
