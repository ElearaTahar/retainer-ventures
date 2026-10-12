import { Retainer } from "../types/retainers";

const AVATAR_COLOR_COUNT = 6;

export function getRetainerInitials(name: string): string {
  return name.trim().slice(0, 2).toUpperCase();
}

function getInitialColor(id: number): number {
  return ((id - 1) % AVATAR_COLOR_COUNT) + 1;
}

export function getRetainerAvatarColors(
  retainers: Retainer[],
): Map<number, number> {
  const colors = new Map<number, number>();
  const usedColorsByInitials = new Map<string, Set<number>>();

  const sortedRetainers = [...retainers].sort((a, b) => a.id - b.id);

  for (const retainer of sortedRetainers) {
    const initials = getRetainerInitials(retainer.name);

    let usedColors = usedColorsByInitials.get(initials);

    if (!usedColors) {
      usedColors = new Set<number>();
      usedColorsByInitials.set(initials, usedColors);
    }

    let color = getInitialColor(retainer.id);
    let attempts = 0;

    while (usedColors.has(color) && attempts < AVATAR_COLOR_COUNT) {
      color = getInitialColor(color + 1);
      attempts++;
    }

    colors.set(retainer.id, color);
    usedColors.add(color);
  }

  return colors;
}
