import type { ItemSearchEntry } from "./items";
import type {
  ExplorationCategory,
  ExplorationVenture,
  QuickVenture,
  RetainerType,
  TargetedCategory,
  TargetedVenture,
} from "./ventures";

export type VentureSearchResult = {
  kind: "venture";
  venture: TargetedVenture | ExplorationVenture | QuickVenture;
  link: string;
  matchingItems: ItemSearchEntry[];
};

export type RetainerTypeNavigationDetails = {
  kind: "retainer-type";
};

export type TargetedCategoryNavigationDetails = {
  kind: "targeted-category";
  category: TargetedCategory;
  durationMinutes: {
    min: number;
    max: number;
  };
  ventureCost: number;
};

export type ExplorationCategoryNavigationDetails = {
  kind: "exploration-category";
  category: ExplorationCategory;
  durationMinutes: number;
  ventureCost: number;
};

export type CategoryNavigationDetails =
  | TargetedCategoryNavigationDetails
  | ExplorationCategoryNavigationDetails;

export type NavigationSearchResult = {
  kind: "navigation";
  link: string;
  titleTranslationKey: string;
  retainerType: RetainerType;
  details: RetainerTypeNavigationDetails | CategoryNavigationDetails;
};

export type SearchResult = VentureSearchResult | NavigationSearchResult;
