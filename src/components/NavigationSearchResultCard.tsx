import { Link } from "react-router-dom";
import type { NavigationSearchResult } from "../types/ventureSearch";
import { formatDuration } from "../utils/ventures";
import { useTranslation } from "react-i18next";

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

      {durationLabel !== null && ventureCost !== null && (
        <>
          <span className="venture-search-result-duration">
            {durationLabel}
          </span>
          <span className="venture-search-result-cost">
            {t("ventureCost", {
              count: ventureCost,
            })}
          </span>
        </>
      )}

      <span className="venture-search-result-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
