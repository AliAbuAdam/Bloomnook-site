import Link from "next/link";
import ShopBrowser from "@/components/ShopBrowser";
import { products } from "@/lib/data";

export default function ShopPage() {
  return (
    <main>
      <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
          <h1 className="bn-h" style={{ fontSize: 46, fontWeight: 600, margin: 0 }}>
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
