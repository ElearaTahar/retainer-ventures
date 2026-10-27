import { useLayoutEffect, useRef, useState } from "react";
import "../styles/filter-tabs.css";

type Option<T extends string> = {
  value: T;
  label: string;
};

type FilterTabsProps<T extends string> = {
  optionsList: Option<T>[];
  selectedOption: T;
  onChange: (value: T) => void;
};

export function FilterTabs<T extends string>({
  optionsList,
  selectedOption,
  onChange,
}: FilterTabsProps<T>) {
  const labels = optionsList.map((option) => option.label).join("\u0000");

  const containerRef = useRef<HTMLDivElement>(null);

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const activeSpan = container.querySelector<HTMLSpanElement>(
      '.btn-filter[aria-pressed="true"] > span',
    );

    if (!activeSpan) return;

    const containerRect = container.getBoundingClientRect();
    const spanRect = activeSpan.getBoundingClientRect();

    const left = spanRect.left - containerRect.left + container.scrollLeft;
    const width = spanRect.width;

    setIndicator({ left, width });
  }, [selectedOption, labels]);

  return (
    <div ref={containerRef} className="filters">
      {optionsList.map((option) => (
        <button
          key={option.value}
          className="btn btn-filter"
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={option.value === selectedOption}
        >
          <span>{option.label}</span>
        </button>
      ))}

      <span
        className="filter-indicator"
        aria-hidden="true"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}
