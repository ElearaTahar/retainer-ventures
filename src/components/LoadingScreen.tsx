import { useTranslation } from "react-i18next";
import { RetainerBellIcon } from "./icons/RetainerBellIcon";
import "../styles/loading-screen.css";

export function LoadingScreen() {
  const { t } = useTranslation();

  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <RetainerBellIcon className="loading-screen-bell" aria-hidden="true" />

      <p>{t("common.loading")}</p>
    </div>
  );
}
