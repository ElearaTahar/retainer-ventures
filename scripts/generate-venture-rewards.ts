import { readFile, writeFile } from "node:fs/promises";

const RETAINER_VENTURE_ITEM_URL =
  "https://raw.githubusercontent.com/Critical-Impact/LuminaSupplemental/main/src/LuminaSupplemental.Excel/Generated/RetainerVentureItem.csv";

const FFXIV_DATAMINING_BASE_URL =
  "https://raw.githubusercontent.com/xivapi/ffxiv-datamining/master/csv/en";

const RECIPE_URL = `${FFXIV_DATAMINING_BASE_URL}/Recipe.csv`;

const GATHERING_ITEM_URL = `${FFXIV_DATAMINING_BASE_URL}/GatheringItem.csv`;

const GATHERING_POINT_BASE_URL = `${FFXIV_DATAMINING_BASE_URL}/GatheringPointBase.csv`;

const FISH_PARAMETER_URL = `${FFXIV_DATAMINING_BASE_URL}/FishParameter.csv`;

const SPEARFISHING_ITEM_URL = `${FFXIV_DATAMINING_BASE_URL}/SpearfishingItem.csv`;

const ITEM_URL = `${FFXIV_DATAMINING_BASE_URL}/Item.csv`;

const MINION_ITEM_UI_CATEGORY_ID = 81;

const ALLAGAN_PIECE_ITEM_IDS = new Set([
  5824, // Allagan Bronze Piece
  5825, // Allagan Silver Piece
]);

type RetainerType = "combat" | "miner" | "botanist" | "fisher";

type RetainerVentureItem = {
  itemId: number;
  retainerTaskRandomId: number;
};

type VentureRewards = {
  allaganPieces: number[];
  minions: number[];
  jobItems: number[];
  otherItems: number[];
};

type ExplorationVenture = {
  kind: "exploration";
  retainerType: RetainerType;
  retainerTaskRandomId: number;
};

type QuickVenture = {
  kind: "quick";
  retainerTaskRandomId: number;
};

type VenturesFile = {
  exploration: ExplorationVenture[];
  quick: QuickVenture;
};

type RewardSupplementFile = {
  metadata: {
    sources: string[];
    purpose: string;
    generatedAt: string;
  };
  rewardsByRetainerTaskRandomId: Record<string, number[]>;
};

type Csv = {
  header: string[];
  rows: string[][];
};

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Request failed for ${url}: ` +
        `${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

/*
 * Parse the whole CSV document rather than splitting
 * line by line.
 *
 * Some FFXIV CSV fields contain commas and embedded
 * newlines inside quoted values.
 */
function parseCsv(csv: string): Csv {
  const records: string[][] = [];

  let record: string[] = [];
  let field = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (char === '"') {
      if (insideQuotes && csv[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (char === "," && !insideQuotes) {
      record.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && csv[i + 1] === "\n") {
        i++;
      }

      record.push(field);
      field = "";

      if (record.length > 1 || record[0] !== "") {
        records.push(record);
      }

      record = [];
      continue;
    }

    field += char;
  }

  if (insideQuotes) {
    throw new Error("CSV ended inside a quoted field");
  }

  if (field.length > 0 || record.length > 0) {
    record.push(field);

    if (record.length > 1 || record[0] !== "") {
      records.push(record);
    }
  }

  if (records.length === 0) {
    throw new Error("CSV contains no records");
  }

  const [header, ...rows] = records;

  return {
    header,
    rows,
  };
}

function getColumnIndex(csv: Csv, column: string): number {
  const index = csv.header.indexOf(column);

  if (index === -1) {
    throw new Error(`CSV column not found: ${column}`);
  }

  return index;
}

function parsePositiveInteger(value: string): number | undefined {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

/*
 * LuminaSupplemental
 *
 * RetainerTaskRandomId -> possible Item IDs
 */
function parseRetainerVentureItems(csvText: string): RetainerVentureItem[] {
  const csv = parseCsv(csvText);

  const itemIdIndex = getColumnIndex(csv, "ItemId");

  const taskIdIndex = getColumnIndex(csv, "RetainerTaskRandomId");

  return csv.rows.map((row) => {
    const itemId = parsePositiveInteger(row[itemIdIndex]);

    const retainerTaskRandomId = parsePositiveInteger(row[taskIdIndex]);

    if (itemId === undefined || retainerTaskRandomId === undefined) {
      throw new Error(`Invalid RetainerVentureItem row: ${row.join(",")}`);
    }

    return {
      itemId,
      retainerTaskRandomId,
    };
  });
}

/*
 * Minions
 *
 * ItemUICategory 81 was experimentally verified
 * as the Minion category.
 */
function buildMinionItemIds(csvText: string): Set<number> {
  const csv = parseCsv(csvText);

  const itemIdIndex = getColumnIndex(csv, "#");
  const itemUiCategoryIndex = getColumnIndex(csv, "ItemUICategory");

  const result = new Set<number>();

  for (const row of csv.rows) {
    const itemId = parsePositiveInteger(row[itemIdIndex]);
    const itemUiCategoryId = Number(row[itemUiCategoryIndex]);

    if (
      itemId !== undefined &&
      itemUiCategoryId === MINION_ITEM_UI_CATEGORY_ID
    ) {
      result.add(itemId);
    }
  }

  return result;
}

/*
 * Combat
 *
 * An item is considered a crafting material for our
 * Exploration UI when its Item ID appears in one of:
 *
 * Recipe.Ingredient[0..7]
 */
function buildRecipeIngredientItemIds(csvText: string): Set<number> {
  const csv = parseCsv(csvText);

  const ingredientIndexes = csv.header
    .map((column, index) => ({
      column,
      index,
    }))
    .filter(({ column }) => /^Ingredient\[\d+\]$/.test(column))
    .map(({ index }) => index);

  if (ingredientIndexes.length === 0) {
    throw new Error("No Recipe Ingredient columns found");
  }

  const itemIds = new Set<number>();

  for (const row of csv.rows) {
    for (const index of ingredientIndexes) {
      const itemId = parsePositiveInteger(row[index]);

      if (itemId !== undefined) {
        itemIds.add(itemId);
      }
    }
  }

  return itemIds;
}

/*
 * GatheringItem uses its own row IDs.
 *
 * Build:
 *
 * GatheringItem row ID -> Item ID
 */
function buildGatheringItemMap(csvText: string): Map<number, number> {
  const csv = parseCsv(csvText);

  const rowIdIndex = getColumnIndex(csv, "#");

  const itemIndex = getColumnIndex(csv, "Item");

  const result = new Map<number, number>();

  for (const row of csv.rows) {
    const gatheringItemId = parsePositiveInteger(row[rowIdIndex]);

    const itemId = parsePositiveInteger(row[itemIndex]);

    if (gatheringItemId !== undefined && itemId !== undefined) {
      result.set(gatheringItemId, itemId);
    }
  }

  return result;
}

type GatheringJobItemIds = {
  miner: Set<number>;
  botanist: Set<number>;
};

/*
 * GatheringPointBase.Item[n] refers to GatheringItem
 * rows, not directly to Item rows.
 *
 * GatheringType:
 *
 * 0 = Mining
 * 1 = Quarrying
 * 2 = Logging
 * 3 = Harvesting
 */
function buildGatheringJobItemIds(
  csvText: string,
  gatheringItems: Map<number, number>,
): GatheringJobItemIds {
  const csv = parseCsv(csvText);

  const gatheringTypeIndex = getColumnIndex(csv, "GatheringType");

  const itemIndexes = csv.header
    .map((column, index) => ({
      column,
      index,
    }))
    .filter(({ column }) => /^Item\[\d+\]$/.test(column))
    .map(({ index }) => index);

  if (itemIndexes.length === 0) {
    throw new Error("No GatheringPointBase Item columns found");
  }

  const miner = new Set<number>();

  const botanist = new Set<number>();

  for (const row of csv.rows) {
    const gatheringType = Number(row[gatheringTypeIndex]);

    let target: Set<number> | undefined;

    if (gatheringType === 0 || gatheringType === 1) {
      target = miner;
    } else if (gatheringType === 2 || gatheringType === 3) {
      target = botanist;
    } else {
      continue;
    }

    for (const itemIndex of itemIndexes) {
      const gatheringItemId = parsePositiveInteger(row[itemIndex]);

      if (gatheringItemId === undefined) {
        continue;
      }

      const itemId = gatheringItems.get(gatheringItemId);

      if (itemId !== undefined) {
        target.add(itemId);
      }
    }
  }

  return {
    miner,
    botanist,
  };
}

/*
 * Fisher
 *
 * Both sheets expose direct Item IDs.
 */
function buildDirectItemIds(csvText: string): Set<number> {
  const csv = parseCsv(csvText);

  const itemIndex = getColumnIndex(csv, "Item");

  const result = new Set<number>();

  for (const row of csv.rows) {
    const itemId = parsePositiveInteger(row[itemIndex]);

    if (itemId !== undefined) {
      result.add(itemId);
    }
  }

  return result;
}

function unionSets(...sets: Set<number>[]): Set<number> {
  const result = new Set<number>();

  for (const set of sets) {
    for (const value of set) {
      result.add(value);
    }
  }

  return result;
}

function buildRetainerTypeByTaskId(
  ventures: ExplorationVenture[],
): Map<number, RetainerType> {
  const result = new Map<number, RetainerType>();

  for (const venture of ventures) {
    result.set(venture.retainerTaskRandomId, venture.retainerType);
  }

  return result;
}

function isJobItem(
  itemId: number,
  retainerType: RetainerType,
  recipeIngredientItemIds: Set<number>,
  minerItemIds: Set<number>,
  botanistItemIds: Set<number>,
  fisherItemIds: Set<number>,
): boolean {
  switch (retainerType) {
    case "combat":
      return recipeIngredientItemIds.has(itemId);

    case "miner":
      return minerItemIds.has(itemId);

    case "botanist":
      return botanistItemIds.has(itemId);

    case "fisher":
      return fisherItemIds.has(itemId);
  }
}

function classifyRewards(
  itemIds: number[],
  retainerType: RetainerType,
  minionItemIds: Set<number>,
  recipeIngredientItemIds: Set<number>,
  minerItemIds: Set<number>,
  botanistItemIds: Set<number>,
  fisherItemIds: Set<number>,
): VentureRewards {
  const result: VentureRewards = {
    allaganPieces: [],
    minions: [],
    jobItems: [],
    otherItems: [],
  };

  for (const itemId of itemIds) {
    /*
     * Allagan Pieces always take priority.
     */
    if (ALLAGAN_PIECE_ITEM_IDS.has(itemId)) {
      result.allaganPieces.push(itemId);

      continue;
    }

    if (minionItemIds.has(itemId)) {
      result.minions.push(itemId);
      continue;
    }

    if (
      isJobItem(
        itemId,
        retainerType,
        recipeIngredientItemIds,
        minerItemIds,
        botanistItemIds,
        fisherItemIds,
      )
    ) {
      result.jobItems.push(itemId);
      continue;
    }

    result.otherItems.push(itemId);
  }

  return result;
}

async function main() {
  /*
   * Fetch all external datasets concurrently.
   *
   * None depends on another HTTP request.
   */
  const [
    rewardCsv,
    itemCsv,
    recipeCsv,
    gatheringItemCsv,
    gatheringPointBaseCsv,
    fishParameterCsv,
    spearfishingItemCsv,
    venturesJson,
    supplementJson,
  ] = await Promise.all([
    fetchText(RETAINER_VENTURE_ITEM_URL),
    fetchText(ITEM_URL),
    fetchText(RECIPE_URL),
    fetchText(GATHERING_ITEM_URL),
    fetchText(GATHERING_POINT_BASE_URL),
    fetchText(FISH_PARAMETER_URL),
    fetchText(SPEARFISHING_ITEM_URL),
    readFile("public/data/ventures.json", "utf8"),
    readFile("data/exploration-reward-supplement.json", "utf8"),
  ]);

  const rewardRows = parseRetainerVentureItems(rewardCsv);

  const minionItemIds = buildMinionItemIds(itemCsv);

  const recipeIngredientItemIds = buildRecipeIngredientItemIds(recipeCsv);

  const gatheringItems = buildGatheringItemMap(gatheringItemCsv);

  const { miner: minerItemIds, botanist: botanistItemIds } =
    buildGatheringJobItemIds(gatheringPointBaseCsv, gatheringItems);

  const fisherItemIds = unionSets(
    buildDirectItemIds(fishParameterCsv),
    buildDirectItemIds(spearfishingItemCsv),
  );

  const venturesFile = JSON.parse(venturesJson) as VenturesFile;

  const supplementFile = JSON.parse(supplementJson) as RewardSupplementFile;

  const retainerTypeByTaskId = buildRetainerTypeByTaskId(
    venturesFile.exploration,
  );

  /*
   * First reproduce the raw Lumina mapping.
   */
  const rawRewards = new Map<number, number[]>();

  for (const row of rewardRows) {
    const current = rawRewards.get(row.retainerTaskRandomId);

    if (current !== undefined) {
      current.push(row.itemId);
    } else {
      rawRewards.set(row.retainerTaskRandomId, [row.itemId]);
    }
  }

  /*
   * Add locally maintained rewards that are missing
   * from LuminaSupplemental.
   *
   * Use a Set while merging so that the supplement
   * remains safe if Lumina later adds the same rewards.
   */
  let supplementVentureCount = 0;
  let supplementRewardCount = 0;
  let supplementAdditionalRewardCount = 0;

  for (const [taskIdText, supplementItemIds] of Object.entries(
    supplementFile.rewardsByRetainerTaskRandomId,
  )) {
    const taskId = Number(taskIdText);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new Error(`Invalid supplement task ID: ${taskIdText}`);
    }

    supplementVentureCount++;

    const mergedItemIds = new Set(rawRewards.get(taskId) ?? []);

    for (const itemId of supplementItemIds) {
      if (!Number.isInteger(itemId) || itemId <= 0) {
        throw new Error(
          `Invalid supplement item ID ${itemId} for task ${taskId}`,
        );
      }

      supplementRewardCount++;

      if (!mergedItemIds.has(itemId)) {
        supplementAdditionalRewardCount++;
      }

      mergedItemIds.add(itemId);
    }

    rawRewards.set(taskId, [...mergedItemIds]);
  }

  /*
   * LuminaSupplemental contains Quick
   * Exploration rewards. Do not silently classify
   * those using an unrelated retainer job.
   */
  const quickTaskId = venturesFile.quick.retainerTaskRandomId;

  const quickRewards = {
    knownItems: rawRewards.get(quickTaskId) ?? [],
  };

  const classifiedRewards = new Map<number, VentureRewards>();

  let skippedVentureCount = 0;
  let skippedRewardCount = 0;

  for (const [taskId, itemIds] of rawRewards) {
    if (taskId === quickTaskId) {
      continue;
    }

    const retainerType = retainerTypeByTaskId.get(taskId);

    if (retainerType === undefined) {
      skippedVentureCount++;
      skippedRewardCount += itemIds.length;

      continue;
    }

    classifiedRewards.set(
      taskId,
      classifyRewards(
        itemIds,
        retainerType,
        minionItemIds,
        recipeIngredientItemIds,
        minerItemIds,
        botanistItemIds,
        fisherItemIds,
      ),
    );
  }

  const classifiedRewardCount = [...classifiedRewards.values()].reduce(
    (total, rewards) =>
      total +
      rewards.allaganPieces.length +
      rewards.minions.length +
      rewards.jobItems.length +
      rewards.otherItems.length,
    0,
  );

  const output = {
    metadata: {
      rewardSource:
        "LuminaSupplemental + manually verified community supplements",
      classificationSource: "FFXIV game data",
      generatedAt: new Date().toISOString(),
      sourceRewardCount: rewardRows.length,
      sourceVentureCount: rawRewards.size,
      classifiedRewardCount: classifiedRewardCount,
      classifiedVentureCount: classifiedRewards.size,
      skippedRewardCount,
      skippedVentureCount,
    },

    rewardsByRetainerTaskRandomId: Object.fromEntries(classifiedRewards),

    quick: {
      retainerTaskRandomId: quickTaskId,
      rewards: quickRewards,
    },
  };

  const json = JSON.stringify(output, null, 2);

  await writeFile("public/data/venture-rewards.json", json, "utf8");

  console.log(
    `Generated ${classifiedRewards.size} ` + "classified Exploration Ventures",
  );

  console.log(
    `Skipped ${skippedVentureCount} ` +
      `unclassified ventures ` +
      `(${skippedRewardCount} rewards)`,
  );

  console.log("\nSupplement contribution:");
  console.log(`  ${supplementVentureCount} ventures covered`);
  console.log(`  ${supplementRewardCount} reward associations`);
  console.log(
    `  ${supplementRewardCount - supplementAdditionalRewardCount} already covered`,
  );
  console.log(`  ${supplementAdditionalRewardCount} additional rewards`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
