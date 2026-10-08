import type { RetainerType } from "../types/ventures";

type VentureCategoryKind = "targeted" | "exploration";

type VentureCategory = {
  slug: string;
  translationKey: string;
  kind: VentureCategoryKind;
};

export const categoriesByRetainerType: Record<RetainerType, VentureCategory[]> =
  {
    combat: [
      {
        slug: "hunting",
        translationKey: "targetedVenture.categories.hunting",
        kind: "targeted",
      },
      {
        slug: "field-exploration",
        translationKey: "explorationVenture.categories.field",
        kind: "exploration",
      },
    ],
    miner: [
      {
        slug: "mining",
        translationKey: "targetedVenture.categories.mining",
        kind: "targeted",
      },
      {
        slug: "highland-exploration",
        translationKey: "explorationVenture.categories.highland",
        kind: "exploration",
      },
    ],
    botanist: [
      {
        slug: "botany",
        translationKey: "targetedVenture.categories.botany",
        kind: "targeted",
      },
      {
        slug: "woodland-exploration",
        translationKey: "explorationVenture.categories.woodland",
        kind: "exploration",
      },
    ],
    fisher: [
      {
        slug: "fishing",
        translationKey: "targetedVenture.categories.fishing",
        kind: "targeted",
      },
      {
        slug: "waterside-exploration",
        translationKey: "explorationVenture.categories.waterside",
        kind: "exploration",
      },
    ],
  };

export function isRetainerType(
  value: string | undefined,
): value is RetainerType {
  return (
    value === "combat" ||
    value === "miner" ||
    value === "botanist" ||
    value === "fisher"
  );
}
