import { ItemSearchResponse } from "../types/items";

export async function fetchItems(): Promise<ItemSearchResponse> {
  const response = await fetch("/data/item-search-index.json");

  if (!response.ok) {
    throw new Error(`fetch items: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as ItemSearchResponse;
}
