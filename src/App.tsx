import { useEffect, useState } from "react";
import type { TargetedVenture, VenturesResponse } from "./types/ventures";
import type { ItemSearchEntry, ItemSearchResponse } from "./types/items";
import { fetchVentures } from "./data/ventures";
import { fetchItems } from "./data/items";
import { TargetedVentureList } from "./components/TargetedVentureList";

export function App() {
  const [ventures, setVentures] = useState<TargetedVenture[] | null>(null);
  const [itemsById, setItemsById] = useState<Map<
    number,
    ItemSearchEntry
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [venturesData, itemsData] = await Promise.all([
          fetchVentures(),
          fetchItems(),
        ]);

        setVentures(venturesData.targeted);

        const index = new Map<number, ItemSearchEntry>();

        for (const item of itemsData.items) {
          index.set(item.id, item);
        }

        setItemsById(index);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error while loading data");
        }
      }
    }

    loadData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (ventures === null || itemsById === null) {
    return <div>Loading...</div>;
  }

  return (
    <main className="app-content">
      <TargetedVentureList
        category="hunting"
        ventures={ventures}
        itemsById={itemsById}
      />
    </main>
  );
}
