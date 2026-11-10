import { readFile } from "node:fs/promises";

type Language = "en" | "fr";

type RetainerType = "combat" | "miner" | "botanist" | "fisher";

type ExplorationVenture = {
  id: number;
  kind: "exploration";
  retainerType: RetainerType;
  category:
    | "field-exploration"
    | "highland-exploration"
    | "woodland-exploration"
    | "waterside-exploration";
  retainerTaskRandomId: number;
  name: Record<Language, string>;
  requiredLevel: number;
};

type VenturesFile = {
  exploration: ExplorationVenture[];
};

type VentureRewards = {
  allaganPieces: number[];
  jobItems: number[];
  otherItems: number[];
};

type VentureRewardsFile = {
  rewardsByRetainerTaskRandomId: Record<string, VentureRewards>;
};

const venturesFilePath = "public/data/ventures.json";
const rewardsFilePath = "public/data/venture-rewards.json";

async function main() {
  const venturesFile = JSON.parse(
    await readFile(venturesFilePath, "utf8"),
  ) as VenturesFile;

  const rewardsFile = JSON.parse(
    await readFile(rewardsFilePath, "utf8"),
  ) as VentureRewardsFile;

  const missingVentures = venturesFile.exploration.filter((venture) => {
    const rewards =
      rewardsFile.rewardsByRetainerTaskRandomId[
        String(venture.retainerTaskRandomId)
      ];

    return rewards === undefined;
  });

  const retainerTypes: RetainerType[] = [
    "combat",
    "miner",
    "botanist",
    "fisher",
  ];

  console.log(
    `Missing rewards for ${missingVentures.length}/${venturesFile.exploration.length} exploration ventures`,
  );

  for (const retainerType of retainerTypes) {
    const ventures = missingVentures.filter(
      (venture) => venture.retainerType === retainerType,
    );

    if (ventures.length === 0) {
      continue;
    }

    console.log(`\n${retainerType.toUpperCase()} (${ventures.length})`);

    for (const venture of ventures) {
      console.log(
        [
          `  ${venture.name.en}`,
          `level=${venture.requiredLevel}`,
          `retainerTaskRandomId=${venture.retainerTaskRandomId}`,
          `ventureId=${venture.id}`,
        ].join(" | "),
      );
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
