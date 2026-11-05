import { useTranslation } from "react-i18next";
import type { Language } from "../types/i18n";
import type { ItemSearchEntry } from "../types/items";
import { buildItemIconUrl } from "../utils/itemIcon";
import { VentureHistorySummary } from "../types/ventureHistory";

type ExplorationRewardGroupProps = {
  title: string;
  itemIds: number[];
  itemsById: Map<number, ItemSearchEntry>;
  matchingItemIds: number[];
  itemsHistory?: VentureHistorySummary["itemsHistory"];
};

export function ExplorationRewardGroup({
  title,
  itemIds,
  itemsById,
  matchingItemIds,
  itemsHistory,
}: ExplorationRewardGroupProps) {
  const { t, i18n } = useTranslation();

  const language: Language = i18n.language === "fr" ? "fr" : "en";

  return (
    <section className="exploration-reward-group">
      <h3>{title}</h3>

      {itemIds.length > 0 ? (
        <ul className="exploration-reward-list">
          {itemIds.map((itemId) => {
            const item = itemsById.get(itemId);

            const isMatchingItem = matchingItemIds.includes(itemId);

            const itemStats = itemsHistory?.get(itemId);

            return (
              <li
                key={itemId}
                className={`exploration-reward-item ${isMatchingItem ? "exploration-reward-item--matching" : ""}`}
              >
                {item && (
                  <img
                    src={buildItemIconUrl(item.iconId)}
                    alt=""
                    width="28"
                    height="28"
                  />
                )}

                <div className="exploration-reward-item-content">
                  <span>
                    {item?.name[language] ??
                      t("explorationVenture.unknownItem", { id: itemId })}
                  </span>

                  {itemStats !== undefined && (
                    <span className="exploration-reward-item-stats">
                      {t("ventures.history.obtention", {
                        count: itemStats.occurrences,
                      })}
                      {" · "}
                      {t("ventures.history.total", {
                        count: itemStats.totalQuantity,
                      })}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>{t("explorationVenture.noKnownRewards")}</p>
      )}
    </section>
  );
}
