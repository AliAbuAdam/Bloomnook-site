import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import LiveProductGrid from "@/components/LiveProductGrid";
import { buildDisplayProducts } from "@/lib/catalog-build";
import { productSlug } from "@/lib/slug";
import {
  SITE_URL,
  productUrl,
  productDescription,
  productJsonLd,
  breadcrumbsJsonLd,
  jsonLdScript,
} from "@/lib/seo";
import type { Product } from "@/lib/data";

/**
 * Статическая SEO-страница товара: /product/<slug>/.
 *
 * Генерируется при сборке из PocketBase — название, описание, характеристики,
 * цена и фото попадают прямо в HTML, поэтому страницу полноценно индексируют
 * Яндекс и Google. После загрузки в браузере данные тихо обновляются из базы
 * (ProductView), так что цена и наличие всегда свежие.
 *
 * Товары, добавленные после сборки, доступны по легаси-адресу /product?id=…
 * (см. app/not-found.tsx) до следующего деплоя.
 */
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const products = await buildDisplayProducts();
  const seen = new Set<string>();
  const params: { slug: string }[] = [];
  for (const p of products) {
    const slug = productSlug(p);
    if (seen.has(slug)) {
      console.warn(`[seo] Дубль slug «${slug}» (товар «${p.name}») — страница не создана, переименуйте товар.`);
      continue;
    }
    seen.add(slug);
    params.push({ slug });
  }
  return params;
}

async function productBySlug(slug: string): Promise<Product | null> {
  const products = await buildDisplayProducts();
  return products.find((p) => productSlug(p) === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await productBySlug(slug);
  if (!p) return {};
  const title = `${p.name} — купить луковицы с доставкой`;
  const description = productDescription(p);
  return {
    title,
    description,
    alternates: { canonical: `/product/${slug}/` },
    openGraph: {
      type: "website",
      url: `/product/${slug}/`,
      title,
      description,
      ...(p.images.length ? { images: [{ url: p.images[0] }] } : {}),
    },
  };
}

export default async function ProductSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await productBySlug(slug);
  if (!p) notFound();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(productJsonLd(p))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbsJsonLd([
            ["Главная", `${SITE_URL}/`],
            ["Магазин", `${SITE_URL}/shop/`],
            [p.name, productUrl(p)],
          ]),
        )}
      />
      <ProductView id={String(p.id)} initial={p} />

      {/* related */}
      <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--green-3)" }}>
            Похожее
          </span>
          <h2 className="bn-h" style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 600, margin: "8px 0 0" }}>
            Вам также <span style={{ color: "var(--accent)", fontStyle: "italic" }}>понравится</span>
          </h2>
        </div>
        <LiveProductGrid fallback={[]} limit={4} columns={4} />
      </div>
    </main>
  );
}
