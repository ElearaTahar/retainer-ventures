import { useTranslation } from "react-i18next";

export function RetainersPage() {
  const { t } = useTranslation();

  return <h1>{t("navigation.retainers")}</h1>;
}
