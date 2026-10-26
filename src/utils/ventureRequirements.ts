import type { Retainer } from "../types/retainers";
import type { Requirement } from "../types/ventures";

export type RequirementStatus = "met" | "unmet" | "unknown";

export function getRequirementStatus(
  requirement: Requirement,
  retainer: Retainer,
): RequirementStatus {
  if (requirement.type === "item-level") {
    if (retainer.retainerType !== "combat") {
      return "unknown";
    }

    if (retainer.itemLevel === undefined) {
      return "unknown";
    }

    return retainer.itemLevel >= requirement.value ? "met" : "unmet";
  }

  if (retainer.retainerType === "combat") {
    return "unknown";
  }

  if (retainer.gathering === undefined) {
    return "unknown";
  }

  return retainer.gathering >= requirement.value ? "met" : "unmet";
}
