"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Motif from "./Motif";
import { ArrowRight } from "./icons";

const TARGET = new Date("2026-10-20T09:00:00").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 18,
  width: 84,
  height: 96,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 14px 30px -16px rgba(0,0,0,.5)",
};

const digit: React.CSSProperties = {
  fontSize: 46,
  fontWeight: 700,
  color: "var(--green)",
  lineHeight: 1,
};

const caption: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#fff",
  opacity: 0.8,
  marginTop: 10,
  letterSpacing: ".02em",
};

const colon: React.CSSProperties = {
  fontSize: 38,
  color: "#fff",
  opacity: 0.45,
  marginTop: 26,
};

export default function SeasonalPromo() {
  const [t, setT] = useState({ days: "00", hours: "00", mins: "00", secs: "00" });

  useEffect(() => {
    const tick = () => {
      let ms = Math.max(0, TARGET - Date.now());
      const dd = Math.floor(ms / 864e5);
      ms -= dd * 864e5;
      const hh = Math.floor(ms / 36e5);
      ms -= hh * 36e5;
      const mm = Math.floor(ms / 6e4);
      ms -= mm * 6e4;
      const ss = Math.floor(ms / 1e3);
      setT({ days: pad(dd), hours: pad(hh), mins: pad(mm), secs: pad(ss) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 32px" }}>
      <div
        className="bn-stack-md"
        style={{
          background: "var(--green)",
          borderRadius: 28,
          padding: "clamp(28px, 5vw, 56px)",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 40,
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -30, right: 40, opacity: 0.14 }}>
          <Motif href="#m-crocus" stroke="#fff" style={{ width: 160 }} />
        </div>
        <div style={{ position: "absolute", bottom: -46, left: -26, opacity: 0.1 }}>
          <Motif href="#m-narcissus" stroke="#fff" style={{ width: 190 }} />
        </div>
        <div style={{ position: "relative", color: "#fff" }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.8 }}>
            Ограниченное предложение
          </span>
          <h2 className="bn-h" style={{ fontSize: "clamp(30px, 5vw, 46px)", fontWeight: 600, margin: "12px 0 8px" }}>
            Осенняя <span style={{ fontStyle: "italic", color: "#CFE3C6" }}>посадка</span>
          </h2>
          <p style={{ fontSize: 17, opacity: 0.85, margin: "0 0 26px", maxWidth: 380 }}>
            Скидки до 30% на луковицы весеннего цветения. Успейте посадить до холодов.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <Link
              href="/shop"
              className="bn-hover-fade"
              style={{
                cursor: "pointer",
                background: "#fff",
                color: "var(--green)",
                padding: "14px 28px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              К акции <ArrowRight size={17} strokeWidth={2} />
            </Link>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.22)",
              padding: "7px 15px",
              borderRadius: 999,
              marginBottom: 18,
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#9FE5A9", animation: "bnblink 1.3s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#fff", whiteSpace: "nowrap" }}>
              До конца акции
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, justifyContent: "flex-start" }}>
            <div style={{ textAlign: "center" }}>
              <div className="bn-count-card" style={card}>
                <span className="bn-h bn-count-digit" style={digit}>
                  {t.days}
                </span>
              </div>
              <div style={caption}>дней</div>
            </div>
            <span className="bn-h bn-count-colon" style={colon}>
              :
            </span>
            <div style={{ textAlign: "center" }}>
              <div className="bn-count-card" style={card}>
                <span className="bn-h bn-count-digit" style={digit}>
                  {t.hours}
                </span>
              </div>
              <div style={caption}>часов</div>
            </div>
            <span className="bn-h bn-count-colon" style={colon}>
              :
            </span>
            <div style={{ textAlign: "center" }}>
              <div className="bn-count-card" style={card}>
                <span className="bn-h bn-count-digit" style={digit}>
                  {t.mins}
                </span>
              </div>
              <div style={caption}>минут</div>
            </div>
            <span className="bn-h bn-count-colon" style={colon}>
              :
            </span>
            <div style={{ textAlign: "center" }}>
              <div className="bn-count-card" style={{ ...card, animation: "bnring 1s ease-out infinite" }}>
                <span
                  key={t.secs}
                  className="bn-h bn-count-digit"
                  style={{ display: "inline-block", ...digit, color: "var(--accent)", animation: "bntick .5s ease-out" }}
                >
                  {t.secs}
                </span>
              </div>
              <div style={{ ...caption, fontWeight: 700, opacity: 0.95 }}>секунд</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
