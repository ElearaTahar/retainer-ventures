import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import { RetainersEmptyState } from "../components/RetainersEmptyState";
import { RetainerFormDialog } from "../components/RetainerFormDialog";
import {
  getRetainerAvatarColors,
  getRetainerInitials,
} from "../utils/retainerAvatars";
import "../styles/retainers-page.css";

export function RetainersPage() {
  const { t } = useTranslation();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const retainers = useLiveQuery(() => db.retainers.toArray());

  let content;

  if (retainers === undefined) {
    content = <p>{t("myRetainers.loading")}</p>;
  } else if (retainers.length === 0) {
    content = <RetainersEmptyState onAddRetainer={() => setIsFormOpen(true)} />;
  } else {
    const avatarColors = getRetainerAvatarColors(retainers);
    content = (
      <>
        <div className="retainers-header">
          <span>
            {t("myRetainers.retainersNumber", { count: retainers.length })}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus size={16} aria-hidden="true" />
            {t("myRetainers.addRetainerButton")}
          </button>
        </div>

        <div className="retainers-list">
          {retainers.map((retainer) => {
            const initials = getRetainerInitials(retainer.name);
            const avatarColor = avatarColors.get(retainer.id);

            return (
              <div className="retainer-card" key={retainer.id}>
                <div className="retainer-card-header">
                  <div
                    className="retainer-avatar"
                    data-color={avatarColor}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>

                  <div className="retainer-card-identity">
                    <span className="retainer-card-name">{retainer.name}</span>
                    <span className="retainer-card-subtitle">
                      {t(`retainerTypes.${retainer.retainerType}`)}
                      {retainer.level !== undefined && (
                        <>
                          {" "}
                          · {t("myRetainers.level")} {retainer.level}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="retainer-card-stats">
                  {retainer.retainerType === "combat" &&
                    retainer.itemLevel !== undefined && (
                      <span>
                        {t("myRetainers.ilvl")} {retainer.itemLevel}
                      </span>
                    )}

                  {retainer.retainerType !== "combat" && (
                    <>
                      {retainer.gathering !== undefined && (
                        <span>
                          {t("myRetainers.gathering")} {retainer.gathering}
                        </span>
                      )}
                      {retainer.perception !== undefined && (
                        <span>
                          {t("myRetainers.perception")} {retainer.perception}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div className="page-layout retainers-page">
      <h1>{t("navigation.retainers")}</h1>

      {content}

      <RetainerFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}
