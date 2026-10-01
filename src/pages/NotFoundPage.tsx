import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.description")}</p>
      <Link to="/ventures">{t("notFound.backToVentures")}</Link>
    </>
  );
}
