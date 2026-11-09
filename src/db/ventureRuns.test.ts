import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { db } from "./database";
import { addVentureRun, updateVentureRun } from "./ventureRuns";
import { createRetainer } from "./retainers";

describe("ventureRuns", () => {
  beforeEach(async () => {
    await db.ventureRuns.clear();
    await db.retainers.clear();
  });

  it("updates a venture run without changing its id or completion date", async () => {
    const retainerId1 = await createRetainer({
      name: "Retainer 1",
      level: 100,
      retainerType: "combat",
    });
    const retainerId2 = await createRetainer({
      name: "Retainer 2",
      level: 99,
      retainerType: "combat",
    });

    const initialRun = {
      retainerId: retainerId1,
      ventureId: 100,
      results: [{ itemId: 10, quantity: 5 }],
    };

    const changes = {
      retainerId: retainerId2,
      ventureId: 200,
      results: [{ itemId: 20, quantity: 10 }],
    };

    const runId = await addVentureRun(initialRun);

    const run = await db.ventureRuns.get(runId);
    expect(run).toMatchObject(initialRun);

    await updateVentureRun(runId, changes);
    const updatedRun = await db.ventureRuns.get(runId);
    expect(updatedRun).toMatchObject(changes);
    expect(updatedRun?.id).toBe(runId);
    expect(updatedRun?.completedAt).toBe(run?.completedAt);
  });

  it("throws an error when the venture run does not exist", async () => {
    const changes = {
      retainerId: 1,
      ventureId: 200,
      results: [{ itemId: 20, quantity: 10 }],
    };

    await expect(updateVentureRun(-1, changes)).rejects.toThrow(
      "Venture run not found",
    );
  });
});
