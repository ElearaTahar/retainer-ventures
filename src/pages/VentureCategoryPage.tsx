import { useParams } from "react-router-dom";
import type { TargetedCategory, TargetedVenture } from "../types/ventures";
import {
  categoriesByRetainerType,
  isRetainerType,
} from "../data/ventureCategories";
import { ItemSearchEntry } from "../types/items";
import { TargetedVentureList } from "../components/TargetedVentureList";

function isTargetedCategory(
  value: string | undefined,
): value is TargetedCategory {
  return (
    value === "hunting" ||
    value === "mining" ||
    value === "botany" ||
    value === "fishing"
  );
}

type VentureCategoryPageProps = {
  ventures: TargetedVenture[];
  itemsById: Map<number, ItemSearchEntry>;
};

export function VentureCategoryPage({
  ventures,
  itemsById,
}: VentureCategoryPageProps) {
  const { retainerType, category } = useParams();

  if (!isRetainerType(retainerType)) {
    return <p>Unknown retainer type</p>;
  }

  const categories = categoriesByRetainerType[retainerType];
  const categoryExists = categories.some(
    (ventureCategory) => ventureCategory.slug === category,
  );

  if (!categoryExists) {
    return <p>Unknown venture category</p>;
  }

  if (isTargetedCategory(category)) {
    return (
      <TargetedVentureList
        category={category}
        ventures={ventures}
        itemsById={itemsById}
      />
    );
  }

  return <p>Exploration: {category}</p>;
}
