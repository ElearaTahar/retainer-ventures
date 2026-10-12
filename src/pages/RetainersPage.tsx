import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import { RetainersEmptyState } from "../components/RetainersEmptyState";
import { RetainerFormDialog } from "../components/RetainerFormDialog";
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
    content = retainers.map((retainer) => {
      return <p key={retainer.id}>{retainer.name}</p>;
    });
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
