import { VentureRewards } from "../types/ventureRewards";

export function getKnownRewardItemIds(rewards: VentureRewards): number[] {
  return [
    ...rewards.allaganPieces,
    ...rewards.jobItems,
    ...rewards.minions,
    ...rewards.otherItems,
  ];
}

export function isKnownVentureReward(
  rewards: VentureRewards,
  itemId: number,
): boolean {
  const knownRewards = getKnownRewardItemIds(rewards);

  return knownRewards.includes(itemId);
}
