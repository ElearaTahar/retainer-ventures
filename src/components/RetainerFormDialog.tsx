import { ChevronDown, Ellipsis, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import type { RetainerType } from "../types/ventures";
import type { NewRetainer, Retainer } from "../types/retainers";
import {
  archiveRetainer,
  createRetainer,
  deleteRetainer,
  updateRetainer,
} from "../db/retainers";

type RetainerFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  retainer?: Retainer;
};

export function RetainerFormDialog({
  isOpen,
  onClose,
  retainer,
}: RetainerFormDialogProps) {
  const { t } = useTranslation();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [name, setName] = useState(retainer?.name ?? "");
  const [retainerType, setRetainerType] = useState<RetainerType>(
    retainer?.retainerType ?? "combat",
  );
  const [level, setLevel] = useState(
    retainer?.level === undefined ? "" : String(retainer.level),
  );
  const [itemLevel, setItemLevel] = useState(
    retainer?.retainerType === "combat" && retainer.itemLevel !== undefined
      ? String(retainer.itemLevel)
      : "",
  );
  const [gathering, setGathering] = useState(
    retainer?.retainerType !== "combat" && retainer?.gathering !== undefined
      ? String(retainer.gathering)
      : "",
  );
  const [perception, setPerception] = useState(
    retainer?.retainerType !== "combat" && retainer?.perception !== undefined
      ? String(retainer.perception)
      : "",
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const isEditing = retainer !== undefined;

  function handleClose() {
    setName("");
    setRetainerType("combat");
    setLevel("");
    setItemLevel("");
    setGathering("");
    setPerception("");
    setSaveError(false);
    onClose();
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    let retainerData: NewRetainer;

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    if (retainerType === "combat") {
      retainerData = {
        name: trimmedName,
        retainerType: "combat",
        level: level === "" ? undefined : Number(level),
        itemLevel: itemLevel === "" ? undefined : Number(itemLevel),
      };
    } else {
      retainerData = {
        name: trimmedName,
        retainerType,
        level: level === "" ? undefined : Number(level),
        gathering: gathering === "" ? undefined : Number(gathering),
        perception: perception === "" ? undefined : Number(perception),
      };
    }

    setIsSaving(true);
    setSaveError(false);

    try {
      if (retainer) {
        await updateRetainer(retainer.id, retainerData);
      } else {
        await createRetainer(retainerData);
      }
      handleClose();
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchive() {
    if (isSaving || retainer === undefined) {
      return;
    }

    setIsSaving(true);
    setSaveError(false);

    try {
      await archiveRetainer(retainer.id);
      handleClose();
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (isSaving || retainer === undefined) {
      return;
    }

    const confirm = window.confirm(
      t("myRetainers.confirmDeleteRetainer", { name: retainer.name }),
    );

    if (!confirm) {
      return;
    }

    setIsSaving(true);
    setSaveError(false);

    try {
      await deleteRetainer(retainer.id);
      handleClose();
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="retainer-form-dialog"
      aria-labelledby="retainer-form-title"
    >
      <div className="retainer-form-dialog-header">
        <h2 id="retainer-form-title">
          {isEditing
            ? t("myRetainers.editRetainerTitle")
            : t("myRetainers.addRetainerTitle")}
        </h2>

        {isEditing && (
          <details className="retainer-actions">
            <summary aria-label={t("myRetainers.retainerActionsMenu")}>
              <Ellipsis size={20} aria-hidden="true" />
            </summary>

            <div className="retainer-actions-menu">
              <button
                type="button"
                className="retainer-actions-menu-item"
                onClick={handleArchive}
                disabled={isSaving}
              >
                {t("myRetainers.archiveRetainerButton")}
              </button>
              <button
                type="button"
                className="retainer-actions-menu-item retainer-actions-menu-item-danger"
                onClick={handleDelete}
                disabled={isSaving}
              >
                {t("myRetainers.deleteRetainerButton")}
              </button>
            </div>
          </details>
        )}

        <button
          type="button"
          onClick={handleClose}
          aria-label={t("myRetainers.close")}
        >
          <X aria-hidden="true" />
        </button>
      </div>

      <form
        id="retainer-form"
        className="retainer-form"
        onSubmit={handleSubmit}
      >
        <div className="retainer-form-field">
          <label htmlFor="retainer-name" className="retainer-form-label">
            <span>{t("myRetainers.name")}</span>
            <span className="retainer-form-required">
              {t("myRetainers.required")}
            </span>
          </label>
          <input
            id="retainer-name"
            type="text"
            value={name}
            maxLength={30}
            onChange={(event) => {
              setName(event.target.value);
              setSaveError(false);
            }}
            required
          />
        </div>

        <div className="retainer-form-row">
          <div className="retainer-form-field">
            <label htmlFor="retainer-type">{t("myRetainers.type")}</label>
            <div className="retainer-form-select">
              <select
                id="retainer-type"
                name="retainerType"
                value={retainerType}
                onChange={(event) => {
                  setRetainerType(event.target.value as RetainerType);
                  setSaveError(false);
                }}
                required
              >
                <option value="combat">{t("retainerTypes.combat")}</option>
                <option value="miner">{t("retainerTypes.miner")}</option>
                <option value="botanist">{t("retainerTypes.botanist")}</option>
                <option value="fisher">{t("retainerTypes.fisher")}</option>
              </select>
              <ChevronDown aria-hidden="true" size={18} />
            </div>
          </div>

          <div className="retainer-form-field">
            <label htmlFor="retainer-level">{t("myRetainers.level")}</label>
            <input
              id="retainer-level"
              type="number"
              min="1"
              step="1"
              value={level}
              onChange={(event) => {
                setLevel(event.target.value);
                setSaveError(false);
              }}
            />
          </div>
        </div>

        {retainerType === "combat" ? (
          <div className="retainer-form-row">
            <div className="retainer-form-field">
              <label htmlFor="retainer-item-level">
                {t("myRetainers.ilvl")}
              </label>
              <input
                id="retainer-item-level"
                type="number"
                min="0"
                step="1"
                value={itemLevel}
                onChange={(event) => {
                  setItemLevel(event.target.value);
                  setSaveError(false);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="retainer-form-row">
            <div className="retainer-form-field">
              <label htmlFor="retainer-gathering">
                {t("myRetainers.gathering")}
              </label>
              <input
                id="retainer-gathering"
                type="number"
                min="0"
                step="1"
                value={gathering}
                onChange={(event) => {
                  setGathering(event.target.value);
                  setSaveError(false);
                }}
              />
            </div>

            <div className="retainer-form-field">
              <label htmlFor="retainer-perception">
                {t("myRetainers.perception")}
              </label>
              <input
                id="retainer-perception"
                type="number"
                min="0"
                step="1"
                value={perception}
                onChange={(event) => {
                  setPerception(event.target.value);
                  setSaveError(false);
                }}
              />
            </div>
          </div>
        )}
      </form>

      {saveError && (
        <p className="retainer-form-error" role="alert">
          {t("myRetainers.saveError")}
        </p>
      )}

      <div className="retainer-form-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClose}
        >
          {t("myRetainers.cancel")}
        </button>

        <button
          type="submit"
          form="retainer-form"
          className="btn btn-primary"
          disabled={isSaving}
        >
          {isSaving
            ? t("myRetainers.saving")
            : isEditing
              ? t("myRetainers.editRetainerSubmitButton")
              : t("myRetainers.addRetainerSubmitButton")}
        </button>
      </div>
    </dialog>
  );
}
