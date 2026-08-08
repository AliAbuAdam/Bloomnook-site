import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShopBrowser from "@/components/ShopBrowser";
import { buildCategories, buildDisplayProducts } from "@/lib/catalog-build";
import { categorySlug, categoryPlural, categoryGenitive } from "@/lib/slug";
import { SITE_URL, productUrl, breadcrumbsJsonLd, jsonLdScript } from "@/lib/seo";

/**
 * Статическая SEO-страница категории: /shop/<slug>/ («Тюльпаны», «Лилии»…).
 * Именно такие страницы ранжируются по коммерческим запросам вида
 * «купить луковицы тюльпанов». Генерируются при сборке из категорий,
 * реально встречающихся в каталоге PocketBase.
 */
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ category: string }[]> {
  const cats = await buildCategories();
  return cats.map((c) => ({ category: categorySlug(c) }));
}

async function categoryFromSlug(slug: string): Promise<string | null> {
  const cats = await buildCategories();
  return cats.find((c) => categorySlug(c) === slug) ?? null;
}

/** «Купить луковицы тюльпанов» либо «Тюльпаны — купить луковицы» для незнакомых категорий. */
function categoryTitle(cat: string): string {
  const gen = categoryGenitive(cat);
  return gen
    ? `Луковицы ${gen} — купить с доставкой по России`
    : `${categoryPlural(cat)} — купить луковицы с доставкой по России`;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = await categoryFromSlug(category);
  if (!cat) return {};
  const products = (await buildDisplayProducts()).filter((p) => p.cat === cat);
  const names = products.slice(0, 3).map((p) => p.name).join(", ");
  const description =
    `${categoryPlural(cat)} в каталоге Bloom Nook: ${products.length ? `${names} и другие сорта. ` : ""}` +
    "Отборные калиброванные луковицы, бесплатная доставка по всей России, памятка по посадке в каждом заказе.";
  return {
    title: categoryTitle(cat),
    description: description.slice(0, 250),
    alternates: { canonical: `/shop/${category}/` },
    openGraph: {
      type: "website",
      url: `/shop/${category}/`,
      title: categoryTitle(cat),
      description: description.slice(0, 250),
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = await categoryFromSlug(category);
  if (!cat) notFound();

  const all = await buildDisplayProducts();
  const products = all.filter((p) => p.cat === cat);
  const gen = categoryGenitive(cat);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categoryPlural(cat),
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: productUrl(p),
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(itemListJsonLd)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbsJsonLd([
            ["Главная", `${SITE_URL}/`],
            ["Магазин", `${SITE_URL}/shop/`],
            [categoryPlural(cat), `${SITE_URL}/shop/${category}/`],
          ]),
        )}
      />
      <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
          <h1 className="bn-h" style={{ fontSize: "clamp(30px, 6vw, 46px)", fontWeight: 600, margin: 0 }}>
            {categoryPlural(cat)}
          </h1>
          <p style={{ fontSize: 15, color: "var(--muted)", margin: "12px auto 0", maxWidth: 640, lineHeight: 1.6 }}>
            {gen ? `Луковицы ${gen}` : `${categoryPlural(cat)} — луковицы`} с бесплатной доставкой по всей России:
            отборный калиброванный посадочный материал и памятка по посадке в каждом заказе.
          </p>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 14 }}>
            <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
              Главная
            </Link>{" "}
            /&nbsp;{" "}
            <Link href="/shop" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
              Магазин
            </Link>{" "}
            /&nbsp; <span style={{ color: "var(--ink)" }}>{categoryPlural(cat)}</span>
          </div>
        </div>
      </div>

      <ShopBrowser fallback={products} initialCat={cat} />
    </main>
  );
}
