import { readFile, writeFile } from "node:fs/promises";

type ItemSearchEntry = {
  id: number;
  name: {
    en: string;
    fr: string;
  };
  iconId: number;
};

type ItemSearchIndex = {
  items: ItemSearchEntry[];
};

type VentureRewardNames = {
  retainerTaskRandomId: number;
  ventureName: string;
  source: "FFXIV Community Wiki" | "XIVStats";
  rewards: string[];
};

const itemIndexPath = "public/data/item-search-index.json";

const ventures: VentureRewardNames[] = [
  {
    retainerTaskRandomId: 30040,
    ventureName: "Waterside Exploration I",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Bronze Piece",
      "Finger Shrimp",
      "White Coral",
      "Water Shard",
    ],
  },
  {
    retainerTaskRandomId: 30041,
    ventureName: "Waterside Exploration II",
    source: "XIVStats",
    rewards: [
      "Allagan Bronze Piece",
      "Ice Shard",
      "Water Shard",
      "Coral Butterfly",
      "Crimson Crayfish",
      "Dusk Goby",
    ],
  },
  {
    retainerTaskRandomId: 30114,
    ventureName: "Field Exploration XXIX",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Alpaca Fillet",
      "Hammerhead Crocodile Skin",
      "Megamaguey Pineapple",
      "Poison Frog Secretions",
      "Silver Lobo Hide",
      "Clockwork Novus D",
    ],
  },
  {
    retainerTaskRandomId: 30115,
    ventureName: "Field Exploration XXX",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Br'aax Hide",
      "Branchbearer Fruit",
      "Nopalitender Tuna",
      "Swampmonk Thigh",
      "Ty'aitya Wingblade",
      "Mystic Weapon",
    ],
  },
  {
    retainerTaskRandomId: 30116,
    ventureName: "Field Exploration XXXI",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Alexandrian Axe Beak Wing",
      "Gargantua Hide",
      "Gomphotherium Skin",
      "Rroneek Fleece",
      "Tumbleclaw Weeds",
      "Stone Partition",
      "Horizontal Neon Wall Light",
      "Vertical Neon Wall Light",
    ],
  },

  {
    retainerTaskRandomId: 30117,
    ventureName: "Highland Exploration XXIX",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Lar Ore",
      "Mountain Chromite Ore",
      "Mountain Rock Salt",
      "Raw Ihuykanite",
      "Ruthenium Ore",
      "Wind-up Kangaroo",
    ],
  },
  {
    retainerTaskRandomId: 30118,
    ventureName: "Highland Exploration XXX",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Raw Ihuykanite",
      "Raw Pink Beryl",
      "Wind-up Hobgoblin",
    ],
  },
  {
    retainerTaskRandomId: 30119,
    ventureName: "Highland Exploration XXXI",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Magnesia Powder",
      "Raw Pink Beryl",
      "Titanium Gold Ore",
      "White Gold Ore",
      "Yak T'el Spring Water",
      "Wind-up Mamool Ja",
    ],
  },

  {
    retainerTaskRandomId: 30120,
    ventureName: "Woodland Exploration XXIX",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Ceiba Log",
      "Eucalyptus",
      "Ginseng Log",
      "Snow Cotton",
      "Turali Aloe",
      "Ut'ohmu Tomato",
      "Wild Ja Tiika Bananas",
      "Chewy",
    ],
  },
  {
    retainerTaskRandomId: 30121,
    ventureName: "Woodland Exploration XXX",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Kozama'uka Chamomile",
      "Sweet Kukuru Bean",
    ],
  },
  {
    retainerTaskRandomId: 30122,
    ventureName: "Woodland Exploration XXXI",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Bell Pepper",
      "Broccoli",
      "Levinsilk",
      "Windsbalm Bay Leaf",
      "Not-so-bighorn",
    ],
  },

  {
    retainerTaskRandomId: 30123,
    ventureName: "Waterside Exploration XXIX",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Blue Purse",
      "Candiru",
      "Marbled Hatchetfish",
      "Petticoat Tetra",
      "Shark Catfish",
      "Yok Huy Toad",
    ],
  },
  {
    retainerTaskRandomId: 30124,
    ventureName: "Waterside Exploration XXX",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Karvarichthys",
      "Pelubane",
      "Pleated Matamata",
    ],
  },
  {
    retainerTaskRandomId: 30125,
    ventureName: "Waterside Exploration XXXI",
    source: "FFXIV Community Wiki",
    rewards: [
      "Allagan Silver Piece",
      "Karvarichthys",
      "Lightning Eel",
      "Pelubane",
      "Warmouth",
      "Welkin Catfish",
      "Moon Croppie",
      "Quetzal",
    ],
  },
];

async function main() {
  const itemIndex = JSON.parse(
    await readFile(itemIndexPath, "utf8"),
  ) as ItemSearchIndex;

  const itemsByEnglishName = new Map<string, ItemSearchEntry[]>();

  for (const item of itemIndex.items) {
    const existingItems = itemsByEnglishName.get(item.name.en) ?? [];
    existingItems.push(item);
    itemsByEnglishName.set(item.name.en, existingItems);
  }

  const result: Record<string, number[]> = {};

  let hasErrors = false;
  let resolvedRewardCount = 0;

  for (const venture of ventures) {
    console.log(`\n${venture.ventureName} (${venture.retainerTaskRandomId})`);

    const itemIds: number[] = [];

    for (const rewardName of venture.rewards) {
      const matches = itemsByEnglishName.get(rewardName) ?? [];

      if (matches.length === 0) {
        console.error(`  MISSING   ${rewardName}`);
        hasErrors = true;
        continue;
      }

      if (matches.length > 1) {
        console.error(`  AMBIGUOUS ${rewardName}`);

        for (const match of matches) {
          console.error(`            id=${match.id}`);
        }

        hasErrors = true;
        continue;
      }

      const item = matches[0];

      itemIds.push(item.id);
      resolvedRewardCount += 1;

      console.log(`  ${item.id}  ${rewardName}`);
    }

    result[String(venture.retainerTaskRandomId)] = itemIds;
  }

  console.log(
    `\nResolved ${resolvedRewardCount} rewards for ${ventures.length} ventures.`,
  );

  if (hasErrors) {
    throw new Error(
      "Some rewards could not be resolved uniquely. No supplement was generated.",
    );
  }

  const sources = [...new Set(ventures.map((venture) => venture.source))];

  const output = {
    metadata: {
      sources,
      purpose: "Manually verified supplemental Exploration venture rewards",
      generatedAt: new Date().toISOString(),
    },
    rewardsByRetainerTaskRandomId: result,
  };

  const outputPath = "data/exploration-reward-supplement.json";

  await writeFile(outputPath, JSON.stringify(output, null, 2), "utf8");

  console.log(
    `Generated ${ventures.length} supplemental ventures ` +
      `(${resolvedRewardCount} rewards)`,
  );
  console.log(`Written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
