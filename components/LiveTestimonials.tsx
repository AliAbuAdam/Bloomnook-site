"use client";

import { useEffect, useState } from "react";
import { Stars } from "./icons";
import { fetchReviews, initialsFromName, DEFAULT_REVIEWS, type ReviewItem } from "@/lib/content";

/**
 * Сетка отзывов на главной. Тексты редактируются из админки (раздел «Отзывы»,
 * Linear CEO-39) и хранятся в коллекции PocketBase `content`. До загрузки и при
 * недоступной базе показываются значения по умолчанию из lib/data.ts.
 * Инициалы в аватарке считаются из имени автоматически.
 */
export default function LiveTestimonials() {
  const [items, setItems] = useState<ReviewItem[]>(DEFAULT_REVIEWS);

  useEffect(() => {
    let alive = true;
    fetchReviews()
      .then((list) => {
        if (alive) setItems(list);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="bn-g-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
      {items.map((t, i) => (
        <div
          key={i}
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
              {initialsFromName(t.name)}
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{t.city}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
