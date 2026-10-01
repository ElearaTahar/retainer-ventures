import { useParams } from "react-router-dom";
import type { TargetedCategory, TargetedVenture } from "../types/ventures";
import {
  categoriesByRetainerType,
  isRetainerType,
} from "../data/ventureCategories";
import type { ItemSearchEntry } from "../types/items";
import { TargetedVentureList } from "../components/TargetedVentureList";
import { Breadcrumb } from "../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { NotFoundPage } from "./NotFoundPage";

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
    return <NotFoundPage />;
  }

  const categories = categoriesByRetainerType[retainerType];
  const ventureCategory = categories.find(
    (ventureCategory) => ventureCategory.slug === category,
  );

  if (!ventureCategory) {
    return <NotFoundPage />;
  }

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

      {isTargetedCategory(category) ? (
        <TargetedVentureList
          category={category}
          ventures={ventures}
          itemsById={itemsById}
        />
      ) : (
        <p>{t("explorationVenture.unavailable")}</p>
      )}
    </>
  );
}
