import type { CSSProperties } from "react";

/** Renders a brand botanical motif by referencing the MotifSprite symbols. */
export default function Motif({
  href,
  style,
  stroke = "var(--green-2)",
  strokeWidth = 2.4,
}: {
  href: string;
  style?: CSSProperties;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 150 190"
      style={{
        height: "auto",
        stroke,
        fill: "none",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        overflow: "visible",
        ...style,
      }}
    >
      <use href={href} />
    </svg>
  );
}
