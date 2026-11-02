import { useTranslation } from "react-i18next";
import { memo, useEffect, useId, useState } from "react";
import { ExplorationRewardGroup } from "./ExplorationRewardGroup";
import type { ItemSearchEntry } from "../types/items";
import type { ExplorationVenture, TargetedVenture } from "../types/ventures";
import { ItemIconStack } from "./ItemIconStack";
import type { VentureRewardsData } from "../types/ventureRewards";
import "../styles/venture-catalog-item.css";

const durationSteps = [
  { levelOffset: 0, minutes: 60 },
  { levelOffset: 10, minutes: 50 },
  { levelOffset: 20, minutes: 40 },
];

const supportsInterpolateSize = CSS.supports(
  "interpolate-size",
  "allow-keywords",
);

type VentureCatalogItemProps = {
  venture: TargetedVenture | ExplorationVenture;
  matchingItems?: ItemSearchEntry[];
  itemsById: Map<number, ItemSearchEntry>;
  ventureRewards: VentureRewardsData;
  isExpanded: boolean;
  onToggle: (id: number) => void;
};

export const VentureCatalogItem = memo(function VentureCatalogItem({
  venture,
  matchingItems,
  itemsById,
  ventureRewards,
  isExpanded,
  onToggle,
}: VentureCatalogItemProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language === "fr" ? "fr" : "en";
  const numberFormatter = new Intl.NumberFormat(language);

  const [isVisible, setIsVisible] = useState(isExpanded);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const shouldSkipAnimation = prefersReducedMotion || !supportsInterpolateSize;

  useEffect(() => {
    if (isExpanded) {
      setIsVisible(true);
    } else if (shouldSkipAnimation) {
      setIsVisible(false);
    }
  }, [isExpanded, shouldSkipAnimation]);

  const isTargetedVenture = "targetItemId" in venture;

  const requirementIsYieldStat =
    isTargetedVenture && venture.requirement.type === venture.yieldStat;

  const yieldStatLabel = isTargetedVenture
    ? t(`targetedVenture.details.yieldStats.${venture.yieldStat}`)
    : undefined;

  const yieldThresholds = isTargetedVenture
    ? requirementIsYieldStat
      ? [
          `${venture.requirement.value}+`,
          ...venture.thresholds.map((threshold) => `${threshold}+`),
        ]
      : [
          `< ${venture.thresholds[0]}`,
          ...venture.thresholds.map((threshold) => `${threshold}+`),
        ]
    : [];

  const item = isTargetedVenture
    ? itemsById.get(venture.targetItemId)
    : undefined;

  const ventureName =
    "name" in venture
      ? venture.name[language]
      : item !== undefined
        ? item.name[language]
        : t("targetedVenture.details.unknownItem", {
            id: venture.targetItemId,
          });

  const rewards = isTargetedVenture
    ? undefined
    : ventureRewards.rewardsByRetainerTaskRandomId[
        String(venture.retainerTaskRandomId)
      ];

  const rewardItemIds = rewards
    ? [
        ...rewards.allaganPieces,
        ...rewards.jobItems,
        ...rewards.minions,
        ...rewards.otherItems,
      ]
    : [];

  const iconIds =
    item !== undefined
      ? [item.iconId]
      : rewardItemIds
          .map((id) => itemsById.get(id)?.iconId)
          .filter((id): id is number => id !== undefined)
          .slice(0, 2);

  const matchingItemsNames =
    matchingItems?.map((item) => item.name[language]).join(", ") ?? "";

  const matchingItemIds = matchingItems?.map((item) => item.id) ?? [];

  const panelId = useId();

  return (
    <div className="venture-catalog-item">
      <button
        type="button"
        className="venture-item-summary"
        aria-expanded={isExpanded}
        onClick={() => onToggle(venture.id)}
      >
        <span className="venture-item-identity">
          {iconIds.length > 0 && <ItemIconStack iconIds={iconIds} />}

          <span className="venture-item-name">{ventureName}</span>
        </span>

        <span className="venture-item-level">
          {t("abbreviatedLevel", { level: venture.requiredLevel })}
        </span>

        <span className="venture-item-cost">
          {t("ventureCost", { count: venture.ventureCost })}
        </span>

        <span className="venture-item-duration">
          {isTargetedVenture
            ? t("targetedVenture.durationSummary")
            : t("explorationVenture.durationSummary")}
        </span>

        <span
          className={`venture-item-chevron ${isExpanded ? "venture-item-chevron--expanded" : ""}`}
          aria-hidden="true"
        />

        {matchingItems !== undefined &&
          matchingItems.length > 0 &&
          !isTargetedVenture && (
            <span className="venture-item-matching-rewards">
              {t("ventures.search.matchingRewards", {
                count: matchingItems.length,
              }) +
                " " +
                matchingItemsNames}
            </span>
          )}
      </button>

      {isVisible && (
        <div
          id={panelId}
          className={`venture-item-details ${!isTargetedVenture ? "venture-item-details--exploration" : ""} ${isExpanded ? "" : "venture-item-details--closing"}`}
          onAnimationEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.animationName === "venture-details-collapse" &&
              !isExpanded
            ) {
              setIsVisible(false);
            }
          }}
        >
          {isTargetedVenture ? (
            <>
              <dl className="venture-properties">
                {!requirementIsYieldStat && (
                  <div>
                    <dt>{t("targetedVenture.details.requirement")}</dt>
                    <dd>
                      {t("targetedVenture.details.gathering", {
                        value: venture.requirement.value,
                      })}
                    </dd>
                  </div>
                )}

                <div>
                  <dt>{t("targetedVenture.details.experience")}</dt>
                  <dd>{numberFormatter.format(venture.experience)}</dd>
                </div>
              </dl>

              <div className="venture-duration">
                <p>{t("targetedVenture.details.duration")}</p>

                <dl>
                  {durationSteps.map((step) => (
                    <div key={step.levelOffset}>
                      <dt>
                        {t("abbreviatedLevel", {
                          level: venture.requiredLevel + step.levelOffset,
                        })}
                      </dt>
                      <span aria-hidden="true">→</span>
                      <dd>
                        {t("targetedVenture.details.minutesShort", {
                          minutes: step.minutes,
                        })}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="venture-yields-wrapper">
                <table className="venture-yields">
                  <caption>
                    {t("targetedVenture.details.possibleQuantities")}
                  </caption>
                  <tbody>
                    <tr>
                      <th scope="row">{yieldStatLabel}</th>

                      {yieldThresholds.map((threshold, index) => (
                        <td key={index}>{threshold}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">
                        {t("targetedVenture.details.quantity")}
                      </th>

                      {venture.quantities.map((quantity, index) => (
                        <td key={index}>{quantity}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <dl className="venture-properties">
                <div>
                  <dt>{t("explorationVenture.details.requirement")}</dt>
                  <dd>
                    {venture.requirement.type === "item-level"
                      ? t("explorationVenture.details.itemLevelRequirement", {
                          value: venture.requirement.value,
                        })
                      : t("explorationVenture.details.gatheringRequirement", {
                          value: venture.requirement.value,
                        })}
                  </dd>
                </div>

                <div>
                  <dt>{t("explorationVenture.details.experience")}</dt>
                  <dd>{numberFormatter.format(venture.experience)}</dd>
                </div>
              </dl>

              {rewards && (
                <div className="exploration-rewards">
                  <ExplorationRewardGroup
                    title={t("explorationVenture.rewards.allaganPieces")}
                    itemIds={rewards.allaganPieces}
                    itemsById={itemsById}
                    matchingItemIds={matchingItemIds}
                  />

                  <ExplorationRewardGroup
                    title={t(
                      `explorationVenture.rewards.jobItems.${venture.retainerType}`,
                    )}
                    itemIds={rewards.jobItems}
                    itemsById={itemsById}
                    matchingItemIds={matchingItemIds}
                  />

                  <ExplorationRewardGroup
                    title={t("explorationVenture.rewards.minions")}
                    itemIds={rewards.minions}
                    itemsById={itemsById}
                    matchingItemIds={matchingItemIds}
                  />

                  <ExplorationRewardGroup
                    title={t("explorationVenture.rewards.otherItems")}
                    itemIds={rewards.otherItems}
                    itemsById={itemsById}
                    matchingItemIds={matchingItemIds}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});
