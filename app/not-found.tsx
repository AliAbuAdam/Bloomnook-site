"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts } from "@/lib/products";
import { productSlug, categorySlug } from "@/lib/slug";

/**
 * Страница 404 (GitHub Pages отдаёт её для любого несуществующего пути).
 *
 * Особый случай: /product/<slug>/ товара, добавленного в админке ПОСЛЕ
 * последней сборки сайта — его статической страницы ещё нет. Тогда ищем товар
 * по slug прямо в PocketBase и уводим на рабочий легаси-адрес /product/?id=…,
 * чтобы покупатель не упёрся в 404. После пересборки (ночной или ручной в
 * Actions) у товара появится полноценная статическая страница.
 */
export default function NotFound() {
  // Пока не выяснили, «спасаемый» ли это адрес — показываем нейтральную заглушку.
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    let alive = true;
    const path = window.location.pathname;
    const prod = path.match(/^\/product\/([^/]+)\/?$/);
    const cat = path.match(/^\/shop\/([^/]+)\/?$/);
    if (!prod && !cat) {
      setResolving(false);
      return;
    }
    fetchProducts()
      .then((list) => {
        if (!alive) return;
        if (prod) {
          const slug = decodeURIComponent(prod[1]);
          const hit = list.find((p) => productSlug(p) === slug);
          if (hit) return window.location.replace(`/product/?id=${hit.id}`);
        } else if (cat) {
          const slug = decodeURIComponent(cat[1]);
          const hit = list.find((p) => categorySlug(p.cat) === slug);
          if (hit) return window.location.replace(`/shop/?cat=${encodeURIComponent(hit.cat)}`);
        }
        setResolving(false);
      })
      .catch(() => {
        if (alive) setResolving(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main>
      <div
        className="bn-pad"
        style={{ maxWidth: 1240, margin: "0 auto", padding: "110px 32px", textAlign: "center" }}
      >
        {resolving ? (
          <p style={{ fontSize: 16, color: "var(--muted)", margin: 0 }}>Загрузка…</p>
        ) : (
          <>
            <h1 className="bn-h" style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 600, margin: "0 0 12px" }}>
              Страница не найдена
            </h1>
            <p style={{ fontSize: 16, color: "var(--muted)", margin: "0 0 24px" }}>
              Такой страницы нет или она была перемещена.
            </p>
            <Link
              href="/shop"
              style={{
                display: "inline-block",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "12px 22px",
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              Перейти в магазин
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
