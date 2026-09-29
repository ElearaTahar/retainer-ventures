export type ItemSearchEntry = {
  id: number;
  name: {
    en: string;
    fr: string;
  };
  iconId: number;
};

export type ItemSearchResponse = {
  metadata: {
    generatedAt: string;
    count: number;
  };
  items: ItemSearchEntry[];
};
