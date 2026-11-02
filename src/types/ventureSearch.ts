import type { ItemSearchEntry } from "./items";
import type {
  ExplorationVenture,
  QuickVenture,
  TargetedVenture,
} from "./ventures";

export type VentureSearchResult = {
  venture: TargetedVenture | ExplorationVenture | QuickVenture;
  matchingItems: ItemSearchEntry[];
};
