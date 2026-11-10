import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/app-footer.css";

type AppFooterProps = {
  generatedAt: string;
};

export function AppFooter({ generatedAt }: AppFooterProps) {
  const { t, i18n } = useTranslation();

  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(generatedAt));

  return (
    <footer className="app-footer">
      <div className="app-footer-content">
        <div className="app-footer-row">
          <p className="app-footer-credit">{t("footer.credit")}</p>

          <nav aria-label={t("footer.navigation")}>
            <Link to="/legal">{t("legal.title")}</Link>
            <Link to="/privacy">{t("privacy.title")}</Link>

            <a
              href="https://github.com/ElearaTahar/retainer-ventures"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>

        <p className="app-footer-data-date">
          {t("footer.dataGeneratedAt", { date: formattedDate })}
        </p>

        <div className="app-footer-row app-footer-legal">
          <p>© SQUARE ENIX</p>
          <p>{t("legal.ffxiv.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
