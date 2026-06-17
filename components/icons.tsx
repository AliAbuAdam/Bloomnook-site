import type { CSSProperties } from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  strokeWidth?: number;
  style?: CSSProperties;
  className?: string;
}

function strokeProps(size: number, sw: number, style?: CSSProperties): {
  viewBox: string;
  style: CSSProperties;
} {
  return {
    viewBox: "0 0 24 24",
    style: {
      width: size,
      height: size,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: sw,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...style,
    },
  };
}

export function Star({ size = 18, style, color = "var(--amber)" }: IconProps & { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, fill: color, ...style }}>
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5 21.4l1.4-6.8L1.3 9.9l6.9-.8z" />
    </svg>
  );
}

export function Stars({ count = 5, size = 18, gap = 2, color = "var(--amber)" }: { count?: number; size?: number; gap?: number; color?: string }) {
  return (
    <span style={{ display: "flex", gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} color={color} />
      ))}
    </span>
  );
}

export function ArrowRight({ size = 18, strokeWidth = 1.9, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Heart({ size = 21, strokeWidth = 1.7, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function Truck({ size = 24, strokeWidth = 1.6, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7.5 19a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2zM18 19a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2z" />
    </svg>
  );
}

export function Shield({ size = 24, strokeWidth = 1.6, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function Leaf({ size = 24, strokeWidth = 1.6, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19c3-3 6-5 9-6" />
    </svg>
  );
}

export function Check({ size = 13, strokeWidth = 2.4, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function Plus({ size = 18, strokeWidth = 1.9, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Minus({ size = 18, strokeWidth = 1.9, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function ChevronDown({ size = 15, strokeWidth = 1.9, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronLeft({ size = 17, strokeWidth = 1.9, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function ChevronRight({ size = 17, strokeWidth = 1.9, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function Search({ size = 21, strokeWidth = 1.7, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", ...style }}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  );
}

export function User({ size = 21, strokeWidth = 1.7, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </svg>
  );
}

export function Cart({ size = 21, strokeWidth = 1.7, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M6 8h12l-1 12H7zM9 8V6.5a3 3 0 016 0V8" />
    </svg>
  );
}

export function Phone({ size = 15, strokeWidth = 1.7, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M4 5c0 8 7 15 15 15l2-3-4-2-2 2c-3-1.5-5.5-4-7-7l2-2-2-4z" />
    </svg>
  );
}

export function Lock({ size = 15, strokeWidth = 1.6, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M6 11V8a6 6 0 0112 0v3M5 11h14v9H5z" />
    </svg>
  );
}

export function Close({ size = 18, strokeWidth = 1.9, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", ...style }}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Refresh({ size = 26, strokeWidth = 1.6, style }: IconProps) {
  return (
    <svg {...strokeProps(size, strokeWidth, style)}>
      <path d="M21 12a8 8 0 11-3-6.2L21 4v5h-5" />
    </svg>
  );
}

/** Telegram-style paper plane (filled). */
export function Telegram({ size = 13, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, fill: "currentColor", ...style }}>
      <path d="M21 4 3 11l5 2 2 6 3-4 4 3 4-14z" />
    </svg>
  );
}

/** YouTube-style play glyph (filled). */
export function Play({ size = 13, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, fill: "currentColor", ...style }}>
      <path d="M10 9l5 3-5 3z" />
    </svg>
  );
}

/** Yandex brand mark — the "Я" glyph. */
export function Yandex({ size = 14, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, ...style }}>
      <text
        x="12"
        y="18"
        textAnchor="middle"
        fontSize="20"
        fontWeight={800}
        fontFamily="Arial, Helvetica, sans-serif"
        fill="currentColor"
      >
        Я
      </text>
    </svg>
  );
}
