import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/breadcrumb.css";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useTranslation();

  return (
    <nav className="breadcrumb" aria-label={t("navigation.breadcrumb")}>
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.to ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
              {!isLast && (
                <span aria-hidden="true">
                  <ChevronRight size={14} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
