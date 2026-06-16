"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { fetchDisplayProducts } from "@/lib/products";
import type { Product } from "@/lib/data";

/**
 * Product grid that hydrates from Firestore but renders a static fallback first,
 * so the storefront stays pixel-perfect on the server and never breaks if
 * Firestore is empty or unreachable.
 */
export default function LiveProductGrid({
  fallback,
  limit,
  columns,
  gap = 22,
  showHeart = false,
  showButton = false,
}: {
  fallback: Product[];
  limit?: number;
  columns: number;
  gap?: number;
  showHeart?: boolean;
  showButton?: boolean;
}) {
  const [items, setItems] = useState<Product[]>(fallback);

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

  const shown = limit ? items.slice(0, limit) : items;

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns},1fr)`, gap }}>
      {shown.map((item) => (
        <ProductCard key={item.id} item={item} showHeart={showHeart} showButton={showButton} />
      ))}
    </div>
  );
}
