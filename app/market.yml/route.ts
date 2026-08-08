import { buildDisplayProducts, buildCategories } from "@/lib/catalog-build";
import { SITE_URL, SITE_NAME, productUrl, productDescription } from "@/lib/seo";

/**
 * YML-фид для Яндекса (Маркет, товарная вертикаль поиска, Директ):
 * https://bloomnook.ru/market.yml — генерируется при сборке из PocketBase.
 * Формат: https://yandex.ru/support/marketplace/assortment/files/index.html
 *
 * В фид попадают только товары с ценой. Дата фида не проставляется
 * (yml_catalog date опционален у Яндекса) — при статической сборке нет
 * стабильного «сейчас», а фейковая дата вводила бы робота в заблуждение.
 */
export const dynamic = "force-static";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(): Promise<Response> {
  const products = (await buildDisplayProducts()).filter((p) => p.priceValue > 0);
  const categories = await buildCategories();
  const catId = new Map(categories.map((c, i) => [c, i + 1]));

  const offers = products
    .map((p) => {
      const lines = [
        `      <offer id="${esc(String(p.id))}" available="${p.inStock}">`,
        `        <name>${esc(p.name)}</name>`,
        `        <url>${esc(productUrl(p))}</url>`,
        `        <price>${p.priceValue}</price>`,
        ...(p.oldValue > p.priceValue ? [`        <oldprice>${p.oldValue}</oldprice>`] : []),
        `        <currencyId>RUR</currencyId>`,
        `        <categoryId>${catId.get(p.cat) ?? 1}</categoryId>`,
        ...p.images.slice(0, 10).map((u) => `        <picture>${esc(u)}</picture>`),
        `        <description>${esc(productDescription(p))}</description>`,
        ...(p.lat ? [`        <vendorCode>${esc(p.lat)}</vendorCode>`] : []),
        `        <param name="Категория">${esc(p.cat)}</param>`,
        ...(p.height ? [`        <param name="Высота" unit="см">${esc(p.height)}</param>`] : []),
        ...(p.caliber ? [`        <param name="Разбор луковиц">${esc(p.caliber)}</param>`] : []),
        ...(p.bloom ? [`        <param name="Срок цветения">${esc(p.bloom)}</param>`] : []),
        `      </offer>`,
      ];
      return lines.join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog>
  <shop>
    <name>${esc(SITE_NAME)}</name>
    <company>${esc(SITE_NAME)}</company>
    <url>${SITE_URL}</url>
    <currencies>
      <currency id="RUR" rate="1"/>
    </currencies>
    <categories>
${categories.map((c) => `      <category id="${catId.get(c)}">${esc(c)}</category>`).join("\n")}
    </categories>
    <offers>
${offers}
    </offers>
  </shop>
</yml_catalog>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
