import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type UseVentureHashNavigationProps = {
  expandedIds: Set<number>;
  expand: (id: number) => void;
};

function getVentureIdFromHash(hash: string): number | null {
  const prefix = "#venture=";
  if (!hash.startsWith(prefix)) {
    return null;
  }

  const substr = hash.substring(prefix.length);
  if (substr === "") {
    return null;
  }

  const id = Number(substr);
  if (Number.isInteger(id) && id > 0) {
    return id;
  }

  return null;
}

export function useVentureHashNavigation({
  expandedIds,
  expand,
}: UseVentureHashNavigationProps) {
  const { hash } = useLocation();
  const ventureId = getVentureIdFromHash(hash);

  useEffect(() => {
    if (ventureId === null) {
      return;
    }

    expand(ventureId);
  }, [ventureId, expand]);

  useEffect(() => {
    if (ventureId === null) {
      return;
    }

    if (expandedIds.has(ventureId)) {
      document.getElementById(`venture-${ventureId}`)?.scrollIntoView();
    }
  }, [ventureId, expandedIds]);
}
