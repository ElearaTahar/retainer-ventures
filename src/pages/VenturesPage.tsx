import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/ventures-page.css";
import type {
  ExplorationVenture,
  QuickVenture,
  TargetedVenture,
} from "../types/ventures";
import type { ItemSearchEntry } from "../types/items";
import type { VentureRewardsData } from "../types/ventureRewards";
import { toLanguage } from "../utils/i18n";
import { searchVentures } from "../utils/ventureSearch";
import { VentureSearchResultCard } from "../components/VentureSearchResultCard";
import { NavigationSearchResultCard } from "../components/NavigationSearchResultCard";

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

  const [query, setQuery] = useState("");

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
    <div className="ventures-page">
      <h1>{t("navigation.ventures")}</h1>

      <section className="ventures-section">
        <h2>{t("ventures.browseVentures")}</h2>

        <nav
          className="venture-type-navigation"
          aria-label={t("ventures.types")}
        >
          <Link to="/ventures/combat">
            <span>{t("retainerTypes.combat")}</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link to="/ventures/miner">
            <span>{t("retainerTypes.miner")}</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link to="/ventures/botanist">
            <span>{t("retainerTypes.botanist")}</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link to="/ventures/fisher">
            <span>{t("retainerTypes.fisher")}</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            to="/ventures/quick-exploration"
            className="quick-venture-type-navigation"
          >
            <span className="quick-venture-type-navigation-content">
              <span>{t("quickExplorationVenture.title")}</span>
              <span className="quick-venture-type-navigation-subtitle">
                {t("quickExplorationVenture.description")}
              </span>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </section>

      <section className="ventures-section">
        <h2>{t("ventures.search.title")}</h2>

        <div className="venture-search-field">
          <label htmlFor="searchInput">{t("ventures.search.label")}</label>
          <input
            type="search"
            id="searchInput"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {hasSearchQuery && (
          <div className="venture-search-results">
            <h3>{t("ventures.search.resultsTitle")}</h3>

            {searchResults.length > 0 ? (
              <>
                <p>
                  {t("ventures.search.resultsFor", {
                    count: searchResults.length,
                    query: trimmedQuery,
                  })}
                </p>

                {navigationResults.length > 0 && (
                  <>
                    <h4>{t("ventures.search.navigation")}</h4>
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
                  </>
                )}

                {ventureResults.length > 0 && (
                  <>
                    <h4>{t("ventures.search.ventures")}</h4>
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
                          itemsById={itemsById}
                          language={language}
                        />
                      );
                    })}
                  </>
                )}
              </>
            ) : (
              <>
                <p>{t("ventures.search.noResults", { query: trimmedQuery })}</p>
                <p>{t("ventures.search.noResultsHint")}</p>

                <button type="button" onClick={() => setQuery("")}>
                  {t("ventures.search.clear")}
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
