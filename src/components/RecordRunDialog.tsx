import { Check, Compass, Crosshair, Dices, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { categoriesByRetainerType } from "../data/ventureCategories";
import type { Retainer } from "../types/retainers";
import { getRetainerInitials } from "../utils/retainerAvatars";
import type { Language } from "../types/i18n";
import "../styles/record-run-dialog.css";
import type {
  ExplorationVenture,
  QuickVenture,
  TargetedVenture,
} from "../types/ventures";
import type { ItemSearchEntry } from "../types/items";
import { ItemIconStack } from "./ItemIconStack";
import type { VentureRewardsData } from "../types/ventureRewards";
import { getVentureDisplayIconIds } from "../utils/ventureDisplay";
import { getRequirementStatus } from "../utils/ventureRequirements";

type RecordRunStep = 1 | 2 | 3 | 4;

type VentureKind = "targeted" | "exploration" | "quick";

type RecordRunDialogProps = {
  targetedVentures: TargetedVenture[];
  explorationVentures: ExplorationVenture[];
  quickVenture: QuickVenture;
  itemsById: Map<number, ItemSearchEntry>;
  ventureRewards: VentureRewardsData;
  retainer: Retainer;
  avatarColor: number;
  onClose: () => void;
};

export function RecordRunDialog({
  targetedVentures,
  explorationVentures,
  quickVenture,
  itemsById,
  ventureRewards,
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

  const [selectedVentureId, setSelectedVentureId] = useState<number | null>(
    null,
  );

  const [searchQuery, setSearchQuery] = useState("");

  const availableVentures = getAvailableVentures();

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredVentures = availableVentures.filter((venture) => {
    const ventureName =
      venture.kind === "targeted"
        ? (itemsById.get(venture.targetItemId)?.name[
            language === "fr" ? "fr" : "en"
          ] ?? "")
        : venture.name[language === "fr" ? "fr" : "en"];

    return ventureName
      .trim()
      .toLocaleLowerCase()
      .includes(normalizedSearchQuery);
  });

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    dialog.showModal();
  }, []);

  function handlePreviousStep() {
    if (currentStep === 4 && selectedVentureKind === "quick") {
      setCurrentStep(2);
      return;
    }

    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as RecordRunStep);
    }
  }

  function handleNextStep() {
    if (currentStep === 2 && selectedVentureKind === "quick") {
      setCurrentStep(4);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as RecordRunStep);
    }
  }

  function handleSelectVentureKind(kind: VentureKind) {
    setSelectedVentureKind(kind);

    if (kind === "quick") {
      setSelectedVentureId(quickVenture.id);
      setMaxUnlockedStep(4);
    } else {
      setSelectedVentureId(null);
      setMaxUnlockedStep(3);
    }

    setSearchQuery("");
  }

  function handleSelectVenture(ventureId: number) {
    setSelectedVentureId(ventureId);
    setMaxUnlockedStep(4);
  }

  function getAvailableVentures() {
    switch (selectedVentureKind) {
      case "targeted":
        return targetedVentures.filter(
          (venture) =>
            venture.retainerType === retainer.retainerType &&
            (retainer.level === undefined ||
              venture.requiredLevel <= retainer.level),
        );

      case "exploration":
        return explorationVentures.filter(
          (venture) =>
            venture.retainerType === retainer.retainerType &&
            (retainer.level === undefined ||
              venture.requiredLevel <= retainer.level),
        );

      case "quick":
        return [quickVenture];

      default:
        return [];
    }
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
        return (
          <div>
            {selectedVentureKind !== "quick" && (
              <>
                <p className="record-run-step-hint">
                  <Trans
                    i18nKey="recordRun.selectVentureHint"
                    values={{ name: retainer.name }}
                    components={{ bold: <strong /> }}
                  />
                </p>

                {retainer.level !== undefined && (
                  <p className="record-run-level-hint">
                    {t("recordRun.levelFilterHint", { level: retainer.level })}
                  </p>
                )}

                <div className="record-run-search">
                  <input
                    id="venture-search"
                    type="search"
                    aria-label={t("recordRun.search.label")}
                    placeholder={t("recordRun.search.placeholder")}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
              </>
            )}
            <div className="record-run-venture-list">
              {filteredVentures.length === 0 ? (
                <p className="record-run-empty">
                  {t("recordRun.search.noResults")}
                </p>
              ) : (
                filteredVentures.map((venture) => {
                  const requirementStatus =
                    venture.kind === "targeted" ||
                    venture.kind === "exploration"
                      ? getRequirementStatus(venture.requirement, retainer)
                      : "unknown";

                  const currentStat =
                    retainer.retainerType === "combat"
                      ? retainer.itemLevel
                      : retainer.gathering;

                  const requirementLabel =
                    venture.kind === "quick"
                      ? null
                      : venture.requirement.type === "gathering"
                        ? "recordRun.requirements.gathering"
                        : "recordRun.requirements.itemLevel";

                  return (
                    <button
                      className="record-run-venture-button"
                      data-selected={selectedVentureId === venture.id}
                      key={venture.id}
                      type="button"
                      onClick={() => handleSelectVenture(venture.id)}
                      aria-pressed={selectedVentureId === venture.id}
                    >
                      <ItemIconStack
                        iconIds={getVentureDisplayIconIds(
                          venture,
                          itemsById,
                          ventureRewards,
                        )}
                      />

                      <div className="record-run-venture-info">
                        <span>
                          {venture.kind === "targeted"
                            ? (itemsById.get(venture.targetItemId)?.name[
                                language === "fr" ? "fr" : "en"
                              ] ?? venture.id)
                            : venture.name[language === "fr" ? "fr" : "en"]}
                        </span>

                        {requirementStatus === "unmet" &&
                          venture.kind !== "quick" &&
                          requirementLabel !== null && (
                            <span className="record-run-venture-requirement">
                              {t("recordRun.requirements.unmet", {
                                stat: t(requirementLabel),
                                current:
                                  currentStat !== undefined
                                    ? numberFormatter.format(currentStat)
                                    : "?",
                                required: numberFormatter.format(
                                  venture.requirement.value,
                                ),
                              })}
                            </span>
                          )}
                      </div>

                      {selectedVentureId === venture.id && (
                        <Check
                          className="record-run-venture-check"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        );
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
            disabled={
              step.id > maxUnlockedStep ||
              (selectedVentureKind === "quick" && step.id === 3)
            }
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
            onClick={handlePreviousStep}
          >
            {t("navigation.back")}
          </button>
        )}

        <button
          type="button"
          className="btn btn-primary record-run-continue"
          onClick={handleNextStep}
          disabled={currentStep >= maxUnlockedStep}
        >
          {t("navigation.continue")}
        </button>
      </div>
    </dialog>
  );
}
