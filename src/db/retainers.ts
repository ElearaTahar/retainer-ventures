import type { NewRetainer } from "../types/retainers";
import { db } from "./database";

export async function createRetainer(retainer: NewRetainer): Promise<number> {
  return await db.retainers.add({ ...retainer, status: "active" });
}
