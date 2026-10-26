import { Pencil, Plus, Repeat, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import type { Language } from "../types/i18n";
import { RetainersEmptyState } from "../components/RetainersEmptyState";
import { RetainerFormDialog } from "../components/RetainerFormDialog";
import type { Retainer } from "../types/retainers";
import {
  getRetainerAvatarColors,
  getRetainerInitials,
} from "../utils/retainerAvatars";
import { restoreRetainer } from "../db/retainers";
import { RecordRunDialog } from "../components/RecordRunDialog";
import "../styles/retainers-page.css";
import type {
  ExplorationVenture,
  QuickVenture,
  TargetedVenture,
} from "../types/ventures";
import type { ItemSearchEntry } from "../types/items";
import type { VentureRewardsData } from "../types/ventureRewards";
import { ItemIconStack } from "../components/ItemIconStack";
import { deleteVentureRun } from "../db/ventureRuns";

type RetainersPageProps = {
  targetedVentures: TargetedVenture[];
  explorationVentures: ExplorationVenture[];
  quickVenture: QuickVenture;
  itemsById: Map<number, ItemSearchEntry>;
  ventureRewards: VentureRewardsData;
};

export function RetainersPage({
  targetedVentures,
  explorationVentures,
  quickVenture,
  itemsById,
  ventureRewards,
}: RetainersPageProps) {
  const { t, i18n } = useTranslation();

  const language: Language = i18n.language === "fr" ? "fr" : "en";

  const numberFormatter = new Intl.NumberFormat(language);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRetainer, setSelectedRetainer] = useState<Retainer | null>(
    null,
  );

  const [recordRunRetainerId, setRecordRunRetainerId] = useState<number | null>(
    null,
  );

  const retainers = useLiveQuery(() => db.retainers.toArray());
  const activeRetainers =
    retainers?.filter((retainer) => retainer.status === "active") ?? [];
  const archivedRetainers =
    retainers?.filter((retainer) => retainer.status === "archived") ?? [];

  const [recordRunInitialVentureId, setRecordRunInitialVentureId] = useState<
    number | null
  >(null);

  const ventureRuns = useLiveQuery(() =>
    db.ventureRuns.orderBy("completedAt").reverse().toArray(),
  );

  const avatarColors = getRetainerAvatarColors(retainers ?? []);

  const [visibleRunsCount, setVisibleRunsCount] = useState<number>(20);
  const visibleRuns = ventureRuns?.slice(0, visibleRunsCount) ?? [];

  function handleAddRetainer() {
    setSelectedRetainer(null);
    setIsFormOpen(true);
  }

  function handleEditRetainer(retainer: Retainer) {
    setSelectedRetainer(retainer);
    setIsFormOpen(true);
  }

  async function handleRestoreRetainer(id: number) {
    try {
      await restoreRetainer(id);
    } catch (error) {
      console.error(error);
    }
  }

  function handleRecordRun(retainerId: number) {
    setRecordRunInitialVentureId(null);
    setRecordRunRetainerId(retainerId);
  }

  function handleRepeatRun(retainerId: number, ventureId: number) {
    setRecordRunInitialVentureId(ventureId);
    setRecordRunRetainerId(retainerId);
  }

  async function handleDeleteRun(
    runId: number,
    ventureName: string,
    retainerName: string,
  ) {
    const confirm = window.confirm(
      t("ventureRuns.confirmDeleteRun", {
        ventureName,
        retainerName,
      }),
    );

    if (!confirm) return;

    try {
      await deleteVentureRun(runId);
    } catch {
      window.alert(t("ventureRuns.errorDeleteRun"));
    }
  }

  let content;

  if (retainers === undefined) {
    content = <p>{t("myRetainers.loading")}</p>;
  } else if (activeRetainers.length === 0) {
    content = <RetainersEmptyState onAddRetainer={handleAddRetainer} />;
  } else {
    content = (
      <>
        <div className="section-header">
          <span>
            {t("myRetainers.retainersNumber", {
              count: activeRetainers.length,
            })}
          </span>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddRetainer}
          >
            <Plus size={16} aria-hidden="true" />
            {t("myRetainers.addRetainerButton")}
          </button>
        </div>

        <div className="retainers-list">
          {activeRetainers.map((retainer) => {
            const initials = getRetainerInitials(retainer.name);
            const avatarColor = avatarColors.get(retainer.id);

            const lastRun = ventureRuns?.find(
              (run) => run.retainerId === retainer.id,
            );

            const lastVenture =
              targetedVentures.find(
                (venture) => venture.id === lastRun?.ventureId,
              ) ??
              explorationVentures.find(
                (venture) => venture.id === lastRun?.ventureId,
              ) ??
              (quickVenture.id === lastRun?.ventureId
                ? quickVenture
                : undefined);

            const lastVentureName =
              lastVenture?.kind === "targeted"
                ? itemsById.get(lastVenture.targetItemId)?.name[
                    language === "fr" ? "fr" : "en"
                  ]
                : lastVenture?.name[language === "fr" ? "fr" : "en"];

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
                    <span className="retainer-card-name" title={retainer.name}>
                      {retainer.name}
                    </span>
                    <span className="retainer-card-subtitle">
                      {t(`retainerTypes.${retainer.retainerType}`)}
                      {retainer.level !== undefined && (
                        <>
                          {" "}
                          · {t("myRetainers.level")}{" "}
                          {numberFormatter.format(retainer.level)}
                        </>
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="retainer-card-edit-button"
                    aria-label={t("myRetainers.editRetainerButton", {
                      name: retainer.name,
                    })}
                    onClick={() => handleEditRetainer(retainer)}
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                </div>

                <div className="retainer-card-stats">
                  {retainer.retainerType === "combat" &&
                    retainer.itemLevel !== undefined && (
                      <span>
                        {t("myRetainers.ilvl")}{" "}
                        {numberFormatter.format(retainer.itemLevel)}
                      </span>
                    )}

                  {retainer.retainerType !== "combat" && (
                    <>
                      {retainer.gathering !== undefined && (
                        <span>
                          {t("myRetainers.gathering")}{" "}
                          {numberFormatter.format(retainer.gathering)}
                        </span>
                      )}
                      {retainer.perception !== undefined && (
                        <span>
                          {t("myRetainers.perception")}{" "}
                          {numberFormatter.format(retainer.perception)}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-subtle retainer-card-record-run"
                  onClick={() => handleRecordRun(retainer.id)}
                >
                  <Plus size={16} aria-hidden="true" />
                  {t("myRetainers.recordRunButton")}
                </button>

                {lastRun !== undefined && (
                  <button
                    type="button"
                    className="btn btn-subtle retainer-card-repeat-run"
                    onClick={() =>
                      handleRepeatRun(retainer.id, lastRun.ventureId)
                    }
                  >
                    <Repeat size={16} aria-hidden="true" />
                    <div className="retainer-card-repeat-texts">
                      <span className="retainer-card-repeat-label">
                        {t("myRetainers.repeatLastRunButton")}
                      </span>
                      <span className="retainer-card-repeat-venture">
                        {lastVentureName ?? t("ventureRuns.unknownVenture")}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  const recordRunRetainer = activeRetainers.find(
    (retainer) => retainer.id === recordRunRetainerId,
  );

  return (
    <div className="page-layout retainers-page">
      <h1>{t("navigation.retainers")}</h1>

      {content}

      {archivedRetainers.length > 0 && (
        <details className="archived-retainers">
          <summary>
            {t("myRetainers.archivedRetainersNumber", {
              count: archivedRetainers.length,
            })}
          </summary>

          {archivedRetainers.map((retainer) => (
            <div className="archived-retainer-row" key={retainer.id}>
              <div className="archived-retainer-info">
                <span className="archived-retainer-name" title={retainer.name}>
                  {retainer.name}
                </span>
                <span className="archived-retainer-details">
                  {t(`retainerTypes.${retainer.retainerType}`)}
                  {retainer.level !== undefined && (
                    <>
                      {" "}
                      · {t("myRetainers.level")}{" "}
                      {numberFormatter.format(retainer.level)}
                    </>
                  )}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-secondary archived-retainer-restore"
                onClick={() => handleRestoreRetainer(retainer.id)}
              >
                {t("myRetainers.restoreRetainerButton")}
              </button>
            </div>
          ))}
        </details>
      )}

      {(activeRetainers.length > 0 ||
        (ventureRuns !== undefined && ventureRuns.length > 0)) && (
        <section className="venture-runs-section">
          <h2>{t("ventureRuns.title")}</h2>

          {ventureRuns !== undefined && ventureRuns.length > 0 && (
            <div className="section-header">
              <span>
                {t("ventureRuns.runsNumber", {
                  count: ventureRuns.length,
                })}
              </span>
            </div>
          )}

          {ventureRuns === undefined ? null : ventureRuns.length === 0 ? (
            <p className="run-timeline-empty">{t("ventureRuns.empty")}</p>
          ) : (
            <ol className="run-timeline">
              {visibleRuns.map((run) => {
                const retainer = retainers?.find(
                  (retainer) => retainer.id === run.retainerId,
                );

                const initials = getRetainerInitials(retainer?.name ?? "");
                const avatarColor = avatarColors.get(retainer?.id ?? 1);

                const venture =
                  targetedVentures.find(
                    (venture) => venture.id === run.ventureId,
                  ) ??
                  explorationVentures.find(
                    (venture) => venture.id === run.ventureId,
                  ) ??
                  (quickVenture.id === run.ventureId
                    ? quickVenture
                    : undefined);

                const ventureName =
                  venture?.kind === "targeted"
                    ? itemsById.get(venture.targetItemId)?.name[
                        language === "fr" ? "fr" : "en"
                      ]
                    : venture?.name[language === "fr" ? "fr" : "en"];

                return (
                  <li className="run-timeline-item" key={run.id}>
                    <div
                      className="retainer-avatar"
                      data-color={avatarColor}
                      aria-hidden="true"
                    >
                      {initials}
                    </div>

                    <div className="run-timeline-content">
                      <div className="run-timeline-details">
                        <span className="run-timeline-venture">
                          {ventureName ?? t("ventureRuns.unknownVenture")}
                        </span>
                        <span className="run-timeline-retainer">
                          {retainer?.name ?? t("ventureRuns.unknownRetainer")}
                        </span>
                      </div>

                      <div className="run-timeline-rewards">
                        {run.results.map((result) => {
                          const item = itemsById.get(result.itemId);
                          const itemName =
                            item?.name[language === "fr" ? "fr" : "en"] ??
                            t("explorationVenture.unknownItem", {
                              id: result.itemId,
                            });

                          return (
                            <span
                              className="run-timeline-reward"
                              key={result.itemId}
                            >
                              {item?.iconId !== undefined && (
                                <ItemIconStack iconIds={[item.iconId]} />
                              )}
                              {`${itemName} ×${result.quantity}`}
                            </span>
                          );
                        })}
                      </div>

                      <div className="run-timeline-date">
                        {new Intl.DateTimeFormat(navigator.language, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(run.completedAt))}
                      </div>

                      <button
                        className="btn btn-secondary run-timeline-delete-button"
                        type="button"
                        aria-label={t("ventureRuns.deleteRun")}
                        onClick={() =>
                          handleDeleteRun(
                            run.id,
                            ventureName ?? t("ventureRuns.unknownVenture"),
                            retainer?.name ?? t("ventureRuns.unknownRetainer"),
                          )
                        }
                      >
                        <Trash2 className="run-timeline-delete" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {(ventureRuns?.length ?? 0) > visibleRunsCount && (
            <button
              type="button"
              className="btn btn-subtle"
              onClick={() =>
                setVisibleRunsCount((previousCount) => previousCount + 20)
              }
            >
              {t("ventureRuns.showMore")}
            </button>
          )}
        </section>
      )}

      {isFormOpen && (
        <RetainerFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          retainer={selectedRetainer ?? undefined}
        />
      )}

      {recordRunRetainer !== undefined && (
        <RecordRunDialog
          targetedVentures={targetedVentures}
          explorationVentures={explorationVentures}
          quickVenture={quickVenture}
          itemsById={itemsById}
          ventureRewards={ventureRewards}
          retainer={recordRunRetainer}
          avatarColor={avatarColors.get(recordRunRetainer.id) ?? 1}
          initialVentureId={recordRunInitialVentureId ?? undefined}
          onClose={() => {
            setRecordRunRetainerId(null);
            setRecordRunInitialVentureId(null);
          }}
        />
      )}
    </div>
  );
}
