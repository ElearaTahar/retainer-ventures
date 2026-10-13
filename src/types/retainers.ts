type RetainerStatus = "active" | "archived";

type RetainerIdentity = {
  id: number;
  name: string;
  status: RetainerStatus;
  level?: number;
};

type CombatRetainer = {
  retainerType: "combat";
  itemLevel?: number;
};

type GatheringRetainer = {
  retainerType: "miner" | "botanist" | "fisher";
  gathering?: number;
  perception?: number;
};

export type Retainer = RetainerIdentity & (CombatRetainer | GatheringRetainer);

export type NewRetainer = Omit<RetainerIdentity, "id" | "status"> &
  (CombatRetainer | GatheringRetainer);
