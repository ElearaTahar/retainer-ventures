import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  categoriesByRetainerType,
  isRetainerType,
} from "../data/ventureCategories";
import { Breadcrumb } from "../components/Breadcrumb";
import { NotFoundPage } from "./NotFoundPage";

export function RetainerTypePage() {
  const { t } = useTranslation();

  const { retainerType } = useParams();

  if (!isRetainerType(retainerType)) {
    return <NotFoundPage />;
  }

  const categories = categoriesByRetainerType[retainerType];

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
          },
        ]}
      />

      <h1>{t(`retainerTypes.${retainerType}`)}</h1>

      <nav aria-label={t("navigation.ventureCategories")}>
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/ventures/${retainerType}/${category.slug}`}
          >
            {t(category.translationKey)}
          </Link>
        ))}
      </nav>
    </>
  );
}
