import type { RetainerType } from "../types/ventures";

export const categoriesByRetainerType: Record<
  RetainerType,
  { slug: string; translationKey: string }[]
> = {
  combat: [
    { slug: "hunting", translationKey: "targetedVenture.categories.hunting" },
    {
      slug: "field-exploration",
      translationKey: "explorationVenture.categories.field",
    },
  ],
  miner: [
    { slug: "mining", translationKey: "targetedVenture.categories.mining" },
    {
      slug: "highland-exploration",
      translationKey: "explorationVenture.categories.highland",
    },
  ],
  botanist: [
    { slug: "botany", translationKey: "targetedVenture.categories.botany" },
    {
      slug: "woodland-exploration",
      translationKey: "explorationVenture.categories.woodland",
    },
  ],
  fisher: [
    { slug: "fishing", translationKey: "targetedVenture.categories.fishing" },
    {
      slug: "waterside-exploration",
      translationKey: "explorationVenture.categories.waterside",
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
