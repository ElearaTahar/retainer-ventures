import type { VentureRewardsData } from "../types/ventureRewards";

export async function fetchVentureRewards(): Promise<VentureRewardsData> {
  const response = await fetch("/data/venture-rewards.json");

  if (!response.ok) {
    throw new Error(
      `fetch venture rewards: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as VentureRewardsData;
}
