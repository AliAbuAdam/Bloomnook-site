"use client";

import { useState } from "react";
import { Plus, Minus } from "./icons";
import { faqs } from "@/lib/data";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
            <div
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "20px 22px",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 16 }}>{f.q}</span>
              <span
                style={{
                  flex: "none",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--sage)",
                  color: "var(--green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isOpen ? <Minus size={18} strokeWidth={1.8} /> : <Plus size={18} strokeWidth={1.8} />}
              </span>
            </div>
            {isOpen && (
              <div style={{ padding: "0 22px 22px", fontSize: 14.5, lineHeight: 1.65, color: "var(--muted)" }}>{f.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
