import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/app-footer.css";

export function AppFooter() {
  const { t } = useTranslation();

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

        <div className="app-footer-row app-footer-legal">
          <p>© SQUARE ENIX</p>
          <p>{t("legal.ffxiv.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
