"use client";

import { useState } from "react";
import Motif from "./Motif";
import { Star, Heart, Truck, Minus, Plus, Check } from "./icons";
import { sizes, productTabs, galleryMotifs } from "@/lib/data";

export default function ProductView() {
  const [gallery, setGallery] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);

  return (
    <>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "48px 32px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "start",
        }}
      >
        {/* gallery */}
        <div>
          <div
            style={{
              background: "var(--sage)",
              border: "1px solid var(--line)",
              borderRadius: 24,
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                background: "var(--green)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                padding: "6px 13px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              −30%
            </span>
            <Motif href="#m-tulip" strokeWidth={2} style={{ width: "50%" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 14 }}>
            {galleryMotifs.map((m, i) => (
              <div
                key={m}
                onClick={() => setGallery(i)}
                style={{
                  cursor: "pointer",
                  background: "var(--sage-2)",
                  border: gallery === i ? "2px solid var(--accent)" : "1.5px solid var(--line)",
                  borderRadius: 14,
                  aspectRatio: "1 / 1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 12,
                }}
              >
                <Motif href={"#m-" + m} strokeWidth={3} style={{ width: "60%" }} />
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "var(--green-3)", fontWeight: 600 }}>Тюльпаны</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--green)",
                background: "var(--sage)",
                border: "1px solid #cfe0c6",
                padding: "4px 11px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              В наличии
            </span>
          </div>
          <h1 className="bn-h" style={{ fontSize: 40, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.1 }}>
            Тюльпан «Триумф», микс
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={17} />
              ))}
            </span>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>4.9 · 245 отзывов</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>690 ₽</span>
            <span style={{ fontSize: 18, color: "#aab3a8", textDecoration: "line-through" }}>990 ₽</span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>/ упаковка</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--muted)", margin: "0 0 26px", maxWidth: 520 }}>
            Классические тюльпаны группы «Триумф» в яркой смеси окрасок. Крупная луковица 12/+, высокая всхожесть. Идеальны
            для клумб, бордюров и срезки.
          </p>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Фасовка</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {sizes.map((s, i) => (
              <div
                key={s.n}
                onClick={() => setSizeIdx(i)}
                style={{
                  cursor: "pointer",
                  border: sizeIdx === i ? "2px solid var(--accent)" : "1.5px solid var(--line)",
                  background: sizeIdx === i ? "var(--sage)" : "#fff",
                  borderRadius: 14,
                  padding: "14px 20px",
                  textAlign: "center",
                  minWidth: 110,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{s.p}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            Окраска: <span style={{ color: "var(--muted)", fontWeight: 600 }}>Микс</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "conic-gradient(#c45b8b,#e0a03a,#7a5bc4,#c45b8b)",
                border: "2px solid #fff",
                boxShadow: "0 0 0 2px var(--accent)",
              }}
            />
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#c45b8b", border: "2px solid #fff", boxShadow: "0 0 0 1.5px var(--line)" }} />
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#f4f4f4", border: "2px solid #fff", boxShadow: "0 0 0 1.5px var(--line)" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--line)", borderRadius: 999, overflow: "hidden" }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ border: "none", background: "#fff", width: 46, height: 50, cursor: "pointer", color: "var(--ink)" }}
                aria-label="Уменьшить количество"
              >
                <Minus />
              </button>
              <span style={{ width: 46, textAlign: "center", fontWeight: 700, fontSize: 16 }}>{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{ border: "none", background: "#fff", width: 46, height: 50, cursor: "pointer", color: "var(--ink)" }}
                aria-label="Увеличить количество"
              >
                <Plus />
              </button>
            </div>
            <button
              className="bn-hover-fade"
              style={{
                flex: 1,
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                padding: 15,
                borderRadius: 999,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Truck size={19} strokeWidth={1.8} />
              Заказать на Ozon
            </button>
            <button
              style={{
                width: 52,
                height: 52,
                border: "1.5px solid var(--line)",
                background: "#fff",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--green-2)",
              }}
              aria-label="В избранное"
            >
              <Heart size={20} />
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--sage)",
              borderRadius: 12,
              padding: "13px 16px",
              fontSize: 13.5,
              color: "#3a4937",
              marginBottom: 22,
            }}
          >
            <Truck size={18} strokeWidth={1.7} style={{ stroke: "var(--green)", flex: "none" }} />
            <span>
              <b>Доставка через Ozon</b> — оплата и доставка на стороне маркетплейса. Бесплатно от 2 000 ₽.
            </span>
          </div>
          <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.9 }}>
            <div>
              <b style={{ color: "var(--ink)" }}>Артикул:</b> BN-TUL-0312
            </div>
            <div>
              <b style={{ color: "var(--ink)" }}>Срок посадки:</b> сентябрь — октябрь
            </div>
            <div>
              <b style={{ color: "var(--ink)" }}>Категории:</b> Тюльпаны, Луковичные, Осенняя посадка
            </div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 32px 24px" }}>
        <div style={{ display: "flex", gap: 36, borderBottom: "1px solid var(--line)", marginBottom: 28 }}>
          {productTabs.map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(i)}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 17,
                padding: "0 0 16px",
                color: tab === i ? "var(--accent)" : "var(--muted)",
                borderBottom: tab === i ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div style={{ maxWidth: 820, fontSize: 15, lineHeight: 1.75, color: "#42503f" }}>
            <p style={{ margin: "0 0 16px" }}>
              Тюльпаны группы «Триумф» — самые универсальные и неприхотливые. Крепкий цветонос высотой 40–50 см,
              бокаловидный цветок, богатая палитра окрасок в одной смеси. Цветение — конец апреля — май.
            </p>
            <p style={{ margin: "0 0 18px" }}>
              Луковицы откалиброваны (размер 12/+), просушены и обработаны от болезней. Подходят для открытого грунта,
              контейнеров и выгонки.
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Check size={18} strokeWidth={2} style={{ stroke: "var(--green)", flex: "none" }} />
                Высокая всхожесть — гарантия 100%
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Check size={18} strokeWidth={2} style={{ stroke: "var(--green)", flex: "none" }} />
                Зимостойкость до −35 °C под укрытием
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Check size={18} strokeWidth={2} style={{ stroke: "var(--green)", flex: "none" }} />
                В комплекте — памятка по посадке
              </li>
            </ul>
          </div>
        )}

        {tab === 1 && (
          <div style={{ maxWidth: 820, fontSize: 15, lineHeight: 1.75, color: "#42503f" }}>
            <p style={{ margin: "0 0 14px" }}>
              <b style={{ color: "var(--ink)" }}>Когда сажать:</b> с середины сентября до конца октября, когда почва остынет до +8…+10 °C.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              <b style={{ color: "var(--ink)" }}>Глубина и расстояние:</b> на глубину 3 высот луковицы (10–15 см), с шагом 8–10 см между луковицами.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              <b style={{ color: "var(--ink)" }}>Почва:</b> рыхлая, дренированная, нейтральная. На зиму замульчируйте торфом или листвой.
            </p>
            <p style={{ margin: 0 }}>
              <b style={{ color: "var(--ink)" }}>Весной:</b> подкормите комплексным удобрением при появлении ростков.
            </p>
          </div>
        )}

        {tab === 2 && (
          <div style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { initials: "АП", name: "Андрей П.", city: "Москва", text: "Луковицы крупные, плотные. Посадил осенью — весной зацвели все. Рекомендую." },
              { initials: "ЕС", name: "Елена С.", city: "Санкт-Петербург", text: "Окраски действительно разные и яркие. Доставка через Ozon — быстро и удобно." },
            ].map((r) => (
              <div key={r.initials} style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--sage)",
                      color: "var(--green)",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {r.initials}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.city}</div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: "#42503f" }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
