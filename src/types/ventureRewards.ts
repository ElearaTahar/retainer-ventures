export type VentureRewards = {
  allaganPieces: number[];
  minions: number[];
  jobItems: number[];
  otherItems: number[];
};

export type VentureRewardsData = {
  metadata: {
    rewardSource: string;
    classificationSource: string;
    generatedAt: string;
    sourceRewardCount: number;
    sourceVentureCount: number;
    classifiedRewardCount: number;
    classifiedVentureCount: number;
    skippedRewardCount: number;
    skippedVentureCount: number;
  };
  rewardsByRetainerTaskRandomId: Record<string, VentureRewards>;
};
