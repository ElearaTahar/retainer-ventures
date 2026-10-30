import { useTranslation } from "react-i18next";
import { useId } from "react";
import type { Language } from "../types/i18n";
import type { QuickVenture } from "../types/ventures";
import type { QuickRewards } from "../types/ventureRewards";
import type { ItemSearchEntry } from "../types/items";
import { ItemIconStack } from "./ItemIconStack";
import "../styles/venture-catalog-item.css";
import { buildItemIconUrl } from "../utils/itemIcon";
import { Info } from "lucide-react";

type QuickVentureCatalogItemProps = {
  venture: QuickVenture;
  rewards: QuickRewards;
  itemsById: Map<number, ItemSearchEntry>;
  isExpanded: boolean;
  onToggle: () => void;
};

export function QuickVentureCatalogItem({
  venture,
  rewards,
  itemsById,
  isExpanded,
  onToggle,
}: QuickVentureCatalogItemProps) {
  const { t, i18n } = useTranslation();
  const language: Language = i18n.language === "fr" ? "fr" : "en";

  const panelId = useId();

  const durationHours = venture.durationMinutes / 60;

  const itemIds = rewards.rewards.knownItems;

  const iconIds = itemIds
    .map((id) => itemsById.get(id)?.iconId)
    .filter((id): id is number => id !== undefined)
    .slice(0, 2);

  return (
    <div className="venture-catalog-item">
      <button
        type="button"
        className="venture-item-summary"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="venture-item-identity">
          {iconIds.length > 0 && <ItemIconStack iconIds={iconIds} />}

          <span className="venture-item-name">{venture.name[language]}</span>
        </span>

        <span className="venture-item-level">
          {t("abbreviatedLevel", { level: 10 })}
        </span>

        <span className="venture-item-cost">
          {t("ventureCost", { count: venture.ventureCost })}
        </span>

        <span className="venture-item-duration">
          {t("durationHours", { count: durationHours })}
        </span>

        <span
          className={`venture-item-chevron ${
            isExpanded ? "venture-item-chevron--expanded" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        hidden={!isExpanded}
        className="venture-item-details venture-item-details--quick"
      >
        <div className="quick-venture-rewards">
          <h3>{t("quickExplorationVenture.knownRewards")}</h3>

          <p className="exploration-community-notice">
            <Info size={16} aria-hidden="true" />
            <span>{t("quickExplorationVenture.communityRewardsNotice")}</span>
          </p>

          {itemIds.length > 0 ? (
            <ul className="quick-venture-reward-list">
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
        </div>
      </div>
    </div>
  );
}
