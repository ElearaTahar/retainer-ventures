import { useDeferredValue, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/ventures-page.css";
import "../styles/empty-state.css";
import type {
  ExplorationVenture,
  QuickVenture,
  RetainerType,
  TargetedVenture,
} from "../types/ventures";
import type { ItemSearchEntry } from "../types/items";
import type { VentureRewardsData } from "../types/ventureRewards";
import { toLanguage } from "../utils/i18n";
import { searchVentures } from "../utils/ventureSearch";
import { Check, PawPrint, Search } from "lucide-react";
import { FilterTabs } from "../components/FilterTabs";
import { VentureCatalogSection } from "../components/VentureCatalogSection";
import { VentureCatalogItem } from "../components/VentureCatalogItem";
import { useExpandedItems } from "../hooks/useExpandedItems";
import { QuickVentureCatalogItem } from "../components/QuickVentureCatalogItem";
import { RetainerBellIcon } from "../components/icons/RetainerBellIcon";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import { buildVenturesHistory } from "../types/ventureHistory";

type RetainerTypeFilter = RetainerType | "all";

const retainerTypes: RetainerTypeFilter[] = [
  "all",
  "combat",
  "miner",
  "botanist",
  "fisher",
];

type VentureCategoryFilter = "all" | "targeted" | "exploration" | "quick";

const ventureCategories: VentureCategoryFilter[] = [
  "all",
  "targeted",
  "exploration",
  "quick",
];

function hasMinionReward(
  venture: ExplorationVenture,
  rewards: VentureRewardsData,
): boolean {
  const entry =
    rewards.rewardsByRetainerTaskRandomId[venture.retainerTaskRandomId];

  return (entry?.minions.length ?? 0) > 0;
}

type VenturesPageProps = {
  targetedVentures: TargetedVenture[];
  explorationVentures: ExplorationVenture[];
  quickVenture: QuickVenture;
  itemsById: Map<number, ItemSearchEntry>;
  ventureRewards: VentureRewardsData;
};

export function VenturesPage({
  targetedVentures,
  explorationVentures,
  quickVenture,
  itemsById,
  ventureRewards,
}: VenturesPageProps) {
  const { t, i18n } = useTranslation();

  const language = toLanguage(i18n.language);

  const { isExpanded, toggleExpanded } = useExpandedItems();

  const [retainerType, setRetainerType] = useState<RetainerTypeFilter>("all");

  const [minionsOnly, setMinionsOnly] = useState(false);
  const deferredMinionOnly = useDeferredValue(minionsOnly);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const searchResults = searchVentures(
    deferredQuery,
    targetedVentures,
    explorationVentures,
    quickVenture,
    itemsById,
    ventureRewards,
    language,
  );

  const matchingItemsByVentureId = new Map<number, ItemSearchEntry[]>(
    searchResults.map((result) => [result.venture.id, result.matchingItems]),
  );

  const matchesSearch = (ventureId: number) =>
    deferredQuery.trim() === "" || matchingItemsByVentureId.has(ventureId);

  const retainerOptions = retainerTypes.map((rType) => ({
    value: rType,
    label: t(`retainerTypes.${rType}`),
  }));

  const retainerTypesForGroup = retainerTypes.filter((rType) => {
    if (retainerType === "all") {
      return rType !== "all";
    } else {
      return rType === retainerType;
    }
  });

  const [ventureCategory, setVentureCategory] =
    useState<VentureCategoryFilter>("all");

  const ventureOptions = ventureCategories.map((categ) => ({
    value: categ,
    label: t(`ventureCategories.${categ}`),
  }));

  const showQuick =
    (ventureCategory === "all" || ventureCategory === "quick") &&
    matchesSearch(quickVenture.id) &&
    !deferredMinionOnly;

  const sortedTargetedVentures = targetedVentures
    .filter(
      (venture) =>
        matchesSearch(venture.id) &&
        retainerTypesForGroup.includes(venture.retainerType),
    )
    .sort((a, b) => a.requiredLevel - b.requiredLevel);

  const showTargeted =
    (ventureCategory === "all" || ventureCategory === "targeted") &&
    !deferredMinionOnly &&
    sortedTargetedVentures.length > 0;

  const filteredExplorationVentures = explorationVentures.filter(
    (venture) =>
      (!deferredMinionOnly || hasMinionReward(venture, ventureRewards)) &&
      matchesSearch(venture.id) &&
      retainerTypesForGroup.includes(venture.retainerType),
  );

  const showExploration =
    (ventureCategory === "all" || ventureCategory === "exploration") &&
    filteredExplorationVentures.length > 0;

  const sortedExplorationVentures = [...filteredExplorationVentures].sort(
    (a, b) => a.requiredLevel - b.requiredLevel,
  );

  const resultCount =
    (showTargeted ? sortedTargetedVentures.length : 0) +
    (showExploration ? sortedExplorationVentures.length : 0) +
    (showQuick ? 1 : 0);

  const ventureRuns = useLiveQuery(() => db.ventureRuns.toArray());

  const venturesHistory = useMemo(
    () => buildVenturesHistory(ventureRuns ?? []),
    [ventureRuns],
  );

  return (
    <div className="page-layout ventures-page">
      <div className="ventures-intro">
        <h1>{t("ventures.title")}</h1>
        <p>{t("ventures.description")}</p>
      </div>

      <div className="ventures-section">
        <label htmlFor="searchInput" className="visually-hidden">
          {t("ventures.search.label")}
        </label>

        <div className="venture-search-field">
          <Search className="venture-search-icon" aria-hidden="true" />

          <input
            type="search"
            id="searchInput"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("ventures.search.placeholder")}
          />
        </div>
      </div>

      <section className="venture-filters">
        <div className="venture-filters-grid">
          <div>
            <h2 className="venture-filter-label">
              {t("ventureFilters.retainerType")}
            </h2>
            <FilterTabs
              optionsList={retainerOptions}
              selectedOption={retainerType}
              onChange={setRetainerType}
            />
          </div>

          <div>
            <h2 className="venture-filter-label">
              {t("ventureFilters.category")}
            </h2>
            <FilterTabs
              optionsList={ventureOptions}
              selectedOption={ventureCategory}
              onChange={setVentureCategory}
            />
          </div>

          <div>
            <h2 className="venture-filter-label">
              {t("ventureFilters.rewards")}
            </h2>
            <label className="venture-minion-filter">
              <input
                className="venture-minion-input"
                type="checkbox"
                name="minionsOnly"
                checked={minionsOnly}
                onChange={(event) => setMinionsOnly(event.target.checked)}
              />
              <PawPrint size={16} aria-hidden="true" />

              <span>{t("ventureFilters.hasMinion")}</span>

              <Check
                size={16}
                aria-hidden="true"
                className={
                  minionsOnly
                    ? "venture-minion-check"
                    : "venture-minion-check--hidden"
                }
              />
            </label>
          </div>
        </div>
      </section>

      {resultCount === 0 && (
        <div className="empty-state">
          <RetainerBellIcon className="app-logo" aria-hidden="true" />

          <div className="empty-state-text">
            <p className="empty-state-title">
              {t("ventures.search.noResults")}
            </p>
            <p>{t("ventures.search.noResultsHint")}</p>
          </div>
        </div>
      )}

      {resultCount > 0 && (
        <div className="venture-results-header">
          <h2>{t("ventures.resultsTitle")}</h2>

          <p className="venture-results-count">
            {deferredQuery.trim() !== ""
              ? t("ventures.search.resultsFor", { count: resultCount })
              : t("ventures.resultsCount", { count: resultCount })}
          </p>
        </div>
      )}

      {showTargeted && (
        <VentureCatalogSection
          title={t("targetedVenture.title")}
          description={t("targetedVenture.description")}
        >
          {retainerTypesForGroup.map((rType) => {
            const venturesGroup = sortedTargetedVentures.filter(
              (venture) => venture.retainerType === rType,
            );

            if (venturesGroup.length === 0) return null;

            return (
              <div key={rType} className="venture-retainer-group">
                <h4>{t(`retainerTypes.${rType}`)}</h4>

                <div className="venture-catalog-items">
                  {venturesGroup.map((venture) => (
                    <VentureCatalogItem
                      key={venture.id}
                      venture={venture}
                      matchingItems={matchingItemsByVentureId.get(venture.id)}
                      itemsById={itemsById}
                      ventureRewards={ventureRewards}
                      personalHistory={venturesHistory.get(venture.id)}
                      isExpanded={isExpanded(venture.id)}
                      onToggle={toggleExpanded}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </VentureCatalogSection>
      )}

      {showExploration && (
        <VentureCatalogSection
          title={t("explorationVenture.title")}
          description={t("explorationVenture.description")}
        >
          {retainerTypesForGroup.map((rType) => {
            const venturesGroup = sortedExplorationVentures.filter(
              (venture) => venture.retainerType === rType,
            );

            if (venturesGroup.length === 0) return null;

            return (
              <div key={rType} className="venture-retainer-group">
                <h4>{t(`retainerTypes.${rType}`)}</h4>

                <div className="venture-catalog-items">
                  {venturesGroup.map((venture) => (
                    <VentureCatalogItem
                      key={venture.id}
                      venture={venture}
                      matchingItems={matchingItemsByVentureId.get(venture.id)}
                      itemsById={itemsById}
                      ventureRewards={ventureRewards}
                      personalHistory={venturesHistory.get(venture.id)}
                      isExpanded={isExpanded(venture.id)}
                      onToggle={toggleExpanded}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </VentureCatalogSection>
      )}

      {showQuick && (
        <VentureCatalogSection
          title={t("quickExplorationVenture.title")}
          description={t("quickExplorationVenture.description")}
        >
          <div className="venture-catalog-items">
            <QuickVentureCatalogItem
              venture={quickVenture}
              matchingItems={matchingItemsByVentureId.get(quickVenture.id)}
              rewards={ventureRewards.quick}
              itemsById={itemsById}
              personalHistory={venturesHistory.get(quickVenture.id)}
              isExpanded={isExpanded(quickVenture.id)}
              onToggle={() => toggleExpanded(quickVenture.id)}
            />
          </div>
        </VentureCatalogSection>
      )}
    </div>
  );
}
