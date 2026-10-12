import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import { RetainersEmptyState } from "../components/RetainersEmptyState";
import "../styles/retainers-page.css";

export function RetainersPage() {
  const { t } = useTranslation();

  const retainers = useLiveQuery(() => db.retainers.toArray());

  let content;

  if (retainers === undefined) {
    content = <p>{t("myRetainers.loading")}</p>;
  } else if (retainers.length === 0) {
    content = (
      <RetainersEmptyState
        onAddRetainer={() => console.log("retainer added")}
      />
    );
  } else {
    content = retainers.map((retainer) => {
      return <p key={retainer.id}>{retainer.name}</p>;
    });
  }

  return (
    <div className="page-layout retainers-page">
      <h1>{t("navigation.retainers")}</h1>

      {content}
    </div>
  );
}
