import type { NewRetainer } from "../types/retainers";
import { db } from "./database";

type RetainerChanges = NewRetainer & {
  itemLevel?: number;
  gathering?: number;
  perception?: number;
};

export async function createRetainer(retainer: NewRetainer): Promise<number> {
  return await db.retainers.add({ ...retainer, status: "active" });
}

export async function updateRetainer(
  id: number,
  changes: NewRetainer,
): Promise<number> {
  let updatedChanges: RetainerChanges;

  if (changes.retainerType === "combat") {
    updatedChanges = {
      ...changes,
      gathering: undefined,
      perception: undefined,
    };
  } else {
    updatedChanges = {
      ...changes,
      itemLevel: undefined,
    };
  }

  const result = await db.retainers.update(id, updatedChanges);

  if (result === 0) {
    throw new Error("Retainer not found");
  }

  return result;
}
