export type RetainerType = "combat" | "miner" | "botanist" | "fisher";

export type TargetedCategory = "hunting" | "mining" | "botany" | "fishing";

export type ExplorationCategory =
  | "field-exploration"
  | "highland-exploration"
  | "woodland-exploration"
  | "waterside-exploration";

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

export type ExplorationVenture = {
  id: number;
  kind: "exploration";
  retainerType: RetainerType;
  category: ExplorationCategory;
  retainerTaskRandomId: number;
  name: {
    en: string;
    fr: string;
  };
  requiredLevel: number;
  durationMinutes: number;
  ventureCost: number;
  experience: number;
  requirement: Requirement;
};

export type QuickVenture = {
  id: number;
  kind: "quick";
  retainerTaskRandomId: number;
  name: {
    en: string;
    fr: string;
  };
  durationMinutes: number;
  ventureCost: number;
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
  exploration: ExplorationVenture[];
  quick: QuickVenture;
};
