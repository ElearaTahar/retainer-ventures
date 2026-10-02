import { writeFile } from "node:fs/promises";

const XIVAPI_BASE_URL = "https://v2.xivapi.com/api";

type ItemRowResponse = {
  row_id: number;
  fields: {
    Name: string;
    "Name@lang(fr)": string;
    Icon: {
      id: number;
      path: string;
      path_hr1: string;
    };
  };
};

type ItemCollectionResponse = {
  schema: string;
  version: string;
  rows: ItemRowResponse[];
};

type ItemSearchEntry = {
  id: number;
  name: {
    en: string;
    fr: string;
  };
  iconId: number;
};

function toItemSearchEntry(row: ItemRowResponse): ItemSearchEntry {
  return {
    id: row.row_id,
    name: {
      en: row.fields.Name,
      fr: row.fields["Name@lang(fr)"],
    },
    iconId: row.fields.Icon.id,
  };
}

function buildIconPath(iconId: number): string {
  const paddedId = iconId.toString().padStart(6, "0");
  const directoryId = Math.floor(iconId / 1000) * 1000;
  const paddedDirectory = directoryId.toString().padStart(6, "0");

  return `ui/icon/${paddedDirectory}/${paddedId}_hr1.tex`;
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

async function fetchAllItems(fieldsParam: string): Promise<ItemRowResponse[]> {
  const rows: ItemRowResponse[] = [];
  let after: number | undefined;

  while (true) {
    let url =
      `${XIVAPI_BASE_URL}/sheet/Item` + `?limit=500&fields=${fieldsParam}`;

    if (after !== undefined) {
      url += `&after=${after}`;
    }

    const data = await fetchJSON<ItemCollectionResponse>(url);
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
  const fields = ["Name", "Name@lang(fr)", "Icon"];
  const fieldsParam = fields.join(",");

  const rows = await fetchAllItems(fieldsParam);

  console.log("all item rows:", rows.length);
  console.log("first row:", rows[0]?.row_id);
  console.log("last row:", rows[rows.length - 1]?.row_id);

  const namedRows = rows.filter((row) => row.fields.Name !== "");
  console.log("named items:", namedRows.length);
  console.log("unnamed items:", rows.length - namedRows.length);

  const items = namedRows.map(toItemSearchEntry);

  const mismatches = namedRows.filter((row) => {
    const generatedPath = buildIconPath(row.fields.Icon.id);
    return generatedPath !== row.fields.Icon.path_hr1;
  });

  if (mismatches.length > 0) {
    console.error("first icon path mismatches:", mismatches.slice(0, 10));

    throw new Error(
      `Found ${mismatches.length} icon paths that cannot be reconstructed from iconId`,
    );
  }

  const output = {
    metadata: {
      source: "XIVAPI",
      generatedAt: new Date().toISOString(),
      count: items.length,
    },
    items,
  };

  const json = JSON.stringify(output);

  await writeFile("public/data/item-search-index.json", json, "utf-8");
}

main();
