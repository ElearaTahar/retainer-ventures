import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  categoriesByRetainerType,
  isRetainerType,
} from "../data/ventureCategories";

export function RetainerTypePage() {
  const { t } = useTranslation();

  const { retainerType } = useParams();

  if (!isRetainerType(retainerType)) {
    return <p>Unknown retainer type</p>;
  }

  const categories = categoriesByRetainerType[retainerType];

  return (
    <>
      <h1>{t(`retainerTypes.${retainerType}`)}</h1>

      <nav aria-label="Venture categories">
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
