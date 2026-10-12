import { useTranslation } from "react-i18next";
import { RetainerBellIcon } from "./icons/RetainerBellIcon";

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

      <button type="button" className="btn btn-subtle" onClick={onAddRetainer}>
        {t("myRetainers.addRetainerButton")}
      </button>
    </div>
  );
}
