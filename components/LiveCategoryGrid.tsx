"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Motif from "./Motif";
import { fetchDisplayProducts } from "@/lib/products";
import { sortsLabel, type Motif as MotifKind } from "@/lib/data";

/** Карточка категории в том виде, в каком её рисует витрина. */
interface CategoryCard {
  name: string;
  useHref: string;
  count: number;
}

const card: React.CSSProperties = {
  cursor: "pointer",
  background: "var(--cream)",
  border: "1px solid var(--line)",
  borderRadius: 18,
  padding: "24px 14px",
  textAlign: "center",
  textDecoration: "none",
  color: "inherit",
};

/**
 * Собрать карточки категорий из реальных товаров: считаем только то, что есть
 * в наличии, группируем по категории (`cat`), а пустые категории не показываем.
 * Порядок — по числу позиций в наличии (по убыванию).
 */
function buildCategories(products: { cat: string; motif: MotifKind; inStock: boolean }[]): CategoryCard[] {
  const groups = new Map<string, { motif: MotifKind; count: number }>();
  for (const p of products) {
    if (!p.inStock) continue;
    const name = p.cat.trim();
    if (!name) continue;
    const g = groups.get(name);
    if (g) g.count += 1;
    else groups.set(name, { motif: p.motif, count: 1 });
  }
  return Array.from(groups.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, g]) => ({ name, useHref: "#m-" + g.motif, count: g.count }));
}

/**
 * Сетка категорий, полностью построенная по реальному стоку из PocketBase:
 * категории без товаров в наличии не показываются. До загрузки и при пустом
 * стоке секция ничего не рисует (как грид «Хиты сезона») — чтобы на витрине
 * никогда не висели фейковые категории.
 */
export default function LiveCategoryGrid() {
  const [cards, setCards] = useState<CategoryCard[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchDisplayProducts()
      .then((list) => {
        if (alive) setCards(buildCategories(list));
      })
      .catch(() => {
        if (alive) setCards([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!cards || cards.length === 0) return null;

  return (
    <div className="bn-g-cats" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 18 }}>
      {cards.map((cat) => (
        <Link key={cat.name} href={`/shop?cat=${encodeURIComponent(cat.name)}`} className="bn-cat" style={card}>
          <div style={{ height: 78, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <Motif href={cat.useHref} strokeWidth={3} style={{ width: "auto", height: 78 }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{cat.name}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{sortsLabel(cat.count)}</div>
        </Link>
      ))}
    </div>
  );
}
