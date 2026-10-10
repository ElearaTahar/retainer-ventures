import { Link } from "react-router-dom";
import type { NavigationSearchResult } from "../types/ventureSearch";
import { formatDuration } from "../utils/ventures";
import { useTranslation } from "react-i18next";
import { Clock3, Sword } from "lucide-react";
import { MinerIcon } from "./icons/MinerIcon";
import { BotanistIcon } from "./icons/BotanistIcon";
import { FisherIcon } from "./icons/FisherIcon";

function RetainerTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "combat":
      return <Sword className="venture-type-navigation-icon" />;
    case "miner":
      return <MinerIcon className="venture-type-navigation-icon" />;
    case "botanist":
      return <BotanistIcon className="venture-type-navigation-icon" />;
    case "fisher":
      return <FisherIcon className="venture-type-navigation-icon" />;
    default:
      return null;
  }
}

type NavigationSearchResultCardProps = {
  result: NavigationSearchResult;
};

export function NavigationSearchResultCard({
  result,
}: NavigationSearchResultCardProps) {
  const { t } = useTranslation();

  let durationLabel: string | null = null;
  let ventureCost: number | null = null;

  if (result.details.kind === "targeted-category") {
    durationLabel = `${result.details.durationMinutes.min}–${result.details.durationMinutes.max} min`;
    ventureCost = result.details.ventureCost;
  } else if (result.details.kind === "exploration-category") {
    durationLabel = formatDuration(result.details.durationMinutes);
    ventureCost = result.details.ventureCost;
  }

  return (
    <Link
      className={`venture-search-result ${result.details.kind === "retainer-type" ? "venture-search-navigation-result" : ""}`}
      to={result.link}
    >
      <div className="venture-search-result-main">
        {result.details.kind === "retainer-type" && (
          <RetainerTypeIcon type={result.retainerType} />
        )}

        <div className="venture-search-result-details">
          <span className="venture-search-result-title">
            {t(result.titleTranslationKey)}
          </span>

          {(result.details.kind === "exploration-category" ||
            result.details.kind === "targeted-category") && (
            <span className="venture-search-result-context">
              {t(`retainerTypes.${result.retainerType}`)}
            </span>
          )}
        </div>
      </div>

      {durationLabel !== null && ventureCost !== null && (
        <div className="venture-search-result-meta">
          <span className="venture-search-result-duration">
            <Clock3 aria-hidden="true" size={14} />
            {durationLabel}
          </span>
          <span className="venture-search-result-cost">
            {t("ventureCost", {
              count: ventureCost,
            })}
          </span>
        </div>
      )}

      <span className="venture-search-result-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
