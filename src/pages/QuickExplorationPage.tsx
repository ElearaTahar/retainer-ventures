import { useTranslation } from "react-i18next";
import { Clock3, Info } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import type { QuickVenture } from "../types/ventures";
import type { Language } from "../types/i18n";
import type { QuickRewards } from "../types/ventureRewards";
import type { ItemSearchEntry } from "../types/items";
import { buildItemIconUrl } from "../utils/itemIcon";
import "../styles/quick-exploration-page.css";

type QuickExplorationPageProps = {
  venture: QuickVenture;
  rewards: QuickRewards;
  itemsById: Map<number, ItemSearchEntry>;
};

export function QuickExplorationPage({
  venture,
  rewards,
  itemsById,
}: QuickExplorationPageProps) {
  const { t, i18n } = useTranslation();

  const language: Language = i18n.language === "fr" ? "fr" : "en";

  const durationHours = venture.durationMinutes / 60;

  const itemIds = rewards.rewards.knownItems;

  const ventureToken = itemsById.get(21072);

  return (
    <div className="page-layout quick-exploration-page">
      <Breadcrumb
        items={[
          {
            label: t("navigation.ventures"),
            to: "/ventures",
          },
          {
            label: venture.name[language],
          },
        ]}
      />

      <div className="venture-list">
        <div className="venture-header">
          <h1>{venture.name[language]}</h1>

          <p>{t("quickExplorationVenture.description")}</p>

          <div className="targeted-venture-meta">
            <span>
              <Clock3 size={16} aria-hidden="true" />
              {t("durationHours", { count: durationHours })}
            </span>

            <span>
              {ventureToken && (
                <img src={buildItemIconUrl(ventureToken.iconId)} alt="" />
              )}
              {t("ventureCost", { count: venture.ventureCost })}
            </span>
          </div>

          <p className="exploration-community-notice">
            <Info size={16} aria-hidden="true" />
            <span>{t("quickExplorationVenture.communityRewardsNotice")}</span>
          </p>
        </div>

        <section className="quick-exploration-rewards">
          <h2>{t("quickExplorationVenture.knownRewards")}</h2>

          {itemIds.length > 0 ? (
            <ul className="quick-exploration-reward-list">
              {itemIds.map((itemId) => {
                const item = itemsById.get(itemId);

                return (
                  <li key={itemId}>
                    {item && (
                      <img
                        src={buildItemIconUrl(item.iconId)}
                        alt=""
                        width="28"
                        height="28"
                      />
                    )}

                    <span>
                      {item?.name[language] ??
                        t("quickExplorationVenture.unknownItem", {
                          id: itemId,
                        })}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>{t("quickExplorationVenture.noKnownRewards")}</p>
          )}
        </section>
      </div>
    </div>
  );
}
