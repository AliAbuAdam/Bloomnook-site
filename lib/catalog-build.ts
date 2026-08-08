import { fetchProducts, toDisplayProduct, type AdminProduct } from "./products";
import type { Product } from "./data";

/**
 * Каталог для статической сборки (generateStaticParams / generateMetadata /
 * серверные страницы). Товары запрашиваются из PocketBase один раз за сборку
 * (модульный кэш): страницы товаров, категорий, sitemap и YML-фид переиспользуют
 * один запрос.
 *
 * Если база недоступна (локальная сборка без PocketBase) — возвращаем пустой
 * список с предупреждением: сборка не падает, но SEO-страницы товаров не
 * генерируются. На CI переменная NEXT_PUBLIC_PB_URL указывает на прод.
 */
let cached: Promise<AdminProduct[]> | null = null;

export function buildProducts(): Promise<AdminProduct[]> {
  if (!cached) {
    cached = fetchProducts().catch((e) => {
      console.warn(
        `[seo] PocketBase недоступен (${process.env.NEXT_PUBLIC_PB_URL || "localhost"}): ` +
          `страницы товаров не будут сгенерированы. ${e?.message ?? e}`,
      );
      return [];
    });
  }
  return cached;
}

/** Товары в витринном виде (с ценами-строками и т.п.) — для рендера страниц. */
export async function buildDisplayProducts(): Promise<Product[]> {
  const list = await buildProducts();
  return list.map((p, i) => toDisplayProduct(p, i));
}

/** Список категорий, встречающихся в каталоге (в порядке каталога, без пустых). */
export async function buildCategories(): Promise<string[]> {
  const list = await buildProducts();
  const seen = new Set<string>();
  for (const p of list) {
    const cat = p.cat.trim();
    if (cat) seen.add(cat);
  }
  return Array.from(seen);
}
