import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/ventures-page.css";

export function VenturesPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("navigation.ventures")}</h1>
      <p>{t("ventures.browseVentures")}</p>

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
