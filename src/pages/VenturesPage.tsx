import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/ventures-page.css";
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
import { VentureSearchResultCard } from "../components/VentureSearchResultCard";
import { NavigationSearchResultCard } from "../components/NavigationSearchResultCard";
import {
  ArrowRight,
  Check,
  Dices,
  PawPrint,
  Search,
  SearchX,
  Sword,
} from "lucide-react";
import { MinerIcon } from "../components/icons/MinerIcon";
import { BotanistIcon } from "../components/icons/BotanistIcon";
import { FisherIcon } from "../components/icons/FisherIcon";
import { FilterTabs } from "../components/FilterTabs";
import { VentureCatalogSection } from "../components/VentureCatalogSection";
import { VentureCatalogItem } from "../components/VentureCatalogItem";
import { useExpandedItems } from "../hooks/useExpandedItems";
import { QuickVentureCatalogItem } from "../components/QuickVentureCatalogItem";

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

  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const retainerOptions = retainerTypes.map((rType) => ({
    value: rType,
    label: t(`retainerTypes.${rType}`),
  }));

  const [ventureCategory, setVentureCategory] =
    useState<VentureCategoryFilter>("all");

  const ventureOptions = ventureCategories.map((categ) => ({
    value: categ,
    label: t(`ventureCategories.${categ}`),
  }));

  const showTargeted =
    (ventureCategory === "all" || ventureCategory === "targeted") &&
    !minionsOnly;

  const showExploration =
    ventureCategory === "all" || ventureCategory === "exploration";

  const showQuick = ventureCategory === "all" || ventureCategory === "quick";

  const sortedTargetedVentures = [...targetedVentures].sort(
    (a, b) => a.requiredLevel - b.requiredLevel,
  );

  const filteredExplorationVentures = explorationVentures.filter(
    (venture) => !minionsOnly || hasMinionReward(venture, ventureRewards),
  );

  const sortedExplorationVentures = [...filteredExplorationVentures].sort(
    (a, b) => a.requiredLevel - b.requiredLevel,
  );

  const retainerTypesForGroup = retainerTypes.filter((rType) => {
    if (retainerType === "all") {
      return rType !== "all";
    } else {
      return rType === retainerType;
    }
  });

  const searchResults = searchVentures(
    query,
    targetedVentures,
    explorationVentures,
    quickVenture,
    itemsById,
    ventureRewards,
    t,
    language,
  );

  const trimmedQuery = query.trim();
  const hasSearchQuery = trimmedQuery !== "";

  const navigationResults = searchResults.filter(
    (result) => result.kind === "navigation",
  );
  const ventureResults = searchResults.filter(
    (result) => result.kind === "venture",
  );

  return (
    <div className="page-layout ventures-page">
      <h1 className="visually-hidden">{t("navigation.ventures")}</h1>

      <section className="ventures-section">
        <h2>{t("ventures.browseVentures")}</h2>

        <nav
          className="venture-type-navigation"
          aria-label={t("ventures.types")}
        >
          <Link to="/ventures/combat">
            <span className="venture-type-navigation-identity">
              <Sword className="venture-type-navigation-icon" />
              {t("retainerTypes.combat")}
            </span>
            <ArrowRight
              className="venture-type-navigation-arrow"
              size={18}
              aria-hidden="true"
            />
          </Link>
          <Link to="/ventures/miner">
            <span className="venture-type-navigation-identity">
              <MinerIcon className="venture-type-navigation-icon" />
              {t("retainerTypes.miner")}
            </span>
            <ArrowRight
              className="venture-type-navigation-arrow"
              size={18}
              aria-hidden="true"
            />
          </Link>
          <Link to="/ventures/botanist">
            <span className="venture-type-navigation-identity">
              <BotanistIcon className="venture-type-navigation-icon" />
              {t("retainerTypes.botanist")}
            </span>
            <ArrowRight
              className="venture-type-navigation-arrow"
              size={18}
              aria-hidden="true"
            />
          </Link>
          <Link to="/ventures/fisher">
            <span className="venture-type-navigation-identity">
              <FisherIcon className="venture-type-navigation-icon" />
              {t("retainerTypes.fisher")}
            </span>
            <ArrowRight
              className="venture-type-navigation-arrow"
              size={18}
              aria-hidden="true"
            />
          </Link>
          <Link
            to="/ventures/quick-exploration"
            className="quick-venture-type-navigation"
          >
            <span className="quick-venture-type-navigation-content">
              <span className="quick-venture-type-navigation-heading">
                <Dices className="venture-type-navigation-icon" />
                <span>{t("quickExplorationVenture.title")}</span>
              </span>
              <span className="quick-venture-type-navigation-subtitle">
                {t("quickExplorationVenture.description")}
              </span>
            </span>
            <ArrowRight
              className="venture-type-navigation-arrow"
              size={18}
              aria-hidden="true"
            />
          </Link>
        </nav>
      </section>

      <section className="ventures-section">
        <h2>{t("ventures.search.title")}</h2>
        <label htmlFor="searchInput">{t("ventures.search.label")}</label>

        <div className="venture-search-field">
          <Search className="venture-search-icon" aria-hidden="true" />

          <input
            ref={searchInputRef}
            type="search"
            id="searchInput"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("ventures.search.placeholder")}
          />
        </div>

        {hasSearchQuery && (
          <div className="venture-search-results">
            <div className="venture-search-results-heading">
              {searchResults.length > 0 && (
                <p>
                  {t("ventures.search.resultsFor", {
                    count: searchResults.length,
                    query: trimmedQuery,
                  })}
                </p>
              )}
            </div>

            {searchResults.length > 0 ? (
              <>
                {navigationResults.length > 0 && (
                  <div className="venture-search-result-group">
                    <h3>{t("ventures.search.navigation")}</h3>

                    <div className="venture-search-list">
                      <div className="venture-search-columns">
                        <span>{t("ventures.search.destinationColumn")}</span>
                        <span>{t("ventures.search.durationColumn")}</span>
                        <span>{t("ventures.search.costColumn")}</span>
                        <span aria-hidden="true" />
                      </div>
                      {navigationResults.map((result) => {
                        return (
                          <NavigationSearchResultCard
                            key={`navigation:${result.link}`}
                            result={result}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {ventureResults.length > 0 && (
                  <div className="venture-search-result-group">
                    <h3>{t("ventures.search.ventures")}</h3>

                    <div className="venture-search-list">
                      <div className="venture-search-columns">
                        <span>{t("ventures.search.ventureColumn")}</span>
                        <span>{t("ventures.search.durationColumn")}</span>
                        <span>{t("ventures.search.costColumn")}</span>
                        <span aria-hidden="true" />
                      </div>
                      {ventureResults.map((result) => {
                        return (
                          <VentureSearchResultCard
                            key={`venture:${result.venture.id}`}
                            result={result}
                            language={language}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state" role="status">
                <SearchX size={32} aria-hidden="true" />

                <div className="empty-state-text">
                  <p className="empty-state-title">
                    {t("ventures.search.noResults", { query: trimmedQuery })}
                  </p>
                  <p>{t("ventures.search.noResultsHint")}</p>
                </div>

                <button
                  type="button"
                  className="btn btn-subtle"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                >
                  {t("ventures.search.clear")}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="venture-filters">
        <div className="venture-filters-grid">
          <div className="venture-filter-group">
            <h2 className="venture-filter-label">
              {t("ventureFilters.retainerType")}
            </h2>
            <FilterTabs
              optionsList={retainerOptions}
              selectedOption={retainerType}
              onChange={setRetainerType}
            />
          </div>

          <div className="venture-filter-group">
            <h2 className="venture-filter-label">
              {t("ventureFilters.category")}
            </h2>
            <FilterTabs
              optionsList={ventureOptions}
              selectedOption={ventureCategory}
              onChange={setVentureCategory}
            />
          </div>
        </div>

        <div className="venture-filter-group">
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

            {minionsOnly && <Check size={16} aria-hidden="true" />}
          </label>
        </div>
      </section>

      {showTargeted && (
        <VentureCatalogSection
          title={t("targetedVenture.title")}
          description={t("targetedVenture.description")}
        >
          {retainerTypesForGroup.map((rType) => {
            const venturesGroup = sortedTargetedVentures.filter(
              (venture) => venture.retainerType === rType,
            );

            return (
              <div key={rType}>
                <h3>{t(`retainerTypes.${rType}`)}</h3>

                <div className="venture-catalog-items">
                  {venturesGroup.map((venture) => (
                    <VentureCatalogItem
                      key={venture.id}
                      venture={venture}
                      itemsById={itemsById}
                      ventureRewards={ventureRewards}
                      isExpanded={isExpanded(venture.id)}
                      onToggle={() => toggleExpanded(venture.id)}
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

            return (
              <div key={rType}>
                <h3>{t(`retainerTypes.${rType}`)}</h3>

                <div className="venture-catalog-items">
                  {venturesGroup.map((venture) => (
                    <VentureCatalogItem
                      key={venture.id}
                      venture={venture}
                      itemsById={itemsById}
                      ventureRewards={ventureRewards}
                      isExpanded={isExpanded(venture.id)}
                      onToggle={() => toggleExpanded(venture.id)}
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
              rewards={ventureRewards.quick}
              itemsById={itemsById}
              isExpanded={isExpanded(quickVenture.id)}
              onToggle={() => toggleExpanded(quickVenture.id)}
            />
          </div>
        </VentureCatalogSection>
      )}
    </div>
  );
}
