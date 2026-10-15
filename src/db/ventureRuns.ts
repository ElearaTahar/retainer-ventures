import type { NewVentureRun } from "../types/ventureRuns";
import { db } from "./database";

export async function addVentureRun(
  ventureRun: NewVentureRun,
): Promise<number> {
  if (ventureRun.results.length === 0) {
    throw new Error("Results must not be empty");
  }

  const invalidResult = ventureRun.results.find(
    (result) => !Number.isInteger(result.quantity) || result.quantity <= 0,
  );

  if (invalidResult !== undefined) {
    throw new Error("Results must have a positive quantity");
  }

  return db.transaction("rw", db.retainers, db.ventureRuns, async () => {
    const retainer = await db.retainers.get(ventureRun.retainerId);

    if (retainer === undefined) {
      throw new Error("Retainer not found");
    }

    return await db.ventureRuns.add({ ...ventureRun, completedAt: Date.now() });
  });
}
