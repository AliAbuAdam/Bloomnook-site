import type { Metadata } from "next";
import Link from "next/link";
import ShopBrowser from "@/components/ShopBrowser";
import { buildDisplayProducts } from "@/lib/catalog-build";

export const metadata: Metadata = {
  title: "Каталог луковиц цветов — купить с доставкой по России",
  description:
    "Каталог Bloom Nook: луковицы тюльпанов, лилий, нарциссов и редких сортов. Фильтры по сроку посадки, цветению и высоте. Бесплатная доставка по всей России.",
  alternates: { canonical: "/shop/" },
  openGraph: {
    type: "website",
    url: "/shop/",
    title: "Каталог луковиц цветов — купить с доставкой по России",
    description:
      "Луковицы тюльпанов, лилий, нарциссов и редких сортов с бесплатной доставкой по всей России.",
  },
};

export default async function ShopPage() {
  // Товары со сборки — попадают в статический HTML (индексация), после
  // загрузки страница сама обновит список из PocketBase.
  const products = await buildDisplayProducts();
  return (
    <main>
      <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
          <h1 className="bn-h" style={{ fontSize: "clamp(30px, 6vw, 46px)", fontWeight: 600, margin: 0 }}>
            Магазин
          </h1>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 10 }}>
            <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
              Главная
            </Link>{" "}
            /&nbsp; <span style={{ color: "var(--ink)" }}>Магазин</span>
          </div>
        </div>
      </div>

      <ShopBrowser fallback={products} />
    </main>
  );
}
