"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Motif, Product } from "@/lib/data";

/**
 * Позиция корзины. Один и тот же товар в разных фасовках (`pack`) — это
 * РАЗНЫЕ позиции, поэтому ключ строки = `id:pack`.
 */
export interface CartLine {
  id: string; // id товара (записи PocketBase)
  pack: number; // фасовка: число штук в комплекте (1 — поштучно)
  qty: number; // сколько комплектов в корзине
  name: string;
  cat: string;
  motif: Motif;
  image: string; // обложка, "" — рисуем силуэт-мотив
  useHref: string;
  unitPrice: number; // цена за ОДНУ штуку, ₽ (0 — «цена по запросу»)
}

interface CartContextValue {
  lines: CartLine[];
  /** Прошла ли гидратация из localStorage (до неё корзина считается пустой). */
  hydrated: boolean;
  /** Суммарное количество комплектов (для бейджа в шапке). */
  totalQty: number;
  /** Суммарное количество луковиц (комплект × фасовка) — для строки «Товаров». */
  totalPieces: number;
  /** Сумма заказа, ₽. */
  subtotal: number;
  add: (product: Product, pack: number, qty: number) => void;
  setQty: (id: string, pack: number, qty: number) => void;
  remove: (id: string, pack: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "bloomnook:cart:v1";

/** Ключ строки корзины. */
function lineKey(id: string, pack: number): string {
  return `${id}:${pack}`;
}

/** Прочитать корзину из localStorage (безопасно при SSR и битых данных). */
function readStored(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l): l is CartLine => l && typeof l.id === "string")
      .map((l) => ({
        id: l.id,
        pack: Math.max(1, Math.floor(Number(l.pack) || 1)),
        qty: Math.max(1, Math.floor(Number(l.qty) || 1)),
        name: String(l.name ?? ""),
        cat: String(l.cat ?? ""),
        motif: l.motif,
        image: String(l.image ?? ""),
        useHref: String(l.useHref ?? ""),
        unitPrice: Number(l.unitPrice) || 0,
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Гидратация из localStorage только на клиенте — чтобы серверный рендер
  // (статический экспорт) совпал с первым клиентским рендером.
  useEffect(() => {
    setLines(readStored());
    setHydrated(true);
  }, []);

  // Сохраняем корзину после гидратации (до неё `lines` пуст и затёр бы хранилище).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* приватный режим / переполнение — не критично */
    }
  }, [lines, hydrated]);

  const add = useCallback((product: Product, pack: number, qty: number) => {
    const p = Math.max(1, Math.floor(pack || 1));
    const q = Math.max(1, Math.floor(qty || 1));
    const id = String(product.id);
    setLines((prev) => {
      const key = lineKey(id, p);
      const existing = prev.find((l) => lineKey(l.id, l.pack) === key);
      if (existing) {
        return prev.map((l) => (lineKey(l.id, l.pack) === key ? { ...l, qty: l.qty + q } : l));
      }
      return [
        ...prev,
        {
          id,
          pack: p,
          qty: q,
          name: product.name,
          cat: product.cat,
          motif: product.motif,
          image: product.image,
          useHref: product.useHref,
          unitPrice: product.priceValue,
        },
      ];
    });
  }, []);

  const setQty = useCallback((id: string, pack: number, qty: number) => {
    const key = lineKey(id, pack);
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l.id, l.pack) !== key)
        : prev.map((l) => (lineKey(l.id, l.pack) === key ? { ...l, qty: Math.floor(qty) } : l)),
    );
  }, []);

  const remove = useCallback((id: string, pack: number) => {
    const key = lineKey(id, pack);
    setLines((prev) => prev.filter((l) => lineKey(l.id, l.pack) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const { totalQty, totalPieces, subtotal } = useMemo(() => {
    return lines.reduce(
      (acc, l) => {
        acc.totalQty += l.qty;
        acc.totalPieces += l.qty * l.pack;
        acc.subtotal += l.qty * l.pack * l.unitPrice;
        return acc;
      },
      { totalQty: 0, totalPieces: 0, subtotal: 0 },
    );
  }, [lines]);

  const value: CartContextValue = {
    lines,
    hydrated,
    totalQty,
    totalPieces,
    subtotal,
    add,
    setQty,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart должен использоваться внутри <CartProvider>");
  }
  return ctx;
}

export { lineKey };
