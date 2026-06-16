/**
 * Hidden SVG sprite holding the brand botanical line-art symbols.
 * Rendered once in the root layout so any page can reference a motif via
 * <use href="#m-tulip" /> (see the Motif component).
 */
export default function MotifSprite() {
  const g = {
    fill: "none",
    stroke: "#2C5530",
    strokeWidth: 2.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="m-tulip" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 90 L75 178" />
          <path d="M75 132 C54 130 40 142 35 166 C58 164 71 152 75 134" />
          <path d="M75 124 C96 122 110 134 115 158 C92 156 79 144 75 126" />
          <path d="M75 92 C62 92 50 82 50 60 C50 44 60 30 75 30 C90 30 100 44 100 60 C100 82 88 92 75 92Z" />
          <path d="M75 92 L75 34 M59 50 C61 70 68 86 75 90 M91 50 C89 70 82 86 75 90" />
        </g>
      </symbol>
      <symbol id="m-narcissus" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 86 L75 178" />
          <path d="M75 128 C55 126 42 138 38 160 M75 140 C95 138 108 148 112 170" />
          <ellipse cx="75" cy="34" rx="9" ry="16" />
          <ellipse cx="48" cy="46" rx="9" ry="16" transform="rotate(-60 48 46)" />
          <ellipse cx="102" cy="46" rx="9" ry="16" transform="rotate(60 102 46)" />
          <ellipse cx="55" cy="74" rx="9" ry="16" transform="rotate(-120 55 74)" />
          <ellipse cx="95" cy="74" rx="9" ry="16" transform="rotate(120 95 74)" />
          <circle cx="75" cy="58" r="12" />
          <circle cx="75" cy="58" r="5" />
        </g>
      </symbol>
      <symbol id="m-hyacinth" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 96 L75 178" />
          <path d="M75 130 C57 128 46 140 43 160 M75 142 C93 140 104 150 107 170" />
          <path d="M75 24 C58 30 50 52 52 78 C58 96 92 96 98 78 C100 52 92 30 75 24Z" />
          <circle cx="75" cy="40" r="5" />
          <circle cx="63" cy="54" r="5" />
          <circle cx="87" cy="54" r="5" />
          <circle cx="72" cy="66" r="5" />
          <circle cx="86" cy="68" r="5" />
          <circle cx="61" cy="70" r="5" />
          <circle cx="76" cy="82" r="5" />
        </g>
      </symbol>
      <symbol id="m-lily" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 84 L75 178" />
          <path d="M75 128 C55 126 42 138 38 160 M75 140 C95 138 108 148 112 170" />
          <path d="M75 78 C70 56 60 40 40 30 C58 44 66 58 70 76 M75 78 C80 56 90 40 110 30 C92 44 84 58 80 76 M75 78 C75 52 75 40 75 22 M75 78 C66 60 50 52 36 54 C54 60 64 68 72 80 M75 78 C84 60 100 52 114 54 C96 60 86 68 78 80" />
          <path d="M75 78 L70 50 M75 78 L80 50 M75 78 L75 48" />
          <circle cx="70" cy="48" r="2.4" />
          <circle cx="80" cy="48" r="2.4" />
          <circle cx="75" cy="46" r="2.4" />
        </g>
      </symbol>
      <symbol id="m-crocus" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M62 96 L60 176 M75 92 L75 178 M88 96 L90 176" />
          <path d="M75 92 C66 92 58 80 58 62 C58 46 66 34 75 34 C84 34 92 46 92 62 C92 80 84 92 75 92Z" />
          <path d="M75 92 C70 92 64 82 64 64 M75 92 C80 92 86 82 86 64 M75 92 L75 40" />
        </g>
      </symbol>
    </svg>
  );
}
