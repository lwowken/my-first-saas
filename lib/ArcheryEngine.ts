export type Category = "Adult" | "Junior" | "Chile";
export type Distance = 15 | 30;

export type Archer = {
  id: string;
  name: string;
  age: number;
  category: Category;
};

export type MatchEntry = {
  archerId: Archer["id"];
  rawScore: number;
  distance: Distance;
};

export type RankedResult = {
  archer: Archer;
  rawScore: number;
  distance: Distance;
  normalizedScore: number;
};

type MatchSession = {
  id: string;
  archers: Map<Archer["id"], Archer>;
  entries: MatchEntry[];
};

/**
 * Engine for managing multiple archery match sessions and ranking players
 * with a fairness-adjusted normalized score.
 */
export class ArcheryEngine {
  private matches = new Map<MatchSession["id"], MatchSession>();

  createMatch(matchId: string): void {
    if (!matchId.trim()) {
      throw new Error("matchId is required");
    }

    if (!this.matches.has(matchId)) {
      this.matches.set(matchId, {
        id: matchId,
        archers: new Map(),
        entries: [],
      });
    }
  }

  registerArcher(matchId: string, archer: Archer): void {
    const match = this.getMatch(matchId);
    match.archers.set(archer.id, archer);
  }

  recordScore(matchId: string, entry: MatchEntry): void {
    const match = this.getMatch(matchId);

    if (!match.archers.has(entry.archerId)) {
      throw new Error(
        `Archer with id \"${entry.archerId}\" is not registered in match \"${matchId}\"`,
      );
    }

    match.entries.push(entry);
  }

  calculateNormalizedScore(archer: Archer, rawScore: number, distance: Distance): number {
    const ageWeight = this.getAgeWeight(archer.age, archer.category);
    const distanceWeight = this.getDistanceWeight(distance);

    return Number((rawScore * ageWeight * distanceWeight).toFixed(2));
  }

  getRankings(matchId: string): RankedResult[] {
    const match = this.getMatch(matchId);

    return match.entries
      .map((entry) => {
        const archer = match.archers.get(entry.archerId);
        if (!archer) {
          throw new Error(`Archer with id \"${entry.archerId}\" is missing from registry`);
        }

        return {
          archer,
          rawScore: entry.rawScore,
          distance: entry.distance,
          normalizedScore: this.calculateNormalizedScore(archer, entry.rawScore, entry.distance),
        };
      })
      .sort((a, b) => b.normalizedScore - a.normalizedScore);
  }

  private getMatch(matchId: string): MatchSession {
    const match = this.matches.get(matchId);
    if (!match) {
      throw new Error(`Match \"${matchId}\" does not exist`);
    }

    return match;
  }

  private getAgeWeight(age: number, category: Category): number {
    // Category baseline boosts younger groups so strong young archers can outrank
    // weaker adults after normalization.
    const categoryWeight: Record<Category, number> = {
      Adult: 1,
      Junior: 1.12,
      Chile: 1.25,
    };

    // Small age adjustment inside each category.
    // - under 14 gets stronger support
    // - 14..17 gets moderate support
    // - 18..49 baseline
    // - 50+ gets a slight support factor
    let ageAdjustment = 1;
    if (age < 14) ageAdjustment = 1.08;
    else if (age < 18) ageAdjustment = 1.04;
    else if (age >= 50) ageAdjustment = 1.03;

    return categoryWeight[category] * ageAdjustment;
  }

  private getDistanceWeight(distance: Distance): number {
    // 30m is harder, so scores there get an extra multiplier.
    return distance === 30 ? 1.15 : 1;
  }
}
