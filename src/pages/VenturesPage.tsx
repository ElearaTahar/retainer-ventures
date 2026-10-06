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

  return (
    <>
      <h1>{t("navigation.ventures")}</h1>
      <p>{t("ventures.browseVentures")}</p>

      <label htmlFor="searchInput">{t("ventures.search.label")}</label>
      <input
        type="search"
        id="searchInput"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="venture-search-results">
        {searchResults.map((result) => {
          if (result.kind === "navigation") {
            return (
              <Link
                className="venture-search-result"
                to={result.link}
                key={`navigation:${result.link}`}
              >
                <span className="venture-search-result-title">
                  {t(result.titleTranslationKey)}
                </span>
              </Link>
            );
          } else {
            return (
              <VentureSearchResultCard
                key={`venture:${result.venture.id}`}
                result={result}
                itemsById={itemsById}
                language={language}
              />
            );
          }
        })}
      </div>

      <nav className="venture-type-navigation" aria-label={t("ventures.types")}>
        <Link to="/ventures/combat">{t("retainerTypes.combat")}</Link>
        <Link to="/ventures/miner">{t("retainerTypes.miner")}</Link>
        <Link to="/ventures/botanist">{t("retainerTypes.botanist")}</Link>
        <Link to="/ventures/fisher">{t("retainerTypes.fisher")}</Link>
        <Link
          to="/ventures/quick-exploration"
          className="quick-venture-type-navigation"
        >
          <span>{t("quickExplorationVenture.title")}</span>
          <span className="quick-venture-type-navigation-subtitle">
            {t("quickExplorationVenture.description")}
          </span>
        </Link>
      </nav>
    </>
  );
}
