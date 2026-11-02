import { useTranslation } from "react-i18next";
import { RetainerBellIcon } from "./icons/RetainerBellIcon";
import { Info } from "lucide-react";

type RetainersEmptyStateProps = {
  onAddRetainer: () => void;
};

export function RetainersEmptyState({
  onAddRetainer,
}: RetainersEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="empty-state">
      <RetainerBellIcon className="app-logo" aria-hidden="true" />

      <div className="empty-state-text">
        <p className="empty-state-title">{t("myRetainers.noRetainerTitle")}</p>
        <p>{t("myRetainers.noRetainerDescription")}</p>
      </div>

      <p className="local-storage-notice">
        <Info size={16} aria-hidden="true" />
        <span>{t("myRetainers.localStorageNotice")}</span>
      </p>

      <button type="button" className="btn btn-subtle" onClick={onAddRetainer}>
        {t("myRetainers.addRetainerButton")}
      </button>
    </div>
  );
}
