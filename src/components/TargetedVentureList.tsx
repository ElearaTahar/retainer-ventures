import { useState } from "react";
import type { ItemSearchEntry } from "../types/items";
import type {
  TargetedCategory,
  TargetedVenture,
  YieldStat,
} from "../types/ventures";
import { buildItemIconUrl } from "../utils/itemIcon";
import "../styles/targeted-venture-list.css";

type TargetedVentureListProps = {
  category: TargetedCategory;
  ventures: TargetedVenture[];
  itemsById: Map<number, ItemSearchEntry>;
};

const categoryLabels: Record<TargetedCategory, string> = {
  hunting: "Hunting",
  mining: "Mining",
  botany: "Botany",
  fishing: "Fishing",
};

const yieldStatLabels: Record<YieldStat, string> = {
  "item-level": "Retainer iLvl",
  perception: "Perception",
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
  const [expandedVentureId, setExpandedVentureId] = useState<number | null>(
    null,
  );

  const categoryVentures = ventures
    .filter((venture) => venture.category === category)
    .sort((a, b) => a.requiredLevel - b.requiredLevel);

  const categoryLabel = categoryLabels[category];

  return (
    <>
      <h1>{categoryLabel} ventures</h1>

      <p>Short ventures targeting specific items</p>

      <p>40 min to 60 min depending on the retainer level • 1 venture</p>

      {categoryVentures.map((venture) => {
        const isExpanded = expandedVentureId === venture.id;
        const panelId = `venture-${venture.id}-details`;

        const yieldStatLabel = yieldStatLabels[venture.yieldStat];
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
          <div className="venture" key={venture.id}>
            <button
              type="button"
              className="venture-summary"
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={() => {
                setExpandedVentureId(isExpanded ? null : venture.id);
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
                  {item?.name.en ?? `Unknown item #${venture.targetItemId}`}
                </span>
              </span>

              <span className="venture-level">{`Level ${venture.requiredLevel}`}</span>

              <span
                className={`venture-chevron ${isExpanded ? "venture-chevron--expanded" : ""}`}
                aria-hidden="true"
              />
            </button>

            {isExpanded && (
              <div id={panelId} className="venture-details">
                <dl className="venture-properties">
                  <div>
                    <dt>Experience</dt>
                    <dd>{venture.experience}</dd>
                  </div>
                  {!requirementIsYieldStat && (
                    <div>
                      <dt>Requirement</dt>
                      <dd>Gathering {venture.requirement.value}</dd>
                    </div>
                  )}
                </dl>

                <div className="venture-duration">
                  <p>Duration</p>

                  <dl>
                    {durationSteps.map((step) => (
                      <div key={step.levelOffset}>
                        <dt>Lv. {venture.requiredLevel + step.levelOffset}</dt>
                        <span aria-hidden="true">→</span>
                        <dd>{step.minutes}m</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="venture-yields-wrapper">
                  <table className="venture-yields">
                    <caption>Possible quantities</caption>
                    <tbody>
                      <tr>
                        <th scope="row">{yieldStatLabel}</th>

                        {yieldThresholds.map((threshold, index) => (
                          <td key={index}>{threshold}</td>
                        ))}
                      </tr>
                      <tr>
                        <th scope="row">Quantity</th>

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
    </>
  );
}
