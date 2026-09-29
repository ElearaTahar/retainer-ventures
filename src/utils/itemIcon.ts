export function buildItemIconUrl(iconId: number): string {
  const path = buildItemIconPath(iconId);

  return `https://v2.xivapi.com/api/asset?path=${encodeURIComponent(path)}&format=webp`;
}

export function buildItemIconPath(iconId: number): string {
  const paddedId = iconId.toString().padStart(6, "0");
  const directoryId = Math.floor(iconId / 1000) * 1000;
  const paddedDirectory = directoryId.toString().padStart(6, "0");

  return `ui/icon/${paddedDirectory}/${paddedId}_hr1.tex`;
}
