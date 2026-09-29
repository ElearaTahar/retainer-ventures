export type RetainerType = "combat" | "miner" | "botanist" | "fisher";

export type TargetedCategory = "hunting" | "mining" | "botany" | "fishing";

export type Requirement =
  | { type: "item-level"; value: number }
  | { type: "gathering"; value: number };

export type YieldStat = "item-level" | "perception";

export type TargetedVenture = {
  id: number;
  kind: "targeted";
  retainerType: RetainerType;
  category: TargetedCategory;
  requiredLevel: number;
  durationMinutes: number;
  ventureCost: number;
  experience: number;
  targetItemId: number;
  quantities: number[];
  requirement: Requirement;
  yieldStat: YieldStat;
  thresholds: number[];
};

export type VenturesResponse = {
  metadata: {
    counts: {
      targeted: number;
      exploration: number;
      quick: number;
    };
  };
  targeted: TargetedVenture[];
};
