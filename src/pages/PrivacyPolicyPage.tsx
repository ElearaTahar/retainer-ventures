import { useTranslation } from "react-i18next";
import "../styles/legal-page.css";

export function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="page-layout legal-page">
      <h1>{t("privacy.title")}</h1>

      <section aria-labelledby="privacy-overview">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            01
          </span>
          <h2 id="privacy-overview">{t("privacy.overview.title")}</h2>
        </div>

        <p>{t("privacy.overview.description")}</p>
      </section>

      <section aria-labelledby="privacy-local-data">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            02
          </span>
          <h2 id="privacy-local-data">{t("privacy.localData.title")}</h2>
        </div>

        <p>{t("privacy.localData.storage")}</p>
        <p>{t("privacy.localData.deletion")}</p>
      </section>

      <section aria-labelledby="privacy-third-parties">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            03
          </span>
          <h2 id="privacy-third-parties">{t("privacy.thirdParties.title")}</h2>
        </div>

        <p>{t("privacy.thirdParties.hosting")}</p>
      </section>

      <section aria-labelledby="privacy-analytics">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            04
          </span>
          <h2 id="privacy-analytics">{t("privacy.analytics.title")}</h2>
        </div>

        <p>{t("privacy.analytics.description")}</p>
      </section>

      <section aria-labelledby="privacy-rights">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            05
          </span>
          <h2 id="privacy-rights">{t("privacy.rights.title")}</h2>
        </div>

        <p>{t("privacy.rights.retention")}</p>
        <p>{t("privacy.rights.contact")}</p>
      </section>
    </div>
  );
}
