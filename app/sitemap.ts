import type { MetadataRoute } from "next";
import { buildDisplayProducts, buildCategories } from "@/lib/catalog-build";
import { productSlug, categorySlug } from "@/lib/slug";
import { SITE_URL } from "@/lib/seo";

/** sitemap.xml — генерируется при сборке из каталога PocketBase. */
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await buildDisplayProducts();
  const categories = await buildCategories();

  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/shop/`, priority: 0.9 },
    { url: `${SITE_URL}/contacts/`, priority: 0.3 },
    { url: `${SITE_URL}/returns/`, priority: 0.3 },
    { url: `${SITE_URL}/privacy/`, priority: 0.1 },
  ];

  const catPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/shop/${categorySlug(c)}/`,
    priority: 0.8,
  }));

  // Set убирает дубли: товары с одинаковым названием делят один slug
  // (страница генерируется только для первого, см. app/product/[slug]).
  const productPages: MetadataRoute.Sitemap = Array.from(
    new Set(products.map((p) => `${SITE_URL}/product/${productSlug(p)}/`)),
  ).map((url) => ({ url, priority: 0.7 }));

  return [...statics, ...catPages, ...productPages];
}
