import { Dexie, type EntityTable } from "dexie";
import type { Retainer } from "../types/retainers";
import type { VentureRun } from "../types/ventureRuns";

class AppDatabase extends Dexie {
  retainers!: EntityTable<Retainer, "id">;
  ventureRuns!: EntityTable<VentureRun, "id">;

  constructor() {
    super("RetainersDB");
    this.version(1).stores({
      retainers: "++id, name, status",
      ventureRuns: "++id, retainerId, completedAt",
    });
  }
}

export const db = new AppDatabase();
