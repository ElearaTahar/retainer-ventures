import type { Retainer } from "../types/retainers";
import type { TargetedVenture } from "../types/ventures";

export function getSuggestedQuantity(
  venture: TargetedVenture,
  retainer: Retainer,
): number | null {
  let statValue: number | null = null;

  if (venture.yieldStat === "item-level") {
    statValue =
      retainer.retainerType === "combat" ? (retainer.itemLevel ?? null) : null;
  }

  if (venture.yieldStat === "perception") {
    statValue =
      retainer.retainerType !== "combat" ? (retainer.perception ?? null) : null;
  }

  if (statValue === null) return null;

  const thresholds = venture.thresholds.map(
    (threshold) => threshold <= statValue,
  );

  const indexThreshold = thresholds.lastIndexOf(true);

  return venture.quantities[indexThreshold + 1];
}
