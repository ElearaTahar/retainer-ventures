import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type {
  ExplorationCategory,
  ExplorationVenture,
  TargetedCategory,
  TargetedVenture,
} from "../types/ventures";
import type { VentureRewardsData } from "../types/ventureRewards";
import {
  categoriesByRetainerType,
  isRetainerType,
} from "../data/ventureCategories";
import type { ItemSearchEntry } from "../types/items";
import { TargetedVentureList } from "../components/TargetedVentureList";
import { Breadcrumb } from "../components/Breadcrumb";
import { NotFoundPage } from "./NotFoundPage";
import { ExplorationVentureList } from "../components/ExplorationVentureList";
import "../styles/venture-category-page.css";

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

function isExplorationCategory(
  value: string | undefined,
): value is ExplorationCategory {
  return (
    value === "field-exploration" ||
    value === "highland-exploration" ||
    value === "woodland-exploration" ||
    value === "waterside-exploration"
  );
}

type VentureCategoryPageProps = {
  ventures: TargetedVenture[];
  explorationVentures: ExplorationVenture[];
  ventureRewards: VentureRewardsData;
  itemsById: Map<number, ItemSearchEntry>;
};

export function VentureCategoryPage({
  ventures,
  explorationVentures,
  ventureRewards,
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
    <div className="venture-category-page">
      <Breadcrumb
        items={[
          { label: t("navigation.ventures"), to: "/ventures" },
          {
            label: t(`retainerTypes.${retainerType}`),
            to: `/ventures/${retainerType}`,
          },
          { label: t(ventureCategory.translationKey) },
        ]}
      />

      {isTargetedCategory(category) ? (
        <TargetedVentureList
          category={category}
          ventures={ventures}
          itemsById={itemsById}
        />
      ) : isExplorationCategory(category) ? (
        <ExplorationVentureList
          category={category}
          ventures={explorationVentures}
          ventureRewards={ventureRewards}
          itemsById={itemsById}
        />
      ) : null}
    </div>
  );
}
