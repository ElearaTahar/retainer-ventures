import type { VenturesResponse } from "../types/ventures";

export async function fetchVentures(): Promise<VenturesResponse> {
  const response = await fetch("/data/ventures.json");

  if (!response.ok) {
    throw new Error(
      `fetch ventures: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as VenturesResponse;
}
