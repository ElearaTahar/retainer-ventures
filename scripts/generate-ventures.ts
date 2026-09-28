import { writeFile } from "node:fs/promises";

const XIVAPI_BASE_URL = "https://v2.xivapi.com/api";

type RetainerType = "combat" | "miner" | "botanist" | "fisher";

type VentureKind = "targeted" | "exploration" | "quick";

type TargetedCategory = "hunting" | "mining" | "botany" | "fishing";

type ExplorationCategory =
  | "field-exploration"
  | "highland-exploration"
  | "woodland-exploration"
  | "waterside-exploration";

type RetainerTaskNormalRef = {
  value: number;
  sheet: "RetainerTaskNormal";
  row_id: number;
  fields: {
    Item: {
      value: number;
    };
    Quantity: number[];
  };
};

type RetainerTaskRandomRef = {
  value: number;
  sheet: "RetainerTaskRandom";
  row_id: number;
  fields: {
    Name: string;
    Requirement: number;
  };
};

type RetainerTaskRef = RetainerTaskNormalRef | RetainerTaskRandomRef;

type RetainerTaskResponse = {
  row_id: number;
  fields: {
    ClassJobCategory: {
      value: number;
    };
    Experience: number;
    IsRandom: boolean;
    MaxTimemin: number;
    RequiredGathering: number;
    RequiredItemLevel: number;
    RetainerLevel: number;
    VentureCost: number;
    Task: RetainerTaskRef;
    RetainerTaskParameter: {
      value: number;
      row_id: number;
      fields: {
        ItemLevelDoW: number[];
        PerceptionDoL: number[];
        PerceptionFSH: number[];
      };
    };
  };
};

type RetainerTaskCollectionResponse = {
  schema: string;
  version: string;
  rows: RetainerTaskResponse[];
};

function getRetainerType(classJobCategoryId: number): RetainerType {
  switch (classJobCategoryId) {
    case 17:
      return "miner";
    case 18:
      return "botanist";
    case 19:
      return "fisher";
    case 34:
      return "combat";
    default:
      throw new Error(
        `Unknown retainer classJobCategoryId: ${classJobCategoryId}`,
      );
  }
}

function getVentureKind(
  isRandom: boolean,
  classJobCategoryId: number,
): VentureKind {
  if (!isRandom) return "targeted";
  switch (classJobCategoryId) {
    case 0:
      return "quick";
    case 17:
    case 18:
    case 19:
    case 34:
      return "exploration";
    default:
      throw new Error(
        `Unknown ClassJobCategory for venture: ${classJobCategoryId}`,
      );
  }
}

function getTargetedCategory(retainerType: RetainerType): TargetedCategory {
  switch (retainerType) {
    case "combat":
      return "hunting";
    case "miner":
      return "mining";
    case "botanist":
      return "botany";
    case "fisher":
      return "fishing";
    default:
      throw new Error(
        `Unknown retainerType for targeted venture: ${retainerType}`,
      );
  }
}

function getExplorationCategory(
  retainerType: RetainerType,
): ExplorationCategory {
  switch (retainerType) {
    case "combat":
      return "field-exploration";
    case "miner":
      return "highland-exploration";
    case "botanist":
      return "woodland-exploration";
    case "fisher":
      return "waterside-exploration";
    default:
      throw new Error(
        `Unknown retainerType for exploration venture: ${retainerType}`,
      );
  }
}

type Requirement =
  | {
      type: "item-level";
      value: number;
    }
  | {
      type: "gathering";
      value: number;
    };

type YieldStat = "item-level" | "perception";

type TargetedVenture = {
  id: number;
  kind: "targeted";
  retainerType: RetainerType;
  category: TargetedCategory;
  requiredLevel: number;
  durationMinutes: number;
  ventureCost: number;
  experience: number;
  targetItemId: number;
  quantities: number[];
  requirement: Requirement;
  yieldStat: YieldStat;
  thresholds: number[];
};

function getTargetedStats(
  data: RetainerTaskResponse,
  retainerType: RetainerType,
): {
  requirement: Requirement;
  yieldStat: YieldStat;
  thresholds: number[];
} {
  switch (retainerType) {
    case "combat":
      return {
        requirement: {
          type: "item-level",
          value: data.fields.RequiredItemLevel,
        },
        yieldStat: "item-level",
        thresholds: data.fields.RetainerTaskParameter.fields.ItemLevelDoW,
      };
    case "fisher":
      return {
        requirement: {
          type: "gathering",
          value: data.fields.RequiredGathering,
        },
        yieldStat: "perception",
        thresholds: data.fields.RetainerTaskParameter.fields.PerceptionFSH,
      };
    case "miner":
    case "botanist":
      return {
        requirement: {
          type: "gathering",
          value: data.fields.RequiredGathering,
        },
        yieldStat: "perception",
        thresholds: data.fields.RetainerTaskParameter.fields.PerceptionDoL,
      };
    default:
      throw new Error(
        `Unknown retainerType for targeted stats: ${retainerType}`,
      );
  }
}

function toTargetedVenture(data: RetainerTaskResponse): TargetedVenture {
  const sheet = data.fields.Task.sheet;
  const classJobCategoryId = data.fields.ClassJobCategory.value;
  const ventureKind = getVentureKind(data.fields.IsRandom, classJobCategoryId);

  if (sheet === "RetainerTaskNormal" && ventureKind === "targeted") {
    const retainerType = getRetainerType(classJobCategoryId);
    const category = getTargetedCategory(retainerType);
    const stats = getTargetedStats(data, retainerType);

    const quantities = data.fields.Task.fields.Quantity;
    const thresholds = stats.thresholds;

    if (quantities.length !== 5) {
      throw new Error(
        `row id ${data.row_id}: quantities length = ${quantities.length}`,
      );
    }
    if (thresholds.length !== 4) {
      throw new Error(
        `row id ${data.row_id}: thresholds length = ${thresholds.length}`,
      );
    }

    return {
      id: data.row_id,
      kind: "targeted",
      retainerType,
      category,
      requiredLevel: data.fields.RetainerLevel,
      durationMinutes: data.fields.MaxTimemin,
      ventureCost: data.fields.VentureCost,
      experience: data.fields.Experience,
      targetItemId: data.fields.Task.fields.Item.value,
      quantities,
      requirement: stats.requirement,
      yieldStat: stats.yieldStat,
      thresholds,
    };
  }

  throw new Error(
    `row id ${data.row_id} with ${ventureKind} ventureKind and ${sheet} sheet is not a targeted venture`,
  );
}

type ExplorationVenture = {
  id: number;
  kind: "exploration";
  retainerType: RetainerType;
  category: ExplorationCategory;
  retainerTaskRandomId: number;
  name: string;
  requiredLevel: number;
  durationMinutes: number;
  ventureCost: number;
  experience: number;
  requirement: Requirement;
};

function toExplorationVenture(data: RetainerTaskResponse): ExplorationVenture {
  const sheet = data.fields.Task.sheet;
  const classJobCategoryId = data.fields.ClassJobCategory.value;
  const ventureKind = getVentureKind(data.fields.IsRandom, classJobCategoryId);

  if (sheet === "RetainerTaskRandom" && ventureKind === "exploration") {
    const retainerType = getRetainerType(classJobCategoryId);
    const category = getExplorationCategory(retainerType);

    const requirement: Requirement =
      retainerType === "combat"
        ? {
            type: "item-level",
            value: data.fields.RequiredItemLevel,
          }
        : {
            type: "gathering",
            value: data.fields.RequiredGathering,
          };

    return {
      id: data.row_id,
      kind: "exploration",
      retainerType,
      category,
      retainerTaskRandomId: data.fields.Task.row_id,
      name: data.fields.Task.fields.Name,
      requiredLevel: data.fields.RetainerLevel,
      durationMinutes: data.fields.MaxTimemin,
      ventureCost: data.fields.VentureCost,
      experience: data.fields.Experience,
      requirement,
    };
  }

  throw new Error(
    `row id ${data.row_id} with ${ventureKind} ventureKind and ${sheet} sheet is not an exploration venture`,
  );
}

type QuickExploration = {
  id: number;
  kind: "quick";
  retainerTaskRandomId: number;
  name: string;
  durationMinutes: number;
  ventureCost: number;
};

function toQuickExploration(data: RetainerTaskResponse): QuickExploration {
  const sheet = data.fields.Task.sheet;
  const classJobCategoryId = data.fields.ClassJobCategory.value;
  const ventureKind = getVentureKind(data.fields.IsRandom, classJobCategoryId);

  if (sheet === "RetainerTaskRandom" && ventureKind === "quick") {
    if (data.fields.RetainerLevel !== 0 || data.fields.Experience !== -1) {
      throw new Error(
        `quick exploration ${data.row_id}: expected RetainerLevel=0 and Experience=-1, got RetainerLevel=${data.fields.RetainerLevel}, Experience=${data.fields.Experience}`,
      );
    }

    return {
      id: data.row_id,
      kind: "quick",
      retainerTaskRandomId: data.fields.Task.row_id,
      name: data.fields.Task.fields.Name,
      durationMinutes: data.fields.MaxTimemin,
      ventureCost: data.fields.VentureCost,
    };
  }

  throw new Error(
    `row id ${data.row_id} with ${ventureKind} ventureKind and ${sheet} sheet is not a quick exploration`,
  );
}

type Venture = TargetedVenture | ExplorationVenture | QuickExploration;

function toVenture(data: RetainerTaskResponse): Venture {
  const classJobCategoryId = data.fields.ClassJobCategory.value;
  const ventureKind = getVentureKind(data.fields.IsRandom, classJobCategoryId);

  switch (ventureKind) {
    case "targeted":
      return toTargetedVenture(data);
    case "exploration":
      return toExplorationVenture(data);
    case "quick":
      return toQuickExploration(data);
    default:
      throw new Error(
        `venture ${data.row_id}: unknown venture kind ${ventureKind}`,
      );
  }
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `XIVAPI request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

async function fetchAllRetainerTasks(
  fieldsParam: string,
): Promise<RetainerTaskResponse[]> {
  const rows: RetainerTaskResponse[] = [];
  let after: number | undefined;

  while (true) {
    let url =
      `${XIVAPI_BASE_URL}/sheet/RetainerTask` +
      `?limit=500&fields=${fieldsParam}`;

    if (after !== undefined) {
      url += `&after=${after}`;
    }

    const data = await fetchJSON<RetainerTaskCollectionResponse>(url);
    const lastRow = data.rows[data.rows.length - 1];

    if (!lastRow) {
      break;
    }

    rows.push(...data.rows);
    after = lastRow.row_id;
  }

  return rows;
}

async function main() {
  const fields = [
    "ClassJobCategory",
    "Experience",
    "IsRandom",
    "MaxTimemin",
    "RequiredGathering",
    "RequiredItemLevel",
    "RetainerLevel",
    "VentureCost",
    "Task",
    "RetainerTaskParameter",
  ];
  const fieldsParam = fields.join(",");

  const rows = await fetchAllRetainerTasks(fieldsParam);

  const ventures = rows
    .filter((row) => row.fields.Task.row_id !== 0)
    .map(toVenture);

  const targeted = ventures.filter((venture) => venture.kind === "targeted");

  const exploration = ventures.filter(
    (venture) => venture.kind === "exploration",
  );

  const quickVentures = ventures.filter((venture) => venture.kind === "quick");

  if (exploration.length !== 124) {
    throw new Error(
      `Expected 124 exploration ventures, got ${exploration.length}`,
    );
  }

  if (quickVentures.length !== 1) {
    throw new Error(
      `Expected 1 Quick Exploration, got ${quickVentures.length}`,
    );
  }

  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      counts: {
        targeted: targeted.length,
        exploration: exploration.length,
        quick: quickVentures.length,
      },
    },
    targeted,
    exploration,
    quick: quickVentures[0],
  };

  const json = JSON.stringify(output, null, 2);
  await writeFile("data/ventures.json", json, "utf-8");
}

main();
