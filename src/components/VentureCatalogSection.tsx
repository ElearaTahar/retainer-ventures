import type { ReactNode } from "react";

type VentureCatalogSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function VentureCatalogSection({
  title,
  description,
  children,
}: VentureCatalogSectionProps) {
  return (
    <section className="venture-catalog-section">
      <h3>{title}</h3>

      <p>{description}</p>

      {children}
    </section>
  );
}
