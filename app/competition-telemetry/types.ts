export const DIVISION_OPTIONS = [
  "D1CL - Divisyen 1 Cilik Lelaki",
  "PDDL - Pra Divisyen Dewasa Lelaki",
  "DIVISYEN 1- CILIK LELAKI",
] as const;

export type CompetitionDivision = (typeof DIVISION_OPTIONS)[number];

export interface CompetitionResult {
  competitionName: string;
  division: CompetitionDivision;
  playerName: string;
  score: number;
  rank: number;
  loggedAt: string;
}

export interface CompetitionEntryFormValues {
  competitionName: string;
  division: CompetitionDivision;
  score: number;
  rank: number;
}
