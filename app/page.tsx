import Link from "next/link";
import Motif from "@/components/Motif";
import LiveProductGrid from "@/components/LiveProductGrid";
import SeasonalPromo from "@/components/SeasonalPromo";
import Faq from "@/components/Faq";
import { ArrowRight, Leaf, Star, Stars, Truck, Shield, Refresh } from "@/components/icons";
import { categories, bestsellers, steps, benefits, testimonials } from "@/lib/data";

const eyebrow: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "var(--green-3)",
};

function benefitIcon(icon: string) {
  if (icon === "truck") return <Truck />;
  if (icon === "shield") return <Shield />;
  return <Leaf />;
}

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section style={{ background: "linear-gradient(180deg,var(--sage-2),#fff)" }}>
        <div
          className="bn-pad bn-stack"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "72px 32px 84px",
            display: "grid",
            gridTemplateColumns: "1.05fr .95fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                border: "1px solid var(--line)",
                color: "var(--green-2)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: ".04em",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: 999,
              }}
            >
              <Leaf size={15} strokeWidth={1.8} />
              Луковицы цветов с доставкой
            </span>
            <h1 className="bn-h" style={{ fontSize: "clamp(36px, 8vw, 62px)", lineHeight: 1.04, fontWeight: 300, margin: "22px 0 0", color: "var(--ink)", textTransform: "uppercase" }}>
              Сад начинается
              <br />
              <span style={{ fontWeight: 600 }}>с хорошей <span style={{ color: "var(--accent)" }}>луковицы</span></span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--muted)", maxWidth: 480, margin: "22px 0 0" }}>
              Отборный посадочный материал тюльпанов, нарциссов, гиацинтов и лилий. Заказ и доставка — через Ozon, удобно и
              безопасно.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 34 }}>
              <Link
                href="/shop"
                className="bn-hover-fade"
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "var(--accent)",
                  color: "#fff",
                  padding: "16px 30px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                Перейти в магазин <ArrowRight size={18} strokeWidth={1.9} />
              </Link>
              <Link
                href="/#steps"
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--ink)",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  borderBottom: "2px solid var(--line)",
                  paddingBottom: 3,
                }}
              >
                Как это работает
              </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 42 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Stars size={18} />
                <span style={{ fontWeight: 800, fontSize: 17 }}>4.9</span>
              </div>
              <div style={{ width: 1, height: 34, background: "var(--line)" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>12 000+</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>выполненных заказов</div>
              </div>
            </div>
          </div>

          {/* hero visual */}
          <div className="bn-hero-visual" style={{ position: "relative" }}>
            <div
              style={{
                background: "var(--sage)",
                border: "1px solid var(--line)",
                borderRadius: 28,
                aspectRatio: "4 / 4.4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 38%,#fff,transparent 60%)" }} />
              <Motif href="#m-tulip" strokeWidth={2.2} style={{ width: "54%", position: "relative" }} />
            </div>
            <div
              className="bn-hero-badge-l"
              style={{
                position: "absolute",
                top: 26,
                left: -18,
                background: "#fff",
                border: "1px solid var(--line)",
                boxShadow: "0 16px 36px -22px rgba(24,53,18,.5)",
                borderRadius: 14,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 11,
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--sage)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <Truck size={19} strokeWidth={1.7} />
              </span>
              <div style={{ whiteSpace: "nowrap" }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>Доставка через Ozon</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>по всей России</div>
              </div>
            </div>
            <div
              className="bn-hero-badge-r"
              style={{
                position: "absolute",
                bottom: 26,
                right: -18,
                background: "#fff",
                border: "1px solid var(--line)",
                boxShadow: "0 16px 36px -22px rgba(24,53,18,.5)",
                borderRadius: 14,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 11,
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--sage)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <Shield size={19} strokeWidth={1.7} />
              </span>
              <div style={{ whiteSpace: "nowrap" }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>Гарантия свежести</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>заменим или вернём</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="cats" className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={eyebrow}>Каталог</span>
          <h2 className="bn-h" style={{ fontSize: "clamp(28px, 4.6vw, 42px)", fontWeight: 600, margin: "10px 0 0" }}>
            Категории <span style={{ color: "var(--accent)", fontStyle: "italic" }}>луковиц</span>
          </h2>
        </div>
        <div className="bn-g-cats" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 18 }}>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href="/shop"
              className="bn-cat"
              style={{
                cursor: "pointer",
                background: "var(--cream)",
                border: "1px solid var(--line)",
                borderRadius: 18,
                padding: "24px 14px",
                textAlign: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ height: 78, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Motif href={cat.useHref} strokeWidth={3} style={{ width: "auto", height: 78 }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{cat.count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, gap: 16, flexWrap: "wrap" }}>
          <div>
            <span style={eyebrow}>Популярное</span>
            <h2 className="bn-h" style={{ fontSize: "clamp(28px, 4.6vw, 42px)", fontWeight: 600, margin: "10px 0 0" }}>
              Хиты <span style={{ color: "var(--accent)", fontStyle: "italic" }}>сезона</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="bn-hover-border"
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1.5px solid var(--line)",
              borderRadius: 999,
              padding: "12px 22px",
              fontWeight: 700,
              fontSize: 14,
              color: "var(--ink)",
              textDecoration: "none",
            }}
          >
            Смотреть все <ArrowRight size={16} strokeWidth={1.9} />
          </Link>
        </div>
        <LiveProductGrid fallback={bestsellers} limit={4} columns={4} showHeart showButton />
      </section>

      {/* SEASONAL PROMO */}
      <SeasonalPromo />

      {/* HOW IT WORKS */}
      <section id="steps" className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={eyebrow}>Как это работает</span>
          <h2 className="bn-h" style={{ fontSize: "clamp(28px, 4.6vw, 42px)", fontWeight: 600, margin: "10px 0 0" }}>
            От заказа до <span style={{ color: "var(--accent)", fontStyle: "italic" }}>цветения</span>
          </h2>
        </div>
        <div className="bn-g-steps" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ position: "relative", paddingTop: 8 }}>
              <div className="bn-h" style={{ fontSize: 54, fontWeight: 600, color: "var(--sage)", lineHeight: 1 }}>
                {s.n}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "8px 0 8px" }}>{s.t}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section
        id="benefits"
        style={{ background: "var(--sage-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div
          className="bn-pad bn-g-3"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "52px 32px",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 36,
          }}
        >
          {benefits.map((b) => (
            <div key={b.t} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span
                style={{
                  flex: "none",
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: "#fff",
                  border: "1px solid var(--line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                {benefitIcon(b.icon)}
              </span>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "2px 0 6px" }}>{b.t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={eyebrow}>Отзывы</span>
          <h2 className="bn-h" style={{ fontSize: "clamp(28px, 4.6vw, 42px)", fontWeight: 600, margin: "10px 0 0" }}>
            Что говорят <span style={{ color: "var(--accent)", fontStyle: "italic" }}>садоводы</span>
          </h2>
        </div>
        <div className="bn-g-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: 20,
                padding: 30,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Stars size={16} />
                <span style={{ fontWeight: 800, fontSize: 14 }}>{t.rating}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>{t.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--muted)", margin: "0 0 22px", flex: 1 }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 13, borderTop: "1px solid var(--line)", paddingTop: 18 }}>
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--sage)",
                    color: "var(--green)",
                    fontWeight: 800,
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {t.initials}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: "var(--sage-2)", borderTop: "1px solid var(--line)" }}>
        <div
          className="bn-pad bn-stack-md"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "88px 32px",
            display: "grid",
            gridTemplateColumns: "1.4fr .9fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div>
            <span style={eyebrow}>FAQ</span>
            <h2 className="bn-h" style={{ fontSize: "clamp(28px, 4.6vw, 42px)", fontWeight: 600, margin: "10px 0 32px" }}>
              Частые <span style={{ color: "var(--accent)", fontStyle: "italic" }}>вопросы</span>
            </h2>
            <Faq />
          </div>
          <div style={{ background: "var(--green)", borderRadius: 22, padding: 36, color: "#fff", position: "sticky", top: 96 }}>
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "rgba(255,255,255,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                color: "#fff",
              }}
            >
              <Refresh />
            </span>
            <h3 className="bn-h" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2, margin: "0 0 14px" }}>
              Остались вопросы?
            </h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, opacity: 0.85, margin: "0 0 22px" }}>
              Наш агроном поможет подобрать сорт и расскажет о посадке. Отвечаем быстро.
            </p>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: "#fff",
                color: "var(--green)",
                padding: "13px 24px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Написать нам
            </a>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: "#fff" }}>
        <div className="bn-pad" style={{ maxWidth: 760, margin: "0 auto", padding: "88px 32px", textAlign: "center" }}>
          <span style={eyebrow}>Рассылка</span>
          <h2 className="bn-h" style={{ fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 600, margin: "12px 0 12px", lineHeight: 1.15 }}>
            Подпишитесь и получите <span style={{ color: "var(--accent)", fontStyle: "italic" }}>−10%</span> на первый заказ
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", margin: "0 0 30px" }}>
            Советы по посадке, новинки сезона и закрытые скидки — раз в неделю, без спама.
          </p>
          <div style={{ display: "flex", gap: 12, maxWidth: 520, margin: "0 auto" }}>
            <input
              type="email"
              placeholder="Ваш e-mail"
              style={{
                flex: 1,
                border: "1.5px solid var(--line)",
                borderRadius: 999,
                padding: "15px 22px",
                fontSize: 15,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            <button
              className="bn-hover-fade"
              style={{
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "15px 30px",
                borderRadius: 999,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Подписаться
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
