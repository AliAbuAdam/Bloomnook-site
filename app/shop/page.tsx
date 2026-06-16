import Link from "next/link";
import LiveProductGrid from "@/components/LiveProductGrid";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "@/components/icons";
import { products } from "@/lib/data";

const filterGroupTitle: React.CSSProperties = { fontSize: 16, fontWeight: 800, margin: "0 0 14px" };
const filterList: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 11, fontSize: 14.5, color: "#42503f" };
const filterRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" };
const divider: React.CSSProperties = { height: 1, background: "var(--line)" };

const boxBase: React.CSSProperties = { width: 18, height: 18, borderRadius: 5 };
const boxEmpty: React.CSSProperties = { ...boxBase, border: "1.5px solid var(--line)" };
const boxChecked: React.CSSProperties = {
  ...boxBase,
  border: "1.5px solid var(--accent)",
  background: "var(--accent)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function Checkbox({ checked }: { checked?: boolean }) {
  return checked ? (
    <span style={boxChecked}>
      <Check style={{ stroke: "#fff" }} />
    </span>
  ) : (
    <span style={boxEmpty} />
  );
}

const pageDot: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  cursor: "pointer",
  border: "1.5px solid var(--line)",
};

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

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "48px 32px 72px",
          display: "grid",
          gridTemplateColumns: "256px 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* filters */}
        <aside style={{ position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 30 }}>
          <div>
            <h3 style={filterGroupTitle}>Тип цветка</h3>
            <div style={filterList}>
              <label style={filterRow}>
                <Checkbox checked />
                Тюльпаны
              </label>
              <label style={filterRow}>
                <Checkbox />
                Нарциссы
              </label>
              <label style={filterRow}>
                <Checkbox />
                Гиацинты
              </label>
              <label style={filterRow}>
                <Checkbox />
                Лилии
              </label>
              <label style={filterRow}>
                <Checkbox />
                Крокусы
              </label>
              <label style={filterRow}>
                <Checkbox />
                Ирисы
              </label>
            </div>
          </div>
          <div style={divider} />
          <div>
            <h3 style={filterGroupTitle}>Срок посадки</h3>
            <div style={filterList}>
              <label style={filterRow}>
                <Checkbox />
                Осенняя посадка
              </label>
              <label style={filterRow}>
                <Checkbox />
                Весенняя посадка
              </label>
            </div>
          </div>
          <div style={divider} />
          <div>
            <h3 style={filterGroupTitle}>Цена</h3>
            <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 12 }}>290 ₽ — 1 150 ₽</div>
            <div style={{ height: 4, background: "var(--line)", borderRadius: 4, position: "relative" }}>
              <div style={{ position: "absolute", left: "8%", right: "18%", top: 0, bottom: 0, background: "var(--accent)", borderRadius: 4 }} />
              <span
                style={{
                  position: "absolute",
                  left: "8%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "3px solid var(--accent)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: "18%",
                  top: "50%",
                  transform: "translate(50%,-50%)",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "3px solid var(--accent)",
                }}
              />
            </div>
          </div>
          <div style={divider} />
          <div>
            <h3 style={filterGroupTitle}>Наличие</h3>
            <div style={filterList}>
              <label style={filterRow}>
                <Checkbox checked />
                В наличии
              </label>
              <label style={filterRow}>
                <Checkbox />
                Под заказ
              </label>
            </div>
          </div>
        </aside>

        {/* grid */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>Показано 1–12 из 184 товаров</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
              <span style={{ color: "var(--muted)" }}>Сортировка:</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1.5px solid var(--line)",
                  borderRadius: 999,
                  padding: "9px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Популярные <ChevronDown />
              </span>
            </div>
          </div>
          <LiveProductGrid fallback={products} columns={3} showHeart showButton />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 42 }}>
            <span style={{ ...pageDot, color: "var(--muted)" }}>
              <ChevronLeft />
            </span>
            <span style={{ ...pageDot, border: "none", background: "var(--accent)", color: "#fff" }}>1</span>
            <span style={pageDot}>2</span>
            <span style={pageDot}>3</span>
            <span style={{ padding: "0 6px", color: "var(--muted)" }}>…</span>
            <span style={pageDot}>16</span>
            <span style={{ ...pageDot, color: "var(--ink)" }}>
              <ChevronRight />
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
