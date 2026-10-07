import { useCallback, useState } from "react";

export function useExpandedItems() {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set());

  function toggleExpanded(id: number) {
    setExpandedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  const expand = useCallback((id: number) => {
    setExpandedIds((current) => {
      if (current.has(id)) {
        return current;
      }

      const next = new Set(current);
      next.add(id);

      return next;
    });
  }, []);

  function isExpanded(id: number) {
    return expandedIds.has(id);
  }

  return { expandedIds, isExpanded, toggleExpanded, expand };
}
