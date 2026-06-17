import Link from "next/link";
import Motif from "@/components/Motif";
import { Minus, Plus, Close, Truck, Lock } from "@/components/icons";
import { cart } from "@/lib/data";

const gridCols = "2.4fr 1fr 1.2fr 1fr 40px";

const summaryRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 12 };
const summaryLabel: React.CSSProperties = { color: "var(--muted)" };
const summaryValue: React.CSSProperties = { fontWeight: 700, whiteSpace: "nowrap" };

export default function CartPage() {
  return (
    <main>
      <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
          <h1 className="bn-h" style={{ fontSize: "clamp(30px, 6vw, 46px)", fontWeight: 600, margin: 0 }}>
            Корзина
          </h1>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 10 }}>
            <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
              Главная
            </Link>{" "}
            /&nbsp; <span style={{ color: "var(--ink)" }}>Корзина</span>
          </div>
        </div>
      </div>

      <div
        className="bn-pad bn-stack-md"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "48px 32px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 40,
          alignItems: "start",
        }}
      >
        <div>
          <div
            className="bn-cart-head"
            style={{
              display: "grid",
              gridTemplateColumns: gridCols,
              gap: 16,
              padding: "0 8px 16px",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--muted)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span>Товар</span>
            <span>Цена</span>
            <span style={{ textAlign: "center" }}>Количество</span>
            <span style={{ textAlign: "right" }}>Сумма</span>
            <span />
          </div>
          {cart.map((c) => (
            <div
              key={c.name}
              className="bn-cart-row"
              style={{
                display: "grid",
                gridTemplateColumns: gridCols,
                gap: 16,
                alignItems: "center",
                padding: "18px 8px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div className="bn-cc-prod" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    background: "var(--sage)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                  }}
                >
                  <Motif href={c.useHref} strokeWidth={3} style={{ width: 32 }} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.25 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{c.cat}</div>
                </div>
              </div>
              <span className="bn-cc-price" style={{ fontWeight: 600 }}>{c.price}</span>
              <div className="bn-cc-qty" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--line)", borderRadius: 999 }}>
                  <span style={{ width: 36, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", cursor: "pointer" }}>
                    <Minus size={16} />
                  </span>
                  <span style={{ width: 34, textAlign: "center", fontWeight: 700 }}>{c.qty}</span>
                  <span style={{ width: 36, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)", cursor: "pointer" }}>
                    <Plus size={16} />
                  </span>
                </div>
              </div>
              <span className="bn-cc-sum" style={{ fontWeight: 800, textAlign: "right" }}>{c.sub}</span>
              <span className="bn-cc-del" style={{ display: "flex", justifyContent: "center", color: "#b9c2b6", cursor: "pointer" }}>
                <Close />
              </span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 26, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                placeholder="Промокод"
                style={{ border: "1.5px solid var(--line)", borderRadius: 999, padding: "13px 22px", fontSize: 14, fontFamily: "inherit", outline: "none", width: 200 }}
              />
              <button
                style={{
                  border: "1.5px solid var(--accent)",
                  background: "#fff",
                  color: "var(--accent)",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "13px 24px",
                  borderRadius: 999,
                  cursor: "pointer",
                }}
              >
                Применить
              </button>
            </div>
            <Link
              href="/shop"
              style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Продолжить покупки
            </Link>
          </div>
        </div>

        {/* summary */}
        <div style={{ border: "1px solid var(--line)", borderRadius: 20, padding: 28, position: "sticky", top: 96 }}>
          <h3 className="bn-h" style={{ fontSize: 24, fontWeight: 600, margin: "0 0 22px" }}>
            Ваш заказ
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14.5 }}>
            <div style={summaryRow}>
              <span style={summaryLabel}>Товаров</span>
              <span style={summaryValue}>10</span>
            </div>
            <div style={summaryRow}>
              <span style={summaryLabel}>Сумма</span>
              <span style={summaryValue}>6 200 ₽</span>
            </div>
            <div style={summaryRow}>
              <span style={summaryLabel}>Доставка (Ozon)</span>
              <span style={{ ...summaryValue, color: "var(--green)" }}>Бесплатно</span>
            </div>
            <div style={summaryRow}>
              <span style={summaryLabel}>Скидка по промокоду</span>
              <span style={summaryValue}>−620 ₽</span>
            </div>
          </div>
          <div style={{ height: 1, background: "var(--line)", margin: "20px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Итого</span>
            <span className="bn-h" style={{ fontSize: 28, fontWeight: 700, whiteSpace: "nowrap" }}>
              5 580 ₽
            </span>
          </div>
          <button
            className="bn-hover-fade"
            style={{
              width: "100%",
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              padding: 16,
              borderRadius: 999,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Truck size={19} strokeWidth={1.8} />
            Оформить на Ozon
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 14, fontSize: 12.5, color: "var(--muted)" }}>
            <Lock />
            Безопасная оплата на стороне Ozon
          </div>
        </div>
      </div>
    </main>
  );
}
