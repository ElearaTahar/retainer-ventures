import { Link } from "react-router-dom";
import type { Language } from "../types/i18n";
import type { ItemSearchEntry } from "../types/items";
import type { VentureSearchResult } from "../types/ventureSearch";
import {
  explorationCategoryI18nKey,
  formatDuration,
  TARGETED_MIN_DURATION_MINUTES,
} from "../utils/ventures";
import { useTranslation } from "react-i18next";

type VentureSearchResultCardProps = {
  result: VentureSearchResult;
  itemsById: Map<number, ItemSearchEntry>;
  language: Language;
};

export function VentureSearchResultCard({
  result,
  itemsById,
  language,
}: VentureSearchResultCardProps) {
  const { t } = useTranslation();

  let title = "";

  if (result.venture.kind === "targeted") {
    const item = itemsById.get(result.venture.targetItemId);

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
      <span className="venture-search-result-title">{title}</span>

      {retainerTypeName !== null && categoryName !== null && (
        <div className="venture-search-result-context">
          <span>{retainerTypeName}</span>
          {" · "}
          <span>{categoryName}</span>
        </div>
      )}

      <div className="venture-search-result-details">
        <span>{durationLabel}</span>
        {" · "}
        <span>{t("ventureCost", { count: result.venture.ventureCost })}</span>
      </div>

      {result.matchingItems.length > 0 &&
        result.venture.kind !== "targeted" && (
          <ul className="venture-search-result-matches">
            {result.matchingItems.map((item) => (
              <li key={item.id}>{item.name[language]}</li>
            ))}
          </ul>
        )}
    </Link>
  );
}
