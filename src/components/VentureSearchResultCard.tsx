import { Link } from "react-router-dom";
import type { Language } from "../types/i18n";
import type { VentureSearchResult } from "../types/ventureSearch";
import {
  explorationCategoryI18nKey,
  formatDuration,
  TARGETED_MIN_DURATION_MINUTES,
} from "../utils/ventures";
import { useTranslation } from "react-i18next";
import { buildItemIconUrl } from "../utils/itemIcon";

type VentureSearchResultCardProps = {
  result: VentureSearchResult;
  language: Language;
};

export function VentureSearchResultCard({
  result,
  language,
}: VentureSearchResultCardProps) {
  const { t } = useTranslation();

  let title = "";

  if (result.venture.kind === "targeted") {
    const item = result.displayItems[0];

    if (item) {
      title = item.name[language];
    }
  } else {
    title = result.venture.name[language];
  }

  let retainerTypeName: string | null = null;

  if (
    result.venture.kind === "exploration" ||
    result.venture.kind === "targeted"
  ) {
    retainerTypeName = t(`retainerTypes.${result.venture.retainerType}`);
  }

  let categoryName: string | null = null;

  if (result.venture.kind === "targeted") {
    categoryName = t(`targetedVenture.categories.${result.venture.category}`);
  } else if (result.venture.kind === "exploration") {
    categoryName = t(
      `explorationVenture.categories.${explorationCategoryI18nKey[result.venture.category]}`,
    );
  }

  let minDurationMinutes: number;
  let maxDurationMinutes: number;

  if (result.venture.kind === "targeted") {
    minDurationMinutes = TARGETED_MIN_DURATION_MINUTES;
    maxDurationMinutes = result.venture.durationMinutes;
  } else {
    minDurationMinutes = result.venture.durationMinutes;
    maxDurationMinutes = result.venture.durationMinutes;
  }

  let durationLabel: string;

  if (minDurationMinutes === maxDurationMinutes) {
    durationLabel = formatDuration(minDurationMinutes);
  } else {
    durationLabel = `${minDurationMinutes}–${maxDurationMinutes} min`;
  }

  return (
    <Link className="venture-search-result" to={result.link}>
      <div className="venture-search-result-main">
        <div className="venture-search-result-identity">
          {result.displayItems.length === 1 && (
            <img
              className="venture-search-result-icon"
              src={buildItemIconUrl(result.displayItems[0].iconId)}
              alt=""
            />
          )}
          {result.displayItems.length === 2 && (
            <span className="venture-search-result-icon-stack">
              {result.displayItems.map((item) => {
                return (
                  <img
                    className="venture-search-result-icon"
                    key={item.id}
                    src={buildItemIconUrl(item.iconId)}
                    alt=""
                  />
                );
              })}
            </span>
          )}
          <span className="venture-search-result-title">{title}</span>
        </div>

        {retainerTypeName !== null && categoryName !== null && (
          <div className="venture-search-result-context">
            <span>{categoryName}</span>
            {" · "}
            <span>{retainerTypeName}</span>
          </div>
        )}

        {result.matchingItems.length > 0 &&
          result.venture.kind !== "targeted" && (
            <div className="venture-search-result-matches">
              {t("ventures.search.matchingRewards", {
                count: result.matchingItems.length,
              })}{" "}
              {result.matchingItems
                .map((item) => item.name[language])
                .join(", ")}
            </div>
          )}
      </div>

      <span className="venture-search-result-duration">{durationLabel}</span>
      <span className="venture-search-result-cost">
        {t("ventureCost", { count: result.venture.ventureCost })}
      </span>

      <span className="venture-search-result-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
