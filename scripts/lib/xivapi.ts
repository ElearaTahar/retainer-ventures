const XIVAPI_BASE_URL = "https://v2.xivapi.com/api";

type XIVAPIRow = {
  row_id: number;
};

type XIVAPICollection<T> = {
  rows: T[];
};

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `XIVAPI request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export async function fetchAllSheetRows<T extends XIVAPIRow>(
  sheet: string,
  fields: string[],
): Promise<T[]> {
  const rows: T[] = [];
  let after: number | undefined;

  while (true) {
    const url = new URL(`${XIVAPI_BASE_URL}/sheet/${sheet}`);

    url.searchParams.set("limit", "500");
    url.searchParams.set("fields", fields.join(","));

    if (after !== undefined) {
      url.searchParams.set("after", String(after));
    }

    const data = await fetchJSON<XIVAPICollection<T>>(url.toString());
    const lastRow = data.rows[data.rows.length - 1];

    if (!lastRow) {
      break;
    }

    rows.push(...data.rows);
    after = lastRow.row_id;
  }

  return rows;
}
