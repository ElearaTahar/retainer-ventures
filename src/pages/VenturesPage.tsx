import { useRef, useState } from "react";
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
import { ArrowRight, Dices, Search, SearchX, Sword } from "lucide-react";
import { MinerIcon } from "../components/icons/MinerIcon";
import { BotanistIcon } from "../components/icons/BotanistIcon";
import { FisherIcon } from "../components/icons/FisherIcon";

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
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    </div>
  );
}
