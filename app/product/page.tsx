import { Suspense } from "react";
import ProductView from "@/components/ProductView";
import LiveProductGrid from "@/components/LiveProductGrid";
import { related } from "@/lib/data";

export default function ProductPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", textAlign: "center", color: "var(--muted)" }}>
            Загрузка…
          </div>
        }
      >
        <ProductView />
      </Suspense>

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
        <LiveProductGrid fallback={related} limit={4} columns={4} />
      </div>
    </main>
  );
}
