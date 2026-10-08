import { ArrowRight, Compass, Crosshair } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  categoriesByRetainerType,
  isRetainerType,
} from "../data/ventureCategories";
import { Breadcrumb } from "../components/Breadcrumb";
import { NotFoundPage } from "./NotFoundPage";
import "../styles/retainer-type-page.css";

export function RetainerTypePage() {
  const { t } = useTranslation();

  const { retainerType } = useParams();

  if (!isRetainerType(retainerType)) {
    return <NotFoundPage />;
  }

  const categories = categoriesByRetainerType[retainerType];

  return (
    <div className="retainer-type-page">
      <Breadcrumb
        items={[
          { label: t("navigation.ventures"), to: "/ventures" },
          { label: t(`retainerTypes.${retainerType}`) },
        ]}
      />

      <h1>{t(`retainerTypes.${retainerType}`)}</h1>

      <nav
        className="venture-category-navigation"
        aria-label={t("navigation.ventureCategories")}
      >
        {categories.map((category) => {
          const Icon = category.kind === "targeted" ? Crosshair : Compass;

          return (
            <Link
              key={category.slug}
              to={`/ventures/${retainerType}/${category.slug}`}
              className="venture-category-card"
            >
              <span className="venture-category-card-content">
                <span className="venture-category-card-heading">
                  <Icon
                    className="venture-category-card-icon"
                    aria-hidden="true"
                  />

                  <span className="venture-category-card-title">
                    {t(category.translationKey)}
                  </span>
                </span>

                <span className="venture-category-card-description">
                  {t(`ventureCategoryDescriptions.${category.kind}`)}
                </span>
              </span>
              <ArrowRight
                className="venture-category-card-arrow"
                size={18}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
