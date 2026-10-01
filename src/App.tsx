import { useEffect, useState } from "react";
import type { Language } from "./types/i18n";
import type { TargetedVenture } from "./types/ventures";
import type { ItemSearchEntry } from "./types/items";
import { fetchVentures } from "./data/ventures";
import { fetchItems } from "./data/items";
import { AppHeader } from "./components/AppHeader";
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
    <>
      <AppHeader />

      <main className="app-content">
        <TargetedVentureList
          category="mining"
          ventures={ventures}
          itemsById={itemsById}
        />
      </main>
    </>
  );
}
