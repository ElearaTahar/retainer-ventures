import { Check, Compass, Crosshair, Dices, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { categoriesByRetainerType } from "../data/ventureCategories";
import type { Retainer } from "../types/retainers";
import { getRetainerInitials } from "../utils/retainerAvatars";
import type { Language } from "../types/i18n";
import "../styles/record-run-dialog.css";

type RecordRunStep = 1 | 2 | 3 | 4;

type VentureKind = "targeted" | "exploration" | "quick";

type RecordRunDialogProps = {
  retainer: Retainer;
  avatarColor: number;
  onClose: () => void;
};

export function RecordRunDialog({
  retainer,
  avatarColor,
  onClose,
}: RecordRunDialogProps) {
  const { t, i18n } = useTranslation();
  const language: Language = i18n.language === "fr" ? "fr" : "en";
  const numberFormatter = new Intl.NumberFormat(language);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const categories = categoriesByRetainerType[retainer.retainerType];

  const initials = getRetainerInitials(retainer.name);

  const [currentStep, setCurrentStep] = useState<RecordRunStep>(2);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<RecordRunStep>(2);
  const steps = [
    { id: 1, label: t("recordRun.steps.retainer") },
    { id: 2, label: t("recordRun.steps.type") },
    { id: 3, label: t("recordRun.steps.venture") },
    { id: 4, label: t("recordRun.steps.result") },
  ] as const;

  const [selectedVentureKind, setSelectedVentureKind] =
    useState<VentureKind | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    dialog.showModal();
  }, []);

  function handleSelectVentureKind(kind: VentureKind) {
    setSelectedVentureKind(kind);
    setMaxUnlockedStep(3);
  }

  function renderStepContent() {
    switch (currentStep) {
      case 1:
        return (
          <>
            <p className="record-run-step-hint">
              {t("recordRun.selectRetainerHint")}
            </p>

            <div className="record-run-retainer">
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

              <Check className="record-run-retainer-check" aria-hidden="true" />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <p className="record-run-step-hint">
              <Trans
                i18nKey="recordRun.selectVentureKindHint"
                values={{ name: retainer.name }}
                components={{ bold: <strong /> }}
              />
            </p>

            <div className="record-run-kind-options">
              {categories.map((category) => {
                const Icon = category.kind === "targeted" ? Crosshair : Compass;

                return (
                  <button
                    key={category.kind}
                    className="record-run-kind-button"
                    type="button"
                    onClick={() => handleSelectVentureKind(category.kind)}
                    aria-pressed={selectedVentureKind === category.kind}
                  >
                    <Icon className="record-run-kind-icon" aria-hidden="true" />
                    {t(category.translationKey)}
                    <Check
                      className="record-run-kind-check"
                      aria-hidden="true"
                      aria-pressed={selectedVentureKind === category.kind}
                    />
                  </button>
                );
              })}

              <button
                className="record-run-kind-button"
                type="button"
                onClick={() => handleSelectVentureKind("quick")}
                aria-pressed={selectedVentureKind === "quick"}
              >
                <Dices className="record-run-kind-icon" aria-hidden="true" />
                {t("quickExplorationVenture.title")}
                <Check
                  className="record-run-kind-check"
                  aria-hidden="true"
                  aria-pressed={selectedVentureKind === "quick"}
                />
              </button>
            </div>
          </>
        );
      case 3:
        return <p>Choose a venture in the previously chosen venture type.</p>;
      case 4:
        return <p>Filtered rewards and quantity.</p>;
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="record-run-dialog"
      onClose={onClose}
      aria-labelledby="record-run-title"
    >
      <div className="record-run-dialog-header">
        <h2 id="record-run-title">{t("myRetainers.recordRunTitle")}</h2>

        <button
          type="button"
          onClick={onClose}
          aria-label={t("navigation.close")}
        >
          <X aria-hidden="true" />
        </button>
      </div>

      <nav
        className="record-run-steps"
        aria-label={t("recordRun.stepsNavigation")}
      >
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            className="record-run-step"
            onClick={() => setCurrentStep(step.id)}
            aria-current={currentStep === step.id ? "step" : undefined}
            data-state={
              step.id === currentStep
                ? "current"
                : step.id < maxUnlockedStep
                  ? "completed"
                  : "upcoming"
            }
            disabled={step.id > maxUnlockedStep}
          >
            <span className="record-run-step-circle" aria-hidden="true">
              {step.id < maxUnlockedStep && step.id !== currentStep ? (
                <Check size={16} />
              ) : (
                step.id
              )}
            </span>

            <span className="record-run-step-label">{step.label}</span>
          </button>
        ))}
      </nav>

      <div className="record-run-content">{renderStepContent()}</div>

      <div className="record-run-footer">
        {currentStep !== 1 && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              setCurrentStep(Math.max(currentStep - 1, 1) as RecordRunStep)
            }
          >
            {t("navigation.back")}
          </button>
        )}

        <button
          type="button"
          className="btn btn-primary record-run-continue"
          onClick={() =>
            setCurrentStep(Math.min(currentStep + 1, 4) as RecordRunStep)
          }
          disabled={currentStep >= maxUnlockedStep}
        >
          {t("navigation.continue")}
        </button>
      </div>
    </dialog>
  );
}
