import { Dexie, type EntityTable } from "dexie";
import type { Retainer } from "../types/retainers";

class AppDatabase extends Dexie {
  retainers!: EntityTable<Retainer, "id">;

  constructor() {
    super("RetainersDB");
    this.version(1).stores({
      retainers: "++id",
    });
  }
}

export const db = new AppDatabase();
