import type { Product } from "./data";
import { productSlug } from "./slug";

/** Публичный адрес сайта — для canonical, Open Graph, sitemap и JSON-LD. */
export const SITE_URL = "https://bloomnook.ru";
export const SITE_NAME = "Bloom Nook";

/** Абсолютный URL страницы товара. */
export function productUrl(p: { name: string }): string {
  return `${SITE_URL}/product/${productSlug(p)}/`;
}

/**
 * Meta description карточки товара из агрономических полей. Яндекс показывает
 * ~160–180 символов, поэтому собираем самое продающее и обрезаем по границе
 * предложения.
 */
export function productDescription(p: Product): string {
  const parts: string[] = [];
  parts.push(
    `${p.name}${p.lat ? ` (${p.lat})` : ""} — купить луковицы с бесплатной доставкой по России`,
  );
  if (p.color) parts.push(p.color);
  const facts: string[] = [];
  if (p.height) facts.push(`высота ${p.height} см`);
  if (p.bloom) facts.push(`цветение: ${p.bloom.toLowerCase()}`);
  if (p.caliber) facts.push(`разбор ${p.caliber}`);
  if (facts.length) parts.push(facts.join(", "));
  if (p.priceValue > 0) parts.push(`Цена от ${p.priceValue.toLocaleString("ru-RU")} ₽`);
  let out = "";
  for (const part of parts) {
    const next = out ? `${out}. ${part}` : part;
    if (next.length > 180) break;
    out = next;
  }
  return (out || parts[0]).slice(0, 200) + ".";
}

/** JSON-LD разметка Product + Offer для сниппета с ценой в Яндексе и Google. */
export function productJsonLd(p: Product): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.lat ? { alternateName: p.lat } : {}),
    ...(p.images.length ? { image: p.images } : {}),
    description: productDescription(p),
    category: p.cat,
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(p.priceValue > 0
      ? {
          offers: {
            "@type": "Offer",
            url: productUrl(p),
            price: p.priceValue,
            priceCurrency: "RUB",
            availability: p.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
            seller: { "@type": "Organization", name: SITE_NAME },
          },
        }
      : {}),
  };
}

/** JSON-LD «хлебные крошки». items: [метка, абсолютный URL или null для текущей]. */
export function breadcrumbsJsonLd(items: [string, string | null][]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, url], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      ...(url ? { item: url } : {}),
    })),
  };
}

/** JSON-LD организации — на всех страницах (шаблон layout). */
export function organizationJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/header_logo.svg`,
    telephone: "+7 925 531-99-38",
    email: "hello@bloomnook.ru",
    sameAs: ["https://t.me/BloomNook1"],
  };
}

/** JSON-LD блока вопросов-ответов (FAQPage) для главной. */
export function faqJsonLd(faqs: { q: string; a: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Скрипт JSON-LD как props для <script>. Использование:
 * <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(data)} />
 */
export function jsonLdScript(data: object): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
