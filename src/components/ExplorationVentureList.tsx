import { useTranslation } from "react-i18next";
import type { Language } from "../types/i18n";
import type {
  ExplorationCategory,
  ExplorationVenture,
} from "../types/ventures";
import type { ItemSearchEntry } from "../types/items";
import type { VentureRewardsData } from "../types/ventureRewards";
import { ExplorationRewardGroup } from "./ExplorationRewardGroup";
import "../styles/targeted-venture-list.css";
import "../styles/exploration-venture-list.css";
import { useExpandedItems } from "../hooks/useExpandedItems";

const categoryTranslationKeys: Record<ExplorationCategory, string> = {
  "field-exploration": "explorationVenture.categories.field",
  "highland-exploration": "explorationVenture.categories.highland",
  "woodland-exploration": "explorationVenture.categories.woodland",
  "waterside-exploration": "explorationVenture.categories.waterside",
};

type ExplorationVentureListProps = {
  category: ExplorationCategory;
  ventures: ExplorationVenture[];
  ventureRewards: VentureRewardsData;
  itemsById: Map<number, ItemSearchEntry>;
};

export function ExplorationVentureList({
  category,
  ventures,
  ventureRewards,
  itemsById,
}: ExplorationVentureListProps) {
  const { t, i18n } = useTranslation();

  const language: Language = i18n.language === "fr" ? "fr" : "en";

  const numberFormatter = new Intl.NumberFormat(language);

  const { isExpanded, toggleExpanded } = useExpandedItems();

  const categoryVentures = ventures
    .filter((venture) => venture.category === category)
    .sort((a, b) => a.requiredLevel - b.requiredLevel);

  return (
    <>
      <h1>{t(categoryTranslationKeys[category])}</h1>

      <p>{t("explorationVenture.description")}</p>

      <p>
        {t("explorationVenture.durationSummary")} •{" "}
        {t("ventureCost", { count: 2 })}
      </p>

      <p>{t("explorationVenture.communityRewardsNotice")}</p>

      {categoryVentures.map((venture) => {
        const expanded = isExpanded(venture.id);
        const panelId = `exploration-venture-${venture.id}-details`;

        const rewards =
          ventureRewards.rewardsByRetainerTaskRandomId[
            String(venture.retainerTaskRandomId)
          ];

        return (
          <div className="venture" key={venture.id}>
            <button
              type="button"
              className="venture-summary exploration-venture-summary"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => {
                toggleExpanded(venture.id);
              }}
            >
              <span className="venture-name">{venture.name[language]}</span>

              <span className="venture-level">
                {t("level", { level: venture.requiredLevel })}
              </span>

              <span
                className={`venture-chevron ${
                  expanded ? "venture-chevron--expanded" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {expanded && (
              <div id={panelId} className="venture-details">
                <div className="exploration-details-grid">
                  <dl className="venture-properties">
                    <div>
                      <dt className="exploration-section-title">
                        {t("explorationVenture.details.requirement")}
                      </dt>
                      <dd>
                        {venture.requirement.type === "item-level"
                          ? t(
                              "explorationVenture.details.itemLevelRequirement",
                              {
                                value: venture.requirement.value,
                              },
                            )
                          : t(
                              "explorationVenture.details.gatheringRequirement",
                              {
                                value: venture.requirement.value,
                              },
                            )}
                      </dd>
                    </div>

                    <div>
                      <dt className="exploration-section-title">
                        {t("explorationVenture.details.experience")}
                      </dt>
                      <dd>{numberFormatter.format(venture.experience)}</dd>
                    </div>
                  </dl>

                  {rewards && (
                    <>
                      <ExplorationRewardGroup
                        title={t("explorationVenture.rewards.allaganPieces")}
                        itemIds={rewards.allaganPieces}
                        itemsById={itemsById}
                      />

                      <ExplorationRewardGroup
                        title={t(
                          `explorationVenture.rewards.jobItems.${venture.retainerType}`,
                        )}
                        itemIds={rewards.jobItems}
                        itemsById={itemsById}
                      />

                      <ExplorationRewardGroup
                        title={t("explorationVenture.rewards.minions")}
                        itemIds={rewards.minions}
                        itemsById={itemsById}
                      />

                      <ExplorationRewardGroup
                        title={t("explorationVenture.rewards.otherItems")}
                        itemIds={rewards.otherItems}
                        itemsById={itemsById}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
