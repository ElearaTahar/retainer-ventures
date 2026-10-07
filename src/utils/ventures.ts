import type {
  ExplorationCategory,
  RetainerType,
  TargetedCategory,
} from "../types/ventures";

export const TARGETED_MIN_DURATION_MINUTES = 40;

export const targetedCategoryToRetainerType: Record<
  TargetedCategory,
  RetainerType
> = {
  hunting: "combat",
  mining: "miner",
  botany: "botanist",
  fishing: "fisher",
};

export const explorationCategoryToRetainerType: Record<
  ExplorationCategory,
  RetainerType
> = {
  "field-exploration": "combat",
  "highland-exploration": "miner",
  "woodland-exploration": "botanist",
  "waterside-exploration": "fisher",
};

export const explorationCategoryI18nKey: Record<ExplorationCategory, string> = {
  "field-exploration": "field",
  "highland-exploration": "highland",
  "woodland-exploration": "woodland",
  "waterside-exploration": "waterside",
};

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  } else if (minutes % 60 === 0) {
    return `${minutes / 60} h`;
  }

  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}
