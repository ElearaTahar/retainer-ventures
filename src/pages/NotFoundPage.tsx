import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Compass, ArrowLeft } from "lucide-react";
import "../styles/not-found-page.css";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="page-layout not-found-page">
      <Compass
        className="not-found-icon"
        size={48}
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.description")}</p>

      <Link to="/ventures" className="not-found-link">
        {t("notFound.backToVentures")}
      </Link>
    </div>
  );
}
