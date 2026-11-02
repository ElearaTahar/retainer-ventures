import { useId, type SVGProps } from "react";

export function CombatIcon(props: SVGProps<SVGSVGElement>) {
  const maskId = useId();

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="100"
        height="100"
        fill="white"
      >
        <g transform="rotate(45 50 50)">
          <path d="M50 5 L57 19 L55 62 L45 62 L43 19 Z" />
          <path d="M50 10 L50 58 L47 58 L46 20 Z" />
          <path d="M31 60 Q50 66 69 60 L67 68 Q50 72 33 68 Z" />
          <rect x="46" y="67" width="8" height="19" rx="2" />
          <path d="M50 82 L58 90 L50 97 L42 90 Z" />
        </g>

        <g transform="rotate(-45 50 50)">
          <path d="M46 34H54L53 91 50 98 47 91Z" />
          <path d="M47 36 38 29 34 19 38 10 46 5 53 8 58 16 55 23 49 25 45 21 46 16 42 19 44 25 52 29 57 27 60 32 55 39Z" />
          <path d="M50 10 56 16 53 23 47 23 44 16Z" />
        </g>
      </mask>

      <rect
        width="100"
        height="100"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
