import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/ventures-page.css";

export function VenturesPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("navigation.ventures")}</h1>
      <p>{t("ventures.chooseRetainerType")}</p>

      <nav
        className="venture-type-navigation"
        aria-label={t("ventures.retainerTypes")}
      >
        <Link to="/ventures/combat">{t("retainerTypes.combat")}</Link>
        <Link to="/ventures/miner">{t("retainerTypes.miner")}</Link>
        <Link to="/ventures/botanist">{t("retainerTypes.botanist")}</Link>
        <Link to="/ventures/fisher">{t("retainerTypes.fisher")}</Link>
      </nav>
    </>
  );
}
