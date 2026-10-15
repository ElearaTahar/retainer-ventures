export type VentureResult = {
  itemId: number;
  quantity: number;
};

export type VentureRun = {
  id: number;
  retainerId: number;
  ventureId: number;
  completedAt: number;
  results: VentureResult[];
};

export type NewVentureRun = Omit<VentureRun, "id" | "completedAt">;
