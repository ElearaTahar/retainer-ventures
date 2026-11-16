import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const pageKeys = {
  "/ventures": "ventures",
  "/retainers": "retainers",
  "/legal": "legal",
  "/privacy": "privacy",
} as const;

export function PageMetadata() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const page = pageKeys[pathname as keyof typeof pageKeys] ?? "notFound";

    const appTitle = t("appTitle");
    const pageTitle = t(`meta.${page}.title`);

    document.title =
      page === "ventures" ? appTitle : `${pageTitle} | ${appTitle}`;

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (description) {
      description.content = t(`meta.${page}.description`);
    }
  }, [pathname, i18n.resolvedLanguage, t]);

  return null;
}
