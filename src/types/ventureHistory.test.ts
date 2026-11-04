import { describe, it, expect } from "vitest";
import { buildVenturesHistory } from "./ventureHistory";
import { VentureRun } from "./ventureRuns";

describe("buildVenturesHistory", () => {
  it("should return an empty history when no run are recorded", () => {
    const ventureRuns: VentureRun[] = [];

    const history = buildVenturesHistory(ventureRuns);

    expect(history.size).toBe(0);
  });

  it("should aggregate several runs of the same venture", () => {
    const ventureRuns: VentureRun[] = [];
    [1, 2].forEach((id) => {
      ventureRuns.push({
        id,
        retainerId: 1,
        ventureId: 42,
        completedAt: Date.now(),
        results: [],
      });
    });

    const history = buildVenturesHistory(ventureRuns);

    expect(history.size).toBe(1);
    expect(history.get(42)?.total).toBe(2);
  });

  it("should aggregate runs by retainer for a venture ID", () => {
    const ventureRuns: VentureRun[] = [];
    [1, 2].forEach((id) => {
      ventureRuns.push({
        id,
        retainerId: 1,
        ventureId: 42,
        completedAt: Date.now(),
        results: [],
      });
    });

    const history = buildVenturesHistory(ventureRuns);

    expect(history.size).toBe(1);
    expect(history.get(42)?.byRetainer.get(1)).toBe(2);
  });

  it("should aggregate runs for several retainers and the same venture ID", () => {
    const ventureRuns: VentureRun[] = [
      {
        id: 1,
        retainerId: 1,
        ventureId: 42,
        completedAt: Date.now(),
        results: [],
      },
      {
        id: 2,
        retainerId: 1,
        ventureId: 42,
        completedAt: Date.now(),
        results: [],
      },
      {
        id: 3,
        retainerId: 3,
        ventureId: 42,
        completedAt: Date.now(),
        results: [],
      },
    ];

    const history = buildVenturesHistory(ventureRuns);

    expect(history.size).toBe(1);
    expect(history.get(42)?.byRetainer.size).toBe(2);
    expect(history.get(42)?.total).toBe(3);
    expect(history.get(42)?.byRetainer.get(1)).toBe(2);
    expect(history.get(42)?.byRetainer.get(3)).toBe(1);
  });

  it("should aggregate items occurrences and quantities", () => {
    const ventureRuns: VentureRun[] = [
      {
        id: 1,
        retainerId: 1,
        ventureId: 42,
        completedAt: Date.now(),
        results: [
          {
            itemId: 100,
            quantity: 5,
          },
          {
            itemId: 200,
            quantity: 2,
          },
        ],
      },
      {
        id: 2,
        retainerId: 3,
        ventureId: 42,
        completedAt: Date.now(),
        results: [
          {
            itemId: 100,
            quantity: 3,
          },
        ],
      },
    ];

    const history = buildVenturesHistory(ventureRuns);

    expect(history.size).toBe(1);
    expect(history.get(42)?.itemsHistory.size).toBe(2);
    expect(history.get(42)?.itemsHistory.get(100)?.occurrences).toBe(2);
    expect(history.get(42)?.itemsHistory.get(100)?.totalQuantity).toBe(8);
    expect(history.get(42)?.itemsHistory.get(200)?.occurrences).toBe(1);
    expect(history.get(42)?.itemsHistory.get(200)?.totalQuantity).toBe(2);
  });

  it("should aggregate items occurrences and quantities by ventures", () => {
    const ventureRuns: VentureRun[] = [
      {
        id: 1,
        retainerId: 1,
        ventureId: 42,
        completedAt: Date.now(),
        results: [
          {
            itemId: 100,
            quantity: 5,
          },
        ],
      },
      {
        id: 2,
        retainerId: 1,
        ventureId: 43,
        completedAt: Date.now(),
        results: [
          {
            itemId: 100,
            quantity: 3,
          },
        ],
      },
    ];

    const history = buildVenturesHistory(ventureRuns);

    expect(history.size).toBe(2);
    expect(history.get(42)?.itemsHistory.size).toBe(1);
    expect(history.get(43)?.itemsHistory.size).toBe(1);
    expect(history.get(42)?.itemsHistory.get(100)?.occurrences).toBe(1);
    expect(history.get(42)?.itemsHistory.get(100)?.totalQuantity).toBe(5);
    expect(history.get(43)?.itemsHistory.get(100)?.occurrences).toBe(1);
    expect(history.get(43)?.itemsHistory.get(100)?.totalQuantity).toBe(3);
  });
});
