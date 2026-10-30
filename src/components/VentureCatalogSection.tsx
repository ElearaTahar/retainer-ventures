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
    <section>
      <h2>{title}</h2>

      <p>{description}</p>

      {children}
    </section>
  );
}
