import { Check, Compass, Crosshair, Dices, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { categoriesByRetainerType } from "../data/ventureCategories";
import type { Retainer } from "../types/retainers";
import {
  getRetainerAvatarColors,
  getRetainerInitials,
} from "../utils/retainerAvatars";
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
import { getSuggestedQuantity } from "../utils/ventureQuantities";
import type {
  VentureResult,
  NewVentureRun,
  VentureRun,
} from "../types/ventureRuns";
import { addVentureRun, updateVentureRun } from "../db/ventureRuns";
import {
  getKnownRewardItemIds,
  isKnownVentureReward,
} from "../utils/ventureRewards";

type RecordRunStep = 1 | 2 | 3 | 4;

type VentureKind = "targeted" | "exploration" | "quick";

type RecordRunDialogProps = {
  targetedVentures: TargetedVenture[];
  explorationVentures: ExplorationVenture[];
  quickVenture: QuickVenture;
  itemsById: Map<number, ItemSearchEntry>;
  ventureRewards: VentureRewardsData;
  retainers: Retainer[];
  retainer?: Retainer;
  initialVentureId?: number;
  editingRun?: VentureRun;
  onClose: () => void;
};

export function RecordRunDialog({
  targetedVentures,
  explorationVentures,
  quickVenture,
  itemsById,
  ventureRewards,
  retainers,
  retainer,
  initialVentureId,
  editingRun,
  onClose,
}: RecordRunDialogProps) {
  const { t, i18n } = useTranslation();
  const language: Language = i18n.language === "fr" ? "fr" : "en";
  const numberFormatter = new Intl.NumberFormat(language);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const [selectedRetainerId, setSelectedRetainerId] = useState<number | null>(
    retainer?.id ?? null,
  );
  const selectedRetainer = retainers.find(
    (candidate) => candidate.id === selectedRetainerId,
  );

  const categories = selectedRetainer
    ? categoriesByRetainerType[selectedRetainer.retainerType]
    : [];

  const avatarColors = getRetainerAvatarColors(retainers);

  const ventureId = editingRun?.ventureId ?? initialVentureId;

  const initialVenture =
    ventureId === undefined
      ? undefined
      : quickVenture.id === ventureId
        ? quickVenture
        : (targetedVentures.find((venture) => venture.id === ventureId) ??
          explorationVentures.find((venture) => venture.id === ventureId));

  const initialVentureKind = initialVenture?.kind ?? null;

  function getCompatibleRetainers() {
    if (initialVenture === undefined) return retainers;

    switch (initialVenture.kind) {
      case "targeted":
      case "exploration":
        return retainers.filter(
          (candidate) =>
            candidate.retainerType === initialVenture.retainerType &&
            (candidate.level === undefined ||
              candidate.level >= initialVenture.requiredLevel),
        );

      case "quick":
        return retainers;

      default:
        return retainers;
    }
  }

  const compatibleRetainers = getCompatibleRetainers();

  const retainersToDisplay =
    retainer !== undefined && editingRun === undefined
      ? [retainer]
      : compatibleRetainers;

  const initialStep: RecordRunStep =
    retainer === undefined ? 1 : initialVentureKind === null ? 2 : 4;

  const [currentStep, setCurrentStep] = useState<RecordRunStep>(initialStep);
  const [maxUnlockedStep, setMaxUnlockedStep] =
    useState<RecordRunStep>(initialStep);
  const steps = [
    { id: 1, label: t("recordRun.steps.retainer") },
    { id: 2, label: t("recordRun.steps.type") },
    { id: 3, label: t("recordRun.steps.venture") },
    { id: 4, label: t("recordRun.steps.result") },
  ] as const;

  const [selectedVentureKind, setSelectedVentureKind] =
    useState<VentureKind | null>(initialVentureKind);

  const [selectedVentureId, setSelectedVentureId] = useState<number | null>(
    ventureId ?? null,
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(
    editingRun && initialVenture?.kind === "targeted"
      ? (editingRun.results[0]?.quantity ?? null)
      : initialVenture?.kind === "targeted" && selectedRetainer
        ? getSuggestedQuantity(initialVenture, selectedRetainer)
        : null,
  );

  const [explorationResults, setExplorationResults] = useState<VentureResult[]>(
    () => editingRun?.results.map((result) => ({ ...result })) ?? [],
  );
  const [explorationQuantityInputs, setExplorationQuantityInputs] = useState<
    Record<number, string>
  >({});
  const hasInvalidExplorationQuantity = explorationResults.some((result) => {
    const inputValue =
      explorationQuantityInputs[result.itemId] ?? String(result.quantity);

    const quantity = Number(inputValue);

    return inputValue === "" || quantity <= 0 || !Number.isInteger(quantity);
  });

  const [showAllRewards, setShowAllRewards] = useState(false);

  const canSaveExploration =
    explorationResults.length > 0 && !hasInvalidExplorationQuantity;

  const availableVentures = getAvailableVentures();

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();

  function getVentureSearchName(
    venture: TargetedVenture | ExplorationVenture | QuickVenture,
  ) {
    const name =
      venture.kind === "targeted"
        ? (itemsById.get(venture.targetItemId)?.name[language] ?? "")
        : venture.name[language];

    return name.trim().toLocaleLowerCase();
  }

  const filteredVentures = availableVentures
    .filter((venture) =>
      getVentureSearchName(venture).includes(normalizedSearchQuery),
    )
    .sort((a, b) => {
      const nameA = getVentureSearchName(a);
      const nameB = getVentureSearchName(b);

      const priorityA = nameA === normalizedSearchQuery ? 0 : 1;
      const priorityB = nameB === normalizedSearchQuery ? 0 : 1;

      return priorityA - priorityB;
    });

  const [itemSearchQuery, setItemSearchQuery] = useState("");

  const normalizedItemSearchQuery = itemSearchQuery.trim().toLocaleLowerCase();
  const searchResults =
    normalizedItemSearchQuery === ""
      ? []
      : Array.from(itemsById.values())
          .filter((item) => {
            const itemName = item.name[language === "fr" ? "fr" : "en"];

            return itemName
              .trim()
              .toLocaleLowerCase()
              .includes(normalizedItemSearchQuery);
          })
          .sort((a, b) => {
            const nameA = a.name[language].trim().toLocaleLowerCase();
            const nameB = b.name[language].trim().toLocaleLowerCase();

            const priorityA = nameA === normalizedItemSearchQuery ? 0 : 1;
            const priorityB = nameB === normalizedItemSearchQuery ? 0 : 1;

            return priorityA - priorityB;
          })
          .slice(0, 5);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    dialog.showModal();
  }, []);

  const searchResultsRef = useRef<HTMLUListElement>(null);
  const hadSearchResultsRef = useRef(false);
  const hasSearchResults = searchResults.length > 0;

  useEffect(() => {
    const hadResults = hadSearchResultsRef.current;
    hadSearchResultsRef.current = hasSearchResults;

    if (!hasSearchResults || hadResults) return;

    const frameId = requestAnimationFrame(() => {
      searchResultsRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "nearest",
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [hasSearchResults]);

  function handlePreviousStep() {
    if (
      currentStep === 4 &&
      retainer === undefined &&
      initialVenture !== undefined
    ) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === 4 && selectedVentureKind === "quick") {
      setCurrentStep(2);
      return;
    }

    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as RecordRunStep);
    }
  }

  function handleNextStep() {
    if (currentStep === 1 && initialVentureKind !== null) {
      setCurrentStep(4);
      setMaxUnlockedStep(4);
      return;
    }

    if (currentStep === 2 && selectedVentureKind === "quick") {
      setCurrentStep(4);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as RecordRunStep);
    }
  }

  function handleSelectVentureKind(kind: VentureKind) {
    if (kind !== selectedVentureKind) {
      setExplorationResults([]);
      setExplorationQuantityInputs({});
      setItemSearchQuery("");
      setShowAllRewards(false);
      setSelectedQuantity(null);
    }

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
    if (selectedRetainer === undefined) return;

    const venture = targetedVentures.find(
      (venture) => venture.id === ventureId,
    );

    if (venture !== undefined) {
      setSelectedQuantity(getSuggestedQuantity(venture, selectedRetainer));
    } else {
      setSelectedQuantity(null);
    }

    if (ventureId !== selectedVentureId) {
      setExplorationResults([]);
      setExplorationQuantityInputs({});
      setShowAllRewards(false);
      setItemSearchQuery("");
    }

    setSelectedVentureId(ventureId);
    setMaxUnlockedStep(4);
  }

  function handleAddExplorationResult(newResult: VentureResult) {
    setExplorationResults((previousResults) =>
      selectedVentureKind === "quick"
        ? [newResult]
        : [...previousResults, newResult],
    );

    if (selectedVentureKind === "quick") {
      setExplorationQuantityInputs({});
    }
  }

  function handleRemoveExplorationResult(index: number) {
    const itemId = explorationResults[index]?.itemId;

    if (itemId === undefined) return;

    setExplorationResults((previousResults) =>
      previousResults.filter((_, idx) => index !== idx),
    );

    setExplorationQuantityInputs((previousInputs) => {
      const { [itemId]: _removed, ...remainingInputs } = previousInputs;

      return remainingInputs;
    });
  }

  function handleUpdateExplorationQuantity(index: number, quantity: number) {
    setExplorationResults((previousResults) =>
      previousResults.map((result, idx) => {
        if (idx === index) {
          return { ...result, quantity };
        }

        return result;
      }),
    );
  }

  async function handleSaveRun() {
    if (isSaving || selectedRetainer === undefined) return;

    let newVentureRun: NewVentureRun | null = null;

    if (selectedVentureKind === "targeted") {
      const selectedVenture = targetedVentures.find(
        (venture) => venture.id === selectedVentureId,
      );

      if (selectedVenture === undefined || selectedQuantity === null) return;

      const results = [
        {
          itemId: selectedVenture.targetItemId,
          quantity: selectedQuantity,
        },
      ];

      newVentureRun = {
        retainerId: selectedRetainer.id,
        ventureId: selectedVenture.id,
        results,
      };
    }

    if (selectedVentureKind === "exploration") {
      if (!canSaveExploration) return;

      const selectedVenture = explorationVentures.find(
        (venture) => venture.id === selectedVentureId,
      );

      if (selectedVenture === undefined) return;

      newVentureRun = {
        retainerId: selectedRetainer.id,
        ventureId: selectedVenture.id,
        results: explorationResults,
      };
    }

    if (selectedVentureKind === "quick") {
      if (!canSaveExploration || explorationResults.length !== 1) return;

      newVentureRun = {
        retainerId: selectedRetainer.id,
        ventureId: quickVenture.id,
        results: explorationResults,
      };
    }

    if (newVentureRun === null) return;

    setIsSaving(true);
    setSaveError(false);

    try {
      if (editingRun !== undefined) {
        await updateVentureRun(editingRun.id, newVentureRun);
      } else {
        await addVentureRun(newVentureRun);
      }

      onClose();
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  }

  function getAvailableVentures() {
    if (selectedRetainer === undefined) return [];

    switch (selectedVentureKind) {
      case "targeted":
        return targetedVentures.filter(
          (venture) =>
            venture.retainerType === selectedRetainer.retainerType &&
            (selectedRetainer.level === undefined ||
              venture.requiredLevel <= selectedRetainer.level),
        );

      case "exploration":
        return explorationVentures.filter(
          (venture) =>
            venture.retainerType === selectedRetainer.retainerType &&
            (selectedRetainer.level === undefined ||
              venture.requiredLevel <= selectedRetainer.level),
        );

      case "quick":
        return [quickVenture];

      default:
        return [];
    }
  }

  function renderItemSearch() {
    return (
      <div className="record-run-search-section">
        <label className="record-run-step-hint" htmlFor="searchInput">
          {t("recordRun.rewards.searchLabel")}
        </label>
        <input
          className="record-run-item-search"
          type="search"
          id="searchInput"
          value={itemSearchQuery}
          onChange={(event) => setItemSearchQuery(event.target.value)}
          placeholder={t("recordRun.rewards.searchPlaceholder")}
        />

        {searchResults.length > 0 && (
          <ul ref={searchResultsRef} className="record-run-search-results">
            {searchResults.map((searchResult) => {
              const isAlreadyAdded = explorationResults.some(
                (result) => result.itemId === searchResult.id,
              );

              return (
                <li key={searchResult.id}>
                  <button
                    className="record-run-search-result"
                    type="button"
                    onClick={() => {
                      handleAddExplorationResult({
                        itemId: searchResult.id,
                        quantity: 1,
                      });

                      setItemSearchQuery("");
                    }}
                    disabled={isAlreadyAdded}
                  >
                    {searchResult.iconId !== undefined && (
                      <ItemIconStack iconIds={[searchResult.iconId]} />
                    )}

                    {searchResult.name[language === "fr" ? "fr" : "en"]}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  function renderSelectedResult(result: VentureResult) {
    const item = itemsById.get(result.itemId);

    const resultIndex = explorationResults.findIndex(
      (entry) => entry.itemId === result.itemId,
    );

    return (
      <div className="record-run-reward-card" key={result.itemId}>
        {item?.iconId !== undefined && (
          <ItemIconStack iconIds={[item.iconId]} />
        )}

        <span className="record-run-result-name">
          {item?.name[language === "fr" ? "fr" : "en"]}
        </span>

        <input
          className="record-run-reward-quantity"
          type="number"
          min={1}
          step={1}
          value={
            explorationQuantityInputs[result.itemId] ?? String(result.quantity)
          }
          onChange={(event) => {
            setExplorationQuantityInputs((previousInputs) => ({
              ...previousInputs,
              [result.itemId]: event.target.value,
            }));

            const inputValue = event.target.value;
            const quantity = Number(inputValue);

            if (Number.isInteger(quantity) && quantity > 0) {
              handleUpdateExplorationQuantity(resultIndex, quantity);
            }
          }}
          aria-label={t("recordRun.quantities.itemLabel", {
            itemLabel:
              item?.name[language === "fr" ? "fr" : "en"] ??
              String(result.itemId),
          })}
        />

        <button
          className="record-run-result-remove"
          type="button"
          onClick={() => handleRemoveExplorationResult(resultIndex)}
          aria-label={t("recordRun.rewards.removeItem", {
            itemName:
              item?.name[language === "fr" ? "fr" : "en"] ??
              String(result.itemId),
          })}
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    );
  }

  function renderRetainerSelection() {
    return (
      <>
        <p className="record-run-step-hint">
          {t("recordRun.selectRetainerHint")}
        </p>

        {initialVenture !== undefined && initialVenture.kind !== "quick" && (
          <p className="record-run-filter-hint">
            {t("recordRun.compatibleRetainersHint")}
          </p>
        )}

        {retainers.length === 0 ? (
          <p className="record-run-filter-hint">
            {t("recordRun.noActiveRetainers")}
          </p>
        ) : retainersToDisplay.length === 0 ? (
          <p className="record-run-filter-hint">
            {t("recordRun.noCompatibleRetainers")}
          </p>
        ) : (
          <div className="record-run-retainers">
            {retainersToDisplay.map((candidate) => {
              const isSelected = candidate.id === selectedRetainerId;

              return (
                <button
                  key={candidate.id}
                  type="button"
                  className="record-run-retainer"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedRetainerId(candidate.id);
                    if (initialVenture !== undefined) {
                      setMaxUnlockedStep(4);
                    }
                    if (initialVenture?.kind === "targeted") {
                      setSelectedQuantity(
                        getSuggestedQuantity(initialVenture, candidate),
                      );
                    }
                  }}
                  disabled={retainer !== undefined && editingRun === undefined}
                >
                  <div
                    className="retainer-avatar"
                    data-color={avatarColors.get(candidate.id) ?? 1}
                    aria-hidden="true"
                  >
                    {getRetainerInitials(candidate.name)}
                  </div>

                  <div className="retainer-card-identity">
                    <span className="retainer-card-name" title={candidate.name}>
                      {candidate.name}
                    </span>

                    <span className="retainer-card-subtitle">
                      {t(`retainerTypes.${candidate.retainerType}`)}
                      {candidate.level !== undefined && (
                        <>
                          {" · "}
                          {t("myRetainers.level")}{" "}
                          {numberFormatter.format(candidate.level)}
                        </>
                      )}
                    </span>
                  </div>

                  {isSelected && (
                    <Check
                      className="record-run-retainer-check"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </>
    );
  }

  function renderStepContent() {
    if (currentStep === 1) return renderRetainerSelection();

    if (selectedRetainer === undefined) return null;

    switch (currentStep) {
      case 2:
        return (
          <>
            <p className="record-run-step-hint">
              <Trans
                i18nKey="recordRun.selectVentureKindHint"
                values={{ name: selectedRetainer.name }}
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
                    values={{ name: selectedRetainer.name }}
                    components={{ bold: <strong /> }}
                  />
                </p>

                {selectedRetainer.level !== undefined && (
                  <p className="record-run-filter-hint">
                    {t("recordRun.levelFilterHint", {
                      level: selectedRetainer.level,
                    })}
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
                      ? getRequirementStatus(
                          venture.requirement,
                          selectedRetainer,
                        )
                      : "unknown";

                  const currentStat =
                    selectedRetainer.retainerType === "combat"
                      ? selectedRetainer.itemLevel
                      : selectedRetainer.gathering;

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
        if (selectedVentureKind === "targeted") {
          const selectedVenture = targetedVentures.find(
            (venture) => venture.id === selectedVentureId,
          );

          if (selectedVenture === undefined) return null;

          const targetItem = itemsById.get(selectedVenture.targetItemId);

          return (
            <div>
              <p className="record-run-step-hint">
                {t(`recordRun.quantities.${selectedVentureKind}`, {
                  retainerName: selectedRetainer.name,
                })}
              </p>

              <div className="record-run-result-item">
                <ItemIconStack
                  iconIds={getVentureDisplayIconIds(
                    selectedVenture,
                    itemsById,
                    ventureRewards,
                  )}
                />

                <span className="record-run-result-name">
                  {targetItem?.name[language === "fr" ? "fr" : "en"] ?? ""}
                </span>
              </div>

              <div className="record-run-quantities">
                {selectedVenture.quantities.map((quantity) => (
                  <button
                    className="record-run-quantity-button"
                    key={quantity}
                    type="button"
                    onClick={() => setSelectedQuantity(quantity)}
                    aria-pressed={selectedQuantity === quantity}
                  >
                    {quantity}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        if (selectedVentureKind === "exploration") {
          const selectedVenture = explorationVentures.find(
            (venture) => venture.id === selectedVentureId,
          );

          if (selectedVenture === undefined) return null;

          const rewards =
            ventureRewards.rewardsByRetainerTaskRandomId[
              selectedVenture.retainerTaskRandomId
            ];

          const knownRewardItemIds =
            rewards === undefined ? [] : getKnownRewardItemIds(rewards);

          const firstRewards = knownRewardItemIds.slice(0, 6);

          const additionalSelectedRewards = knownRewardItemIds.filter(
            (itemId) => {
              const isSelected = explorationResults.some(
                (result) => result.itemId === itemId,
              );

              const inFirstRewards = firstRewards.includes(itemId);

              return isSelected && !inFirstRewards;
            },
          );

          const rewardsToShow = showAllRewards
            ? knownRewardItemIds
            : [...firstRewards, ...additionalSelectedRewards];

          const otherResults = explorationResults.filter(
            (result) => !knownRewardItemIds.includes(result.itemId),
          );

          const unrecognizedResults =
            rewards === undefined
              ? []
              : explorationResults.filter(
                  (result) => !isKnownVentureReward(rewards, result.itemId),
                );

          return (
            <div>
              <p className="record-run-step-hint">
                {t("recordRun.quantities.other", {
                  retainerName: selectedRetainer.name,
                })}
              </p>

              <div className="record-run-rewards-grid">
                {rewardsToShow.map((itemId) => {
                  const item = itemsById.get(itemId);

                  const resultIndex = explorationResults.findIndex(
                    (result) => result.itemId === itemId,
                  );

                  const isAdded = resultIndex !== -1;

                  const result = isAdded
                    ? explorationResults[resultIndex]
                    : undefined;

                  return (
                    <div className="record-run-reward-card" key={itemId}>
                      <button
                        className="record-run-reward-button"
                        type="button"
                        onClick={() => {
                          if (!isAdded) {
                            handleAddExplorationResult({ itemId, quantity: 1 });
                          } else {
                            if (resultIndex !== -1)
                              handleRemoveExplorationResult(resultIndex);
                          }
                        }}
                        aria-pressed={isAdded}
                      >
                        {item?.iconId !== undefined && (
                          <ItemIconStack iconIds={[item.iconId]} />
                        )}

                        {item?.name[language === "fr" ? "fr" : "en"]}
                      </button>

                      {result !== undefined && (
                        <input
                          className="record-run-reward-quantity"
                          aria-label={t("recordRun.quantities.itemLabel", {
                            itemLabel:
                              item?.name[language === "fr" ? "fr" : "en"] ??
                              itemId,
                          })}
                          type="number"
                          min={1}
                          step={1}
                          value={
                            explorationQuantityInputs[result.itemId] ??
                            String(result.quantity)
                          }
                          onChange={(event) => {
                            setExplorationQuantityInputs((previousInputs) => ({
                              ...previousInputs,
                              [result.itemId]: event.target.value,
                            }));

                            const inputValue = event.target.value;
                            const quantity = Number(inputValue);

                            if (Number.isInteger(quantity) && quantity > 0) {
                              handleUpdateExplorationQuantity(
                                resultIndex,
                                quantity,
                              );
                            }
                          }}
                        />
                      )}

                      {isAdded && (
                        <Check
                          className="record-run-reward-check"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {knownRewardItemIds.length > 6 && (
                <button
                  className="record-run-show-more"
                  type="button"
                  onClick={() => {
                    setShowAllRewards((previous) => !previous);
                  }}
                >
                  {showAllRewards
                    ? t("recordRun.rewards.showLess")
                    : t("recordRun.rewards.showMore")}
                </button>
              )}

              {renderItemSearch()}

              {otherResults.length > 0 && (
                <div className="record-run-rewards-grid record-run-other-results">
                  {otherResults.map(renderSelectedResult)}
                </div>
              )}

              {unrecognizedResults.length > 0 && (
                <p className="record-run-step-hint record-run-reward-warning">
                  {t("recordRun.rewards.unrecognizedWarning", {
                    count: unrecognizedResults.length,
                  })}
                </p>
              )}
            </div>
          );
        }

        if (selectedVentureKind === "quick") {
          return (
            <div>
              <p className="record-run-step-hint">
                {t("recordRun.quantities.other", {
                  retainerName: selectedRetainer.name,
                })}
              </p>

              {renderItemSearch()}

              {explorationResults.length > 0 && (
                <div className="record-run-rewards-grid record-run-other-results">
                  {explorationResults.map(renderSelectedResult)}
                </div>
              )}
            </div>
          );
        }
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
        <h2 id="record-run-title">
          {editingRun
            ? t("myRetainers.editRunTitle")
            : t("myRetainers.recordRunTitle")}
        </h2>

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
        {steps.map((step) => {
          const isSkippedStep =
            retainer === undefined &&
            initialVenture !== undefined &&
            (step.id === 2 || step.id === 3);

          return (
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
                (selectedVentureKind === "quick" && step.id === 3) ||
                isSkippedStep
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
          );
        })}
      </nav>

      <div className="record-run-content">
        <div key={currentStep} className="record-run-step-panel">
          {renderStepContent()}
        </div>
      </div>

      {saveError && (
        <p className="form-error" role="alert">
          {t("recordRun.saveError")}
        </p>
      )}

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
          onClick={() => (currentStep < 4 ? handleNextStep() : handleSaveRun())}
          disabled={
            (currentStep === 1 && selectedRetainer === undefined) ||
            (currentStep >= maxUnlockedStep && currentStep < 4) ||
            (currentStep === 4 &&
              selectedVentureKind === "targeted" &&
              selectedQuantity === null) ||
            isSaving ||
            (currentStep === 4 &&
              (selectedVentureKind === "exploration" ||
                selectedVentureKind === "quick") &&
              !canSaveExploration)
          }
        >
          {currentStep === 4 ? t("navigation.save") : t("navigation.continue")}
        </button>
      </div>
    </dialog>
  );
}
