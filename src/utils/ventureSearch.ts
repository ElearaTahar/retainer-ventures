import type { ItemSearchEntry } from "../types/items";
import type { VentureRewardsData } from "../types/ventureRewards";
import type {
  ExplorationVenture,
  QuickVenture,
  TargetedVenture,
} from "../types/ventures";
import type { VentureSearchResult } from "../types/ventureSearch";
import type { Language } from "../types/i18n";

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
  language: Language,
): VentureSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);

  if (normalizedQuery === "") {
    return [];
  }

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
          venture,
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
          matchingItems: [targetItem],
          displayItems: [targetItem],
        },
      ];
    },
  );

  const quickItems = rewards.quick.rewards.knownItems
    .map((itemId) => itemsById.get(itemId))
    .filter((item) => item !== undefined);

  const matchingQuickItems = quickItems.filter((item) =>
    normalizeSearchText(item.name[language]).includes(normalizedQuery),
  );

  const quickNameMatches = normalizeSearchText(
    quickVenture.name[language],
  ).includes(normalizedQuery);

  const quickResult: VentureSearchResult | null =
    quickNameMatches || matchingQuickItems.length !== 0
      ? {
          venture: quickVenture,
          matchingItems: matchingQuickItems,
        }
      : null;

  const results: VentureSearchResult[] = [
    ...explorationResults,
    ...targetedResults,
  ];

  if (quickResult !== null) {
    results.push(quickResult);
  }

  return results;
}
