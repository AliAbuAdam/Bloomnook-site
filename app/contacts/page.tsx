import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Контакты и реквизиты — Bloom Nook",
  description:
    "Связаться с Bloom Nook и реквизиты продавца: ИП Ахмедов Санан Имамгулу оглы, ОГРНИП 324508100295959, ИНН 504108091325.",
};

/** Контактные способы связи. */
const CONTACTS: { label: string; value: string; href?: string }[] = [
  { label: "Телефон", value: "+7 495 000-00-00", href: "tel:+74950000000" },
  { label: "Email", value: "hello@bloomnook.ru", href: "mailto:hello@bloomnook.ru" },
  { label: "Доставка", value: "По всей России через Ozon" },
];

/** Реквизиты продавца (ИП). */
const DETAILS: { label: string; value: string }[] = [
  { label: "Продавец", value: "ИП Ахмедов Санан Имамгулу оглы" },
  { label: "ОГРНИП", value: "324508100295959" },
  { label: "ИНН", value: "504108091325" },
];

const cardTitle: React.CSSProperties = { fontSize: 20, fontWeight: 600, margin: "0 0 18px" };

export default function ContactsPage() {
  return (
    <main>
      <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
          <h1 className="bn-h" style={{ fontSize: "clamp(30px, 6vw, 46px)", fontWeight: 600, margin: 0 }}>
            Контакты
          </h1>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 10 }}>
            <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
              Главная
            </Link>{" "}
            /&nbsp; <span style={{ color: "var(--ink)" }}>Контакты</span>
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
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* связь */}
        <div style={{ border: "1px solid var(--line)", borderRadius: 20, padding: 28 }}>
          <h2 className="bn-h" style={cardTitle}>
            Связаться с нами
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {CONTACTS.map((c, i) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "13px 0",
                  fontSize: 15,
                  borderTop: i === 0 ? "none" : "1px solid var(--line)",
                }}
              >
                <span style={{ color: "var(--muted)" }}>{c.label}</span>
                {c.href ? (
                  <a href={c.href} style={{ fontWeight: 600, color: "var(--ink)", textDecoration: "none", textAlign: "right" }}>
                    {c.value}
                  </a>
                ) : (
                  <span style={{ fontWeight: 600, textAlign: "right" }}>{c.value}</span>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "20px 0 0", lineHeight: 1.6 }}>
            Поможем подобрать сорт и подскажем по посадке и уходу. Оформление и оплата заказов —
            на стороне Ozon.
          </p>
        </div>

        {/* реквизиты */}
        <div style={{ border: "1px solid var(--line)", borderRadius: 20, padding: 28 }}>
          <h2 className="bn-h" style={cardTitle}>
            Реквизиты
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {DETAILS.map((d, i) => (
              <div
                key={d.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "13px 0",
                  fontSize: 15,
                  borderTop: i === 0 ? "none" : "1px solid var(--line)",
                }}
              >
                <span style={{ color: "var(--muted)" }}>{d.label}</span>
                <span style={{ fontWeight: 600, textAlign: "right" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
