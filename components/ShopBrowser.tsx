"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Close, Menu } from "./icons";
import { fetchDisplayProducts } from "@/lib/products";
import { BLOOM_MONTHS, money, type Product, type Season } from "@/lib/data";

const PAGE_SIZE = 9;

const SEASON_OPTIONS: { value: Season; label: string }[] = [
  { value: "autumn", label: "Осенняя посадка" },
  { value: "spring", label: "Весенняя посадка" },
];

type HeightBucket = "low" | "mid" | "high";
const HEIGHT_OPTIONS: { value: HeightBucket; label: string }[] = [
  { value: "low", label: "Низкие (до 50 см)" },
  { value: "mid", label: "Средние (50–80 см)" },
  { value: "high", label: "Высокие (от 80 см)" },
];
function heightBucket(cm: number): HeightBucket {
  if (cm < 50) return "low";
  if (cm < 80) return "mid";
  return "high";
}

const SORTS = [
  { value: "popular", label: "Популярные" },
  { value: "cheap", label: "Сначала дешёвые" },
  { value: "expensive", label: "Сначала дорогие" },
  { value: "name", label: "По названию" },
] as const;
type SortValue = (typeof SORTS)[number]["value"];

const filterGroupTitle: React.CSSProperties = { fontSize: 16, fontWeight: 800, margin: "0 0 14px" };
const filterList: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 11, fontSize: 14.5, color: "#42503f" };
const filterRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" };
const divider: React.CSSProperties = { height: 1, background: "var(--line)" };

const boxBase: React.CSSProperties = { width: 18, height: 18, borderRadius: 5, flex: "none" };
const boxEmpty: React.CSSProperties = { ...boxBase, border: "1.5px solid var(--line)" };
const boxChecked: React.CSSProperties = {
  ...boxBase,
  border: "1.5px solid var(--accent)",
  background: "var(--accent)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function Checkbox({ checked }: { checked?: boolean }) {
  return checked ? (
    <span style={boxChecked}>
      <Check style={{ stroke: "#fff" }} />
    </span>
  ) : (
    <span style={boxEmpty} />
  );
}

const pageDot: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  cursor: "pointer",
  border: "1.5px solid var(--line)",
};

/** Toggle a value inside a Set, returning a new Set (immutable update). */
function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function ShopBrowser({ fallback }: { fallback: Product[] }) {
  const [items, setItems] = useState<Product[]>(fallback);

  // filter state
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [seasons, setSeasons] = useState<Set<Season>>(new Set());
  const [months, setMonths] = useState<Set<string>>(new Set());
  const [heights, setHeights] = useState<Set<HeightBucket>>(new Set());
  const [stock, setStock] = useState<Set<"in" | "order">>(new Set());
  const [price, setPrice] = useState<[number, number] | null>(null);
  const [sort, setSort] = useState<SortValue>("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  // Mobile/tablet: filters live in a slide-in panel.
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  useEffect(() => {
    let alive = true;
    fetchDisplayProducts()
      .then((list) => {
        if (alive && list.length) setItems(list);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      alive = false;
    };
  }, []);

  // option lists derived from the catalogue
  const catList = useMemo(() => Array.from(new Set(items.map((p) => p.cat))), [items]);
  const monthList = useMemo(() => {
    const present = new Set(items.flatMap((p) => p.bloomMonths));
    return BLOOM_MONTHS.filter((m) => present.has(m));
  }, [items]);

  // price bounds (only over products that actually have a price)
  const priceBounds = useMemo<[number, number] | null>(() => {
    const priced = items.map((p) => p.priceValue).filter((v) => v > 0);
    if (!priced.length) return null;
    return [Math.min(...priced), Math.max(...priced)];
  }, [items]);

  // reset / clamp the price range whenever bounds change
  useEffect(() => {
    setPrice(priceBounds ? [priceBounds[0], priceBounds[1]] : null);
  }, [priceBounds]);

  const filtered = useMemo(() => {
    const list = items.filter((p) => {
      if (cats.size && !cats.has(p.cat)) return false;
      if (seasons.size && !seasons.has(p.season)) return false;
      if (months.size && !p.bloomMonths.some((m) => months.has(m))) return false;
      if (heights.size && !heights.has(heightBucket(p.heightCm))) return false;
      if (stock.size && !stock.has(p.inStock ? "in" : "order")) return false;
      if (price && p.priceValue > 0 && (p.priceValue < price[0] || p.priceValue > price[1])) return false;
      return true;
    });
    const big = Number.MAX_SAFE_INTEGER;
    list.sort((a, b) => {
      switch (sort) {
        case "cheap":
          return (a.priceValue || big) - (b.priceValue || big);
        case "expensive":
          return b.priceValue - a.priceValue;
        case "name":
          return a.name.localeCompare(b.name, "ru");
        default:
          return b.ratingValue - a.ratingValue;
      }
    });
    return list;
  }, [items, cats, seasons, months, heights, stock, price, sort]);

  // keep page in range as the result set changes
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const shown = filtered.slice(start, start + PAGE_SIZE);
  const countLabel = filtered.length
    ? `Показано ${start + 1}–${start + shown.length} из ${filtered.length} ${plural(filtered.length)}`
    : "Ничего не найдено";

  const hasAnyFilter = cats.size || seasons.size || months.size || heights.size || stock.size;

  return (
    <div
      className="bn-pad bn-shop-grid"
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "48px 32px 72px",
        display: "grid",
        gridTemplateColumns: "256px 1fr",
        gap: 40,
        alignItems: "start",
      }}
    >
      {/* backdrop for the mobile filter panel */}
      <div
        className={`bn-drawer-backdrop${filtersOpen ? " open" : ""}`}
        onClick={() => setFiltersOpen(false)}
        aria-hidden={!filtersOpen}
      />

      {/* filters */}
      <aside
        className={`bn-filters${filtersOpen ? " open" : ""}`}
        style={{ position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 30 }}
      >
        <div className="bn-filter-close" style={{ alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Фильтры</h3>
          <button
            onClick={() => setFiltersOpen(false)}
            aria-label="Закрыть фильтры"
            style={{ border: "none", background: "none", padding: 6, cursor: "pointer", color: "var(--ink)" }}
          >
            <Close size={22} />
          </button>
        </div>
        <div>
          <h3 style={filterGroupTitle}>Тип цветка</h3>
          <div style={filterList}>
            {catList.map((c) => (
              <label key={c} style={filterRow} onClick={() => setCats((s) => toggle(s, c))}>
                <Checkbox checked={cats.has(c)} />
                {c}
              </label>
            ))}
          </div>
        </div>
        <div style={divider} />
        <div>
          <h3 style={filterGroupTitle}>Срок посадки</h3>
          <div style={filterList}>
            {SEASON_OPTIONS.map((s) => (
              <label key={s.value} style={filterRow} onClick={() => setSeasons((cur) => toggle(cur, s.value))}>
                <Checkbox checked={seasons.has(s.value)} />
                {s.label}
              </label>
            ))}
          </div>
        </div>
        {monthList.length > 0 && (
          <>
            <div style={divider} />
            <div>
              <h3 style={filterGroupTitle}>Срок цветения</h3>
              <div style={filterList}>
                {monthList.map((m) => (
                  <label key={m} style={filterRow} onClick={() => setMonths((cur) => toggle(cur, m))}>
                    <Checkbox checked={months.has(m)} />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
        <div style={divider} />
        <div>
          <h3 style={filterGroupTitle}>Высота</h3>
          <div style={filterList}>
            {HEIGHT_OPTIONS.map((h) => (
              <label key={h.value} style={filterRow} onClick={() => setHeights((cur) => toggle(cur, h.value))}>
                <Checkbox checked={heights.has(h.value)} />
                {h.label}
              </label>
            ))}
          </div>
        </div>
        <div style={divider} />
        <div>
          <h3 style={filterGroupTitle}>Цена</h3>
          {price && priceBounds && priceBounds[0] !== priceBounds[1] ? (
            <PriceRange min={priceBounds[0]} max={priceBounds[1]} value={price} onChange={setPrice} />
          ) : (
            <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>
              Цены появятся после заполнения каталога.
            </div>
          )}
        </div>
        <div style={divider} />
        <div>
          <h3 style={filterGroupTitle}>Наличие</h3>
          <div style={filterList}>
            <label style={filterRow} onClick={() => setStock((cur) => toggle(cur, "in"))}>
              <Checkbox checked={stock.has("in")} />
              В наличии
            </label>
            <label style={filterRow} onClick={() => setStock((cur) => toggle(cur, "order"))}>
              <Checkbox checked={stock.has("order")} />
              Под заказ
            </label>
          </div>
        </div>
        {hasAnyFilter ? (
          <button
            onClick={() => {
              setCats(new Set());
              setSeasons(new Set());
              setMonths(new Set());
              setHeights(new Set());
              setStock(new Set());
            }}
            style={{
              border: "1.5px solid var(--line)",
              background: "#fff",
              color: "var(--ink)",
              fontWeight: 700,
              fontSize: 14,
              padding: "10px 16px",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            Сбросить фильтры
          </button>
        ) : null}
      </aside>

      {/* grid */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
          <button
            className="bn-filter-toggle"
            onClick={() => setFiltersOpen(true)}
            style={{
              alignItems: "center",
              gap: 8,
              border: "1.5px solid var(--line)",
              background: "#fff",
              borderRadius: 999,
              padding: "9px 16px",
              fontWeight: 700,
              fontSize: 14,
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            <Menu size={18} /> Фильтры
          </button>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>{countLabel}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, position: "relative" }}>
            <span style={{ color: "var(--muted)" }}>Сортировка:</span>
            <span
              onClick={() => setSortOpen((o) => !o)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1.5px solid var(--line)",
                borderRadius: 999,
                padding: "9px 16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {SORTS.find((s) => s.value === sort)?.label}
              <ChevronDown />
            </span>
            {sortOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  boxShadow: "0 18px 40px -24px rgba(24,53,18,0.5)",
                  padding: 6,
                  zIndex: 10,
                  minWidth: 200,
                }}
              >
                {SORTS.map((s) => (
                  <div
                    key={s.value}
                    onClick={() => {
                      setSort(s.value);
                      setSortOpen(false);
                    }}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: s.value === sort ? 700 : 500,
                      background: s.value === sort ? "var(--sage-2)" : "transparent",
                    }}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {shown.length ? (
          <div className="bn-g-prod3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {shown.map((item) => (
              <ProductCard key={item.id} item={item} showHeart showButton />
            ))}
          </div>
        ) : (
          <div style={{ padding: "64px 0", textAlign: "center", color: "var(--muted)", fontSize: 15 }}>
            По выбранным фильтрам товаров нет. Попробуйте сбросить часть условий.
          </div>
        )}

        {pageCount > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 42 }}>
            <span
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{ ...pageDot, color: "var(--muted)", opacity: safePage === 1 ? 0.4 : 1 }}
            >
              <ChevronLeft />
            </span>
            {Array.from({ length: pageCount }).map((_, i) => {
              const n = i + 1;
              const active = n === safePage;
              return (
                <span
                  key={n}
                  onClick={() => setPage(n)}
                  style={active ? { ...pageDot, border: "none", background: "var(--accent)", color: "#fff" } : pageDot}
                >
                  {n}
                </span>
              );
            })}
            <span
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              style={{ ...pageDot, color: "var(--ink)", opacity: safePage === pageCount ? 0.4 : 1 }}
            >
              <ChevronRight />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function plural(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "товара";
  return "товаров";
}

function PriceRange({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 12 }}>
        {money(lo)} — {money(hi)}
      </div>
      <div style={{ position: "relative", height: 18 }}>
        <div style={{ position: "absolute", top: 7, left: 0, right: 0, height: 4, background: "var(--line)", borderRadius: 4 }} />
        <div
          style={{
            position: "absolute",
            top: 7,
            left: `${pct(lo)}%`,
            right: `${100 - pct(hi)}%`,
            height: 4,
            background: "var(--accent)",
            borderRadius: 4,
          }}
        />
        <input
          className="bn-range"
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          aria-label="Минимальная цена"
        />
        <input
          className="bn-range"
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          aria-label="Максимальная цена"
        />
      </div>
    </div>
  );
}
