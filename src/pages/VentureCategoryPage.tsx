import { useParams } from "react-router-dom";
import type { TargetedCategory, TargetedVenture } from "../types/ventures";
import {
  categoriesByRetainerType,
  isRetainerType,
} from "../data/ventureCategories";
import { ItemSearchEntry } from "../types/items";
import { TargetedVentureList } from "../components/TargetedVentureList";
import { Breadcrumb } from "../components/Breadcrumb";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { retainerType, category } = useParams();

  if (!isRetainerType(retainerType)) {
    return <p>Unknown retainer type</p>;
  }

  const categories = categoriesByRetainerType[retainerType];
  const ventureCategory = categories.find(
    (ventureCategory) => ventureCategory.slug === category,
  );

  if (!ventureCategory) {
    return <p>Unknown venture category</p>;
  }

  if (isTargetedCategory(category)) {
    return (
      <>
        <Breadcrumb
          items={[
            {
              label: t("navigation.ventures"),
              to: "/ventures",
            },
            {
              label: t(`retainerTypes.${retainerType}`),
              to: `/ventures/${retainerType}`,
            },
            {
              label: t(ventureCategory.translationKey),
            },
          ]}
        />

        <TargetedVentureList
          category={category}
          ventures={ventures}
          itemsById={itemsById}
        />
      </>
    );
  }

  return <p>Exploration: {category}</p>;
}
