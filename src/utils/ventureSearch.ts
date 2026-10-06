import { ItemSearchEntry } from "../types/items";
import { VentureRewardsData } from "../types/ventureRewards";
import type {
  ExplorationCategory,
  ExplorationVenture,
  QuickVenture,
  TargetedCategory,
  TargetedVenture,
} from "../types/ventures";
import type {
  NavigationSearchResult,
  SearchResult,
  VentureSearchResult,
} from "../types/ventureSearch";
import { Language } from "../types/i18n";
import {
  explorationCategoryI18nKey,
  explorationCategoryToRetainerType,
  TARGETED_MIN_DURATION_MINUTES,
  targetedCategoryToRetainerType,
} from "./ventures";

export function buildNavigationSearchResults(
  targetedVentures: TargetedVenture[],
  explorationVentures: ExplorationVenture[],
): NavigationSearchResult[] {
  const combatPage: NavigationSearchResult = {
    kind: "navigation",
    link: "/ventures/combat",
    titleTranslationKey: "retainerTypes.combat",
    retainerType: "combat",
    details: {
      kind: "retainer-type",
    },
  };

  const minerPage: NavigationSearchResult = {
    kind: "navigation",
    link: "/ventures/miner",
    titleTranslationKey: "retainerTypes.miner",
    retainerType: "miner",
    details: {
      kind: "retainer-type",
    },
  };

  const botanistPage: NavigationSearchResult = {
    kind: "navigation",
    link: "/ventures/botanist",
    titleTranslationKey: "retainerTypes.botanist",
    retainerType: "botanist",
    details: {
      kind: "retainer-type",
    },
  };

  const fisherPage: NavigationSearchResult = {
    kind: "navigation",
    link: "/ventures/fisher",
    titleTranslationKey: "retainerTypes.fisher",
    retainerType: "fisher",
    details: {
      kind: "retainer-type",
    },
  };

  const huntingResult = buildTargetedCategoryNavigationResult(
    "hunting",
    targetedVentures,
  );

  const miningResult = buildTargetedCategoryNavigationResult(
    "mining",
    targetedVentures,
  );

  const botanyResult = buildTargetedCategoryNavigationResult(
    "botany",
    targetedVentures,
  );

  const fishingResult = buildTargetedCategoryNavigationResult(
    "fishing",
    targetedVentures,
  );

  const fieldResult = buildExplorationCategoryNavigationResult(
    "field-exploration",
    explorationVentures,
  );

  const highlandResult = buildExplorationCategoryNavigationResult(
    "highland-exploration",
    explorationVentures,
  );

  const woodlandResult = buildExplorationCategoryNavigationResult(
    "woodland-exploration",
    explorationVentures,
  );

  const watersideResult = buildExplorationCategoryNavigationResult(
    "waterside-exploration",
    explorationVentures,
  );

  return [
    combatPage,
    minerPage,
    botanistPage,
    fisherPage,
    huntingResult,
    miningResult,
    botanyResult,
    fishingResult,
    fieldResult,
    highlandResult,
    woodlandResult,
    watersideResult,
  ];
}

function buildTargetedCategoryNavigationResult(
  category: TargetedCategory,
  targetedVentures: TargetedVenture[],
): NavigationSearchResult {
  const retainerType = targetedCategoryToRetainerType[category];
  const link = `/ventures/${retainerType}/${category}`;
  const titleTranslationKey = `targetedVenture.categories.${category}`;

  const filteredTargetedVentures = targetedVentures.filter(
    (venture) => venture.category === category,
  );

  if (filteredTargetedVentures.length === 0) {
    throw new Error(
      `Cannot build ${category} search result: no ventures found`,
    );
  }

  const durations = new Set(
    filteredTargetedVentures.map((venture) => venture.durationMinutes),
  );
  const costs = new Set(
    filteredTargetedVentures.map((venture) => venture.ventureCost),
  );

  if (durations.size > 1) {
    throw new Error(
      `Cannot build ${category} search result: ventures have inconsistent durations: ${[...durations].join(", ")}`,
    );
  }
  if (costs.size > 1) {
    throw new Error(
      `Cannot build ${category} search result: ventures have inconsistent costs: ${[...costs].join(", ")}`,
    );
  }

  const duration = [...durations][0];
  const cost = [...costs][0];

  return {
    kind: "navigation",
    link,
    titleTranslationKey,
    retainerType,
    details: {
      kind: "targeted-category",
      category,
      durationMinutes: {
        min: TARGETED_MIN_DURATION_MINUTES,
        max: duration,
      },
      ventureCost: cost,
    },
  };
}

function buildExplorationCategoryNavigationResult(
  category: ExplorationCategory,
  explorationVentures: ExplorationVenture[],
): NavigationSearchResult {
  const retainerType = explorationCategoryToRetainerType[category];
  const link = `/ventures/${retainerType}/${category}`;
  const titleTranslationKey = `explorationVenture.categories.${explorationCategoryI18nKey[category]}`;

  const filteredExplorationVentures = explorationVentures.filter(
    (venture) => venture.category === category,
  );

  if (filteredExplorationVentures.length === 0) {
    throw new Error(
      `Cannot build ${category} search result: no ventures found`,
    );
  }

  const durations = new Set(
    filteredExplorationVentures.map((venture) => venture.durationMinutes),
  );
  const costs = new Set(
    filteredExplorationVentures.map((venture) => venture.ventureCost),
  );

  if (durations.size > 1) {
    throw new Error(
      `Cannot build ${category} search result: ventures have inconsistent durations: ${[...durations].join(", ")}`,
    );
  }
  if (costs.size > 1) {
    throw new Error(
      `Cannot build ${category} search result: ventures have inconsistent costs: ${[...costs].join(", ")}`,
    );
  }

  const duration = [...durations][0];
  const cost = [...costs][0];

  return {
    kind: "navigation",
    link,
    titleTranslationKey,
    retainerType,
    details: {
      kind: "exploration-category",
      category,
      durationMinutes: duration,
      ventureCost: cost,
    },
  };
}

type Translate = (key: string) => string;

function normalizeSearchText(text: string): string {
  return text.trim().toLocaleLowerCase();
}

export function searchVentures(
  query: string,
  targetedVentures: TargetedVenture[],
  explorationVentures: ExplorationVenture[],
  quickVenture: QuickVenture,
  itemsById: Map<number, ItemSearchEntry>,
  rewards: VentureRewardsData,
  translate: Translate,
  language: Language,
): SearchResult[] {
  const normalizedQuery = normalizeSearchText(query);

  if (normalizedQuery === "") {
    return [];
  }

  const navigationResults = buildNavigationSearchResults(
    targetedVentures,
    explorationVentures,
  );

  const matchingNavigationResults = navigationResults.filter((result) =>
    normalizeSearchText(translate(result.titleTranslationKey)).includes(
      normalizedQuery,
    ),
  );

  const explorationResults = explorationVentures.flatMap<VentureSearchResult>(
    (venture) => {
      const nameMatches = normalizeSearchText(venture.name[language]).includes(
        normalizedQuery,
      );

      const ventureRewards =
        rewards.rewardsByRetainerTaskRandomId[venture.retainerTaskRandomId];

      let matchingItems: ItemSearchEntry[] = [];

      if (ventureRewards) {
        const rewardItemIds = [
          ...ventureRewards.allaganPieces,
          ...ventureRewards.jobItems,
          ...ventureRewards.minions,
          ...ventureRewards.otherItems,
        ];

        const rewardItems = rewardItemIds
          .map((itemId) => itemsById.get(itemId))
          .filter((item) => item !== undefined);

        matchingItems = rewardItems.filter((item) =>
          normalizeSearchText(item.name[language]).includes(normalizedQuery),
        );
      }

      if (matchingItems.length === 0 && !nameMatches) return [];
      return [
        {
          kind: "venture",
          venture,
          link: `/ventures/${venture.retainerType}/${venture.category}`,
          matchingItems,
        },
      ];
    },
  );

  const targetedResults = targetedVentures.flatMap<VentureSearchResult>(
    (venture) => {
      const targetItem = itemsById.get(venture.targetItemId);

      if (!targetItem) return [];

      if (
        !normalizeSearchText(targetItem.name[language]).includes(
          normalizedQuery,
        )
      ) {
        return [];
      }

      return [
        {
          kind: "venture",
          venture,
          link: `/ventures/${venture.retainerType}/${venture.category}`,
          matchingItems: [targetItem],
        },
      ];
    },
  );

  const matchingQuickItems = rewards.quick.rewards.knownItems
    .map((itemId) => itemsById.get(itemId))
    .filter((item) => item !== undefined)
    .filter((item) =>
      normalizeSearchText(item.name[language]).includes(normalizedQuery),
    );

  const quickNameMatches = normalizeSearchText(
    quickVenture.name[language],
  ).includes(normalizedQuery);

  const quickResult: VentureSearchResult | null =
    quickNameMatches || matchingQuickItems.length !== 0
      ? {
          kind: "venture",
          venture: quickVenture,
          link: "/ventures/quick-exploration",
          matchingItems: matchingQuickItems,
        }
      : null;

  const results: SearchResult[] = [
    ...matchingNavigationResults,
    ...explorationResults,
    ...targetedResults,
  ];

  if (quickResult !== null) {
    results.push(quickResult);
  }

  return results;
}
