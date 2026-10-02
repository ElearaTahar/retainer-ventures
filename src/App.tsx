import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { ExplorationVenture, TargetedVenture } from "./types/ventures";
import type { ItemSearchEntry } from "./types/items";
import type { VentureRewardsData } from "./types/ventureRewards";
import { fetchVentures } from "./data/ventures";
import { fetchItems } from "./data/items";
import { fetchVentureRewards } from "./data/ventureRewards";
import { AppHeader } from "./components/AppHeader";
import { VenturesPage } from "./pages/VenturesPage";
import { RetainerTypePage } from "./pages/RetainerTypePage";
import { VentureCategoryPage } from "./pages/VentureCategoryPage";
import { RetainersPage } from "./pages/RetainersPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  const [targetedVentures, setTargetedVentures] = useState<
    TargetedVenture[] | null
  >(null);

  const [explorationVentures, setExplorationVentures] = useState<
    ExplorationVenture[] | null
  >(null);

  const [itemsById, setItemsById] = useState<Map<
    number,
    ItemSearchEntry
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ventureRewards, setVentureRewards] =
    useState<VentureRewardsData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [venturesData, itemsData, rewardsData] = await Promise.all([
          fetchVentures(),
          fetchItems(),
          fetchVentureRewards(),
        ]);

        setTargetedVentures(venturesData.targeted);
        setExplorationVentures(venturesData.exploration);

        setVentureRewards(rewardsData);

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

  if (
    targetedVentures === null ||
    explorationVentures === null ||
    itemsById === null ||
    ventureRewards === null
  ) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AppHeader />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/ventures" replace />} />
          <Route path="/ventures" element={<VenturesPage />} />
          <Route path="/retainers" element={<RetainersPage />} />
          <Route
            path="/ventures/:retainerType"
            element={<RetainerTypePage />}
          />
          <Route
            path="/ventures/:retainerType/:category"
            element={
              <VentureCategoryPage
                ventures={targetedVentures}
                explorationVentures={explorationVentures}
                ventureRewards={ventureRewards}
                itemsById={itemsById}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
