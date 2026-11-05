import { useTranslation } from "react-i18next";
import type { VentureHistorySummary } from "../types/ventureHistory";
import { Retainer } from "../types/retainers";
import { ItemSearchEntry } from "../types/items";
import { ItemIconStack } from "./ItemIconStack";
import "../styles/venture-personal-history.css";

type VenturePersonalHistoryProps = {
  ventureType: "targeted" | "exploration" | "quick";
  personalHistory?: VentureHistorySummary;
  retainers: Map<number, Retainer>;
  itemsById: Map<number, ItemSearchEntry>;
  rewardItemIds?: number[];
};

export function VenturePersonalHistory({
  ventureType,
  personalHistory,
  retainers,
  itemsById,
  rewardItemIds,
}: VenturePersonalHistoryProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language === "fr" ? "fr" : "en";

  const runsByRetainer = Array.from(
    personalHistory?.byRetainer.entries() ?? [],
  );

  const itemsHistory = Array.from(
    personalHistory?.itemsHistory.entries() ?? [],
  );

  const unknownRewards = (() => {
    if (ventureType !== "exploration" || !personalHistory) {
      return [];
    }

    const knownItemIds = new Set(rewardItemIds);

    return itemsHistory.filter(([itemId]) => !knownItemIds.has(itemId));
  })();

  const totalItems = Array.from(
    personalHistory?.itemsHistory.values() ?? [],
  ).reduce((total, itemStats) => total + itemStats.totalQuantity, 0);

  const displayedRewards =
    ventureType === "quick" ? itemsHistory : unknownRewards;

  return (
    <section className="venture-personal-history">
      <div className="venture-personal-history-content">
        <h4>{t("ventures.history.title")}</h4>

        <div className="venture-personal-history-body">
          {personalHistory === undefined ? (
            <p className="venture-history-total-items">
              {t("ventures.history.noResult")}
            </p>
          ) : (
            <>
              <p className="venture-history-summary">
                <span className="venture-history-run-count">
                  {t("ventures.history.totalRuns", {
                    count: personalHistory.total,
                  })}
                </span>

                {ventureType === "targeted" && (
                  <span className="venture-history-total-items">
                    {" · "}
                    {t("ventures.history.totalRewards", {
                      count: totalItems,
                    })}
                  </span>
                )}
              </p>

              <div className="venture-history-retainers">
                {runsByRetainer.map(([retainerId, count]) => (
                  <span key={retainerId} className="venture-history-retainer">
                    {retainers.get(retainerId)?.name ??
                      t("ventureRuns.unknownRetainer")}
                    {" : "}
                    {t("ventures.history.totalRuns", { count })}
                  </span>
                ))}
              </div>

              {displayedRewards.length > 0 && (
                <div className="venture-history-rewards-section">
                  <h5>
                    {t(
                      ventureType === "quick"
                        ? "ventures.history.rewardsTitle"
                        : "ventures.history.otherRewardsTitle",
                    )}
                  </h5>
                  <ul className="venture-history-rewards">
                    {displayedRewards.map(([id, rewardStats]) => {
                      const reward = itemsById.get(id);
                      const rewardName =
                        reward?.name[language] ??
                        t("explorationVenture.unknownItem", { id });

                      return (
                        <li key={id}>
                          {reward?.iconId !== undefined && (
                            <ItemIconStack iconIds={[reward.iconId]} />
                          )}
                          <div className="venture-history-reward-content">
                            <span>{rewardName}</span>
                            <span className="venture-history-reward-stats">
                              {t("ventures.history.obtention", {
                                count: rewardStats.occurrences,
                              })}
                              {" · "}
                              {t("ventures.history.total", {
                                count: rewardStats.totalQuantity,
                              })}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <button className="btn btn-subtle" type="button" disabled={true}>
        {t("myRetainers.recordRunButton")}
      </button>
    </section>
  );
}
