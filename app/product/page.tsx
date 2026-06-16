import Link from "next/link";
import ProductView from "@/components/ProductView";
import ProductCard from "@/components/ProductCard";
import { related } from "@/lib/data";

export default function ProductPage() {
  return (
    <main>
      <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 32px", fontSize: 14, color: "var(--muted)" }}>
          <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
            Главная
          </Link>{" "}
          /&nbsp;{" "}
          <Link href="/shop" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
            Магазин
          </Link>{" "}
          /&nbsp; <span style={{ color: "var(--ink)" }}>Тюльпан «Триумф», микс</span>
        </div>
      </div>

      <ProductView />

      {/* related */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--green-3)" }}>
            Похожее
          </span>
          <h2 className="bn-h" style={{ fontSize: 36, fontWeight: 600, margin: "8px 0 0" }}>
            Вам также <span style={{ color: "var(--accent)", fontStyle: "italic" }}>понравится</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
          {related.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
