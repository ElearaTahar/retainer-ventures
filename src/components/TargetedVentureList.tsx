import { useTranslation } from "react-i18next";
import type { Language } from "../types/i18n";
import type { ItemSearchEntry } from "../types/items";
import type { TargetedCategory, TargetedVenture } from "../types/ventures";
import { buildItemIconUrl } from "../utils/itemIcon";
import { useExpandedItems } from "../hooks/useExpandedItems";
import { useVentureHashNavigation } from "../hooks/useVentureHashNavigation";
import { Clock3 } from "lucide-react";
import "../styles/targeted-venture-list.css";

type TargetedVentureListProps = {
  category: TargetedCategory;
  ventures: TargetedVenture[];
  itemsById: Map<number, ItemSearchEntry>;
};

const durationSteps = [
  { levelOffset: 0, minutes: 60 },
  { levelOffset: 10, minutes: 50 },
  { levelOffset: 20, minutes: 40 },
];

export function TargetedVentureList({
  category,
  ventures,
  itemsById,
}: TargetedVentureListProps) {
  const { t, i18n } = useTranslation();

  const language: Language = i18n.language === "fr" ? "fr" : "en";

  const numberFormatter = new Intl.NumberFormat(language);

  const { expandedIds, isExpanded, toggleExpanded, expand } =
    useExpandedItems();

  useVentureHashNavigation({ expandedIds, expand });

  const categoryVentures = ventures
    .filter((venture) => venture.category === category)
    .sort((a, b) => a.requiredLevel - b.requiredLevel);

  const ventureToken = itemsById.get(21072);

  return (
    <div className="venture-list">
      <div className="venture-header">
        <h1>{t(`targetedVenture.categories.${category}`)}</h1>

        <p>{t("targetedVenture.description")}</p>

        <div className="targeted-venture-meta">
          <span>
            <Clock3 size={16} aria-hidden="true" />
            {t("targetedVenture.durationSummary")}
          </span>

          <span>
            {ventureToken && (
              <img src={buildItemIconUrl(ventureToken.iconId)} alt="" />
            )}
            {t("ventureCost", { count: 1 })}
          </span>
        </div>
      </div>

      <div className="targeted-venture-list">
        {categoryVentures.map((venture) => {
          const expanded = isExpanded(venture.id);
          const panelId = `venture-${venture.id}-details`;

          const yieldStatLabel = t(
            `targetedVenture.details.yieldStats.${venture.yieldStat}`,
          );
          const requirementIsYieldStat =
            venture.requirement.type === venture.yieldStat;

          const item = itemsById.get(venture.targetItemId);

          const yieldThresholds = requirementIsYieldStat
            ? [
                `${venture.requirement.value}+`,
                ...venture.thresholds.map((threshold) => `${threshold}+`),
              ]
            : [
                `< ${venture.thresholds[0]}`,
                ...venture.thresholds.map((threshold) => `${threshold}+`),
              ];

          return (
            <div
              id={`venture-${venture.id}`}
              className="venture"
              key={venture.id}
            >
              <button
                type="button"
                className="venture-summary"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => {
                  toggleExpanded(venture.id);
                }}
              >
                <span className="venture-item">
                  {item && (
                    <img
                      className="venture-icon"
                      src={buildItemIconUrl(item.iconId)}
                      alt=""
                    />
                  )}
                  <span className="venture-name">
                    {item?.name[language] ??
                      t("targetedVenture.details.unknownItem", {
                        id: venture.targetItemId,
                      })}
                  </span>
                </span>

                <span className="venture-level">
                  {t("level", { level: venture.requiredLevel })}
                </span>

                <span
                  className={`venture-chevron ${expanded ? "venture-chevron--expanded" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {expanded && (
                <div id={panelId} className="venture-details">
                  <dl className="venture-properties">
                    <div>
                      <dt>{t("targetedVenture.details.experience")}</dt>
                      <dd>{numberFormatter.format(venture.experience)}</dd>
                    </div>
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
