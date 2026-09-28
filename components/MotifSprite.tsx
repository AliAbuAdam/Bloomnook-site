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
      <symbol id="m-amaryllis" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 94 L75 178" />
          <path d="M75 140 C57 138 46 148 43 166 M75 150 C93 148 104 156 107 172" />
          <ellipse cx="75" cy="24" rx="9" ry="16" />
          <ellipse cx="98" cy="37" rx="9" ry="16" transform="rotate(60 98 37)" />
          <ellipse cx="98" cy="63" rx="9" ry="16" transform="rotate(120 98 63)" />
          <ellipse cx="75" cy="76" rx="9" ry="16" transform="rotate(180 75 76)" />
          <ellipse cx="52" cy="63" rx="9" ry="16" transform="rotate(240 52 63)" />
          <ellipse cx="52" cy="37" rx="9" ry="16" transform="rotate(300 52 37)" />
          <circle cx="75" cy="50" r="7" />
          <circle cx="75" cy="50" r="2.5" />
        </g>
      </symbol>
      <symbol id="m-iris" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 88 L75 178" />
          <path d="M61 176 C59 142 61 114 67 90 M89 176 C91 142 89 114 83 90" />
          <path d="M75 88 C62 78 56 60 60 36 C70 48 75 66 75 86" />
          <path d="M75 88 C88 78 94 60 90 36 C80 48 75 66 75 86" />
          <path d="M75 88 C75 64 75 46 75 26" />
          <path d="M75 88 C61 90 51 100 47 116 C57 113 68 102 74 90" />
          <path d="M75 88 C89 90 99 100 103 116 C93 113 82 102 76 90" />
        </g>
      </symbol>
      <symbol id="m-gladiolus" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 22 L75 178" />
          <path d="M75 146 C60 144 50 152 46 168 M75 154 C90 152 100 160 104 174" />
          <ellipse cx="75" cy="16" rx="4" ry="7" />
          <path d="M75 40 C66 38 60 32 58 22 M75 40 C70 34 68 26 70 18" />
          <path d="M75 62 C84 60 90 54 92 44 M75 62 C80 56 82 48 80 40" />
          <path d="M75 84 C66 82 60 76 58 66 M75 84 C70 78 68 70 70 62" />
          <path d="M75 106 C84 104 90 98 92 88 M75 106 C80 100 82 92 80 84" />
        </g>
      </symbol>
      <symbol id="m-allium" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 88 L75 178" />
          <path d="M75 148 C59 146 48 154 44 170 M75 156 C91 154 102 162 106 176" />
          <circle cx="75" cy="54" r="32" />
          <path d="M75 54 L75 32 M75 54 L94 43 M75 54 L94 65 M75 54 L75 76 M75 54 L56 65 M75 54 L56 43" />
          <circle cx="75" cy="32" r="2.4" />
          <circle cx="94" cy="43" r="2.4" />
          <circle cx="94" cy="65" r="2.4" />
          <circle cx="75" cy="76" r="2.4" />
          <circle cx="56" cy="65" r="2.4" />
          <circle cx="56" cy="43" r="2.4" />
        </g>
      </symbol>
      <symbol id="m-muscari" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 98 L75 178" />
          <path d="M61 176 C59 144 62 120 70 100 M89 176 C91 144 88 120 80 100" />
          <circle cx="75" cy="28" r="6" />
          <circle cx="66" cy="41" r="6" />
          <circle cx="84" cy="41" r="6" />
          <circle cx="59" cy="55" r="6" />
          <circle cx="75" cy="54" r="6" />
          <circle cx="91" cy="55" r="6" />
          <circle cx="63" cy="69" r="6" />
          <circle cx="87" cy="69" r="6" />
          <circle cx="75" cy="68" r="6" />
          <circle cx="69" cy="83" r="6" />
          <circle cx="81" cy="83" r="6" />
          <circle cx="75" cy="94" r="5" />
        </g>
      </symbol>
      <symbol id="m-dahlia" viewBox="0 0 150 190">
        <g {...g}>
          <path d="M75 92 L75 178" />
          <path d="M75 142 C58 140 47 150 44 168 M75 152 C92 150 103 158 106 174" />
          <ellipse cx="75" cy="25" rx="6.5" ry="14" />
          <ellipse cx="93" cy="32" rx="6.5" ry="14" transform="rotate(45 93 32)" />
          <ellipse cx="100" cy="50" rx="6.5" ry="14" transform="rotate(90 100 50)" />
          <ellipse cx="93" cy="68" rx="6.5" ry="14" transform="rotate(135 93 68)" />
          <ellipse cx="75" cy="75" rx="6.5" ry="14" transform="rotate(180 75 75)" />
          <ellipse cx="57" cy="68" rx="6.5" ry="14" transform="rotate(225 57 68)" />
          <ellipse cx="50" cy="50" rx="6.5" ry="14" transform="rotate(270 50 50)" />
          <ellipse cx="57" cy="32" rx="6.5" ry="14" transform="rotate(315 57 32)" />
          <circle cx="75" cy="50" r="11" />
          <path d="M75 50 L75 41 M75 50 L81 44 M75 50 L84 50 M75 50 L81 56 M75 50 L75 59 M75 50 L69 56 M75 50 L66 50 M75 50 L69 44" />
        </g>
      </symbol>
    </svg>
  );
}
