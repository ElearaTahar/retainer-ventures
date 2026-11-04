import { VentureRun } from "./ventureRuns";

type ItemHistoryStats = {
  occurrences: number;
  totalQuantity: number;
};

export type VentureHistorySummary = {
  total: number;
  byRetainer: Map<number, number>;
  itemsHistory: Map<number, ItemHistoryStats>;
};

export type VentureHistoryById = Map<number, VentureHistorySummary>;

export function buildVenturesHistory(
  ventureRuns: VentureRun[],
): VentureHistoryById {
  const venturesHistory: VentureHistoryById = new Map<
    number,
    VentureHistorySummary
  >();

  ventureRuns.forEach((run) => {
    let ventureHistory = venturesHistory.get(run.ventureId);

    if (ventureHistory === undefined) {
      ventureHistory = {
        total: 0,
        byRetainer: new Map<number, number>(),
        itemsHistory: new Map<number, ItemHistoryStats>(),
      };

      venturesHistory.set(run.ventureId, ventureHistory);
    }

    ventureHistory.total += 1;

    const ventureNumberByRetainer =
      ventureHistory.byRetainer.get(run.retainerId) ?? 0;
    ventureHistory.byRetainer.set(run.retainerId, ventureNumberByRetainer + 1);

    run.results.forEach((item) => {
      let itemHistory = ventureHistory.itemsHistory.get(item.itemId);

      if (itemHistory === undefined) {
        itemHistory = {
          occurrences: 0,
          totalQuantity: 0,
        };

        ventureHistory.itemsHistory.set(item.itemId, itemHistory);
      }

      itemHistory.occurrences += 1;
      itemHistory.totalQuantity += item.quantity;
    });
  });

  return venturesHistory;
}
