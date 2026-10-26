import type { ItemSearchEntry } from "../types/items";
import type { VentureRewardsData } from "../types/ventureRewards";
import type {
  ExplorationVenture,
  QuickVenture,
  TargetedVenture,
} from "../types/ventures";

export function getVentureDisplayIconIds(
  venture: TargetedVenture | ExplorationVenture | QuickVenture,
  itemsById: Map<number, ItemSearchEntry>,
  ventureRewards: VentureRewardsData,
): number[] {
  switch (venture.kind) {
    case "targeted": {
      const item = itemsById.get(venture.targetItemId);

      if (item === undefined) return [];

      return [item.iconId];
    }

    case "exploration":
      const rewards =
        ventureRewards.rewardsByRetainerTaskRandomId[
          venture.retainerTaskRandomId
        ];

      if (rewards === undefined) return [];
      const rewardItemIds = [
        ...rewards.allaganPieces,
        ...rewards.jobItems,
        ...rewards.minions,
        ...rewards.otherItems,
      ];

      return rewardItemIds
        .map((itemId) => itemsById.get(itemId))
        .filter((item) => item !== undefined)
        .slice(0, 2)
        .map((item) => item.iconId);

    case "quick":
      return ventureRewards.quick.rewards.knownItems
        .map((itemId) => itemsById.get(itemId))
        .filter((item) => item !== undefined)
        .slice(0, 2)
        .map((item) => item.iconId);
  }
}
