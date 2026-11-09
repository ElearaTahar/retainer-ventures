import { useTranslation } from "react-i18next";
import "../styles/legal-page.css";

export function LegalNoticePage() {
  const { t } = useTranslation();

  return (
    <div className="page-layout legal-page">
      <h1>{t("legal.title")}</h1>

      <section aria-labelledby="legal-publisher">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            01
          </span>
          <h2 id="legal-publisher">{t("legal.publisher.title")}</h2>
        </div>

        <p>{t("legal.publisher.name")}</p>
      </section>

      <section aria-labelledby="legal-publication-manager">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            02
          </span>
          <h2 id="legal-publication-manager">
            {t("legal.publicationManager.title")}
          </h2>
        </div>

        <p>Eleara Tahar</p>

        <p>Contact: {/*TODO*/}</p>
      </section>

      <section aria-labelledby="legal-hosting">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            03
          </span>
          <h2 id="legal-hosting">{t("legal.hosting.title")}</h2>
        </div>

        <p>{t("legal.hosting.description")}</p>

        <address>
          Railway Corp.
          <br />
          San Francisco, CA, USA
          <br />
          <a href="https://railway.app">https://railway.app</a>
        </address>
      </section>

      <section aria-labelledby="legal-intellectual-property">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            04
          </span>
          <h2 id="legal-intellectual-property">
            {t("legal.intellectualProperty.title")}
          </h2>
        </div>

        <p>{t("legal.intellectualProperty.sourceCode")}</p>
        <p>{t("legal.intellectualProperty.thirdParty")}</p>
      </section>

      <section aria-labelledby="legal-ffxiv">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            05
          </span>
          <h2 id="legal-ffxiv">{t("legal.ffxiv.title")}</h2>
        </div>

        <p>{t("legal.ffxiv.copyright")}</p>
        <p>{t("legal.ffxiv.disclaimer")}</p>
      </section>

      <section aria-labelledby="legal-liability">
        <div className="legal-section-heading">
          <span className="legal-section-number" aria-hidden="true">
            06
          </span>
          <h2 id="legal-liability">{t("legal.liability.title")}</h2>
        </div>

        <p>{t("legal.liability.information")}</p>
        <p>{t("legal.liability.availability")}</p>
      </section>
    </div>
  );
}
