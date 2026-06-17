import Link from "next/link";
import Motif from "./Motif";
import { Star, Heart } from "./icons";
import type { Product } from "@/lib/data";

export default function ProductCard({
  item,
  showHeart = false,
  showButton = false,
}: {
  item: Product;
  showHeart?: boolean;
  showButton?: boolean;
}) {
  return (
    <Link
      href={`/product?id=${item.id}`}
      className="bn-prod"
      style={{
        cursor: "pointer",
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          position: "relative",
          background: item.tile,
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: item.image ? 0 : 22,
          overflow: "hidden",
        }}
      >
        {item.hasDisc && (
          <span
            style={{
              position: "absolute",
              top: 13,
              left: 13,
              background: "var(--green)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              padding: "5px 11px",
              borderRadius: 999,
            }}
          >
            {item.disc}
          </span>
        )}
        {showHeart && (
          <span
            style={{
              position: "absolute",
              top: 13,
              right: 13,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--green-2)",
            }}
          >
            <Heart size={16} />
          </span>
        )}
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Motif href={item.useHref} style={{ width: "58%" }} />
        )}
      </div>
      <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{item.cat}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700 }}>
            <Star size={14} />
            {item.rating}
          </span>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{item.name}</h3>
        {item.lat && (
          <span style={{ fontSize: 12.5, color: "#aab3a8", fontStyle: "italic", marginTop: -3 }}>{item.lat}</span>
        )}
        {(item.height || item.bloom) && (
          <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", flexWrap: "wrap", gap: "2px 12px" }}>
            {item.height && <span>Высота: {item.height} см</span>}
            {item.bloom && <span>Цветение: {item.bloom}</span>}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginTop: 2 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)" }}>{item.price}</span>
          {item.priceValue > 0 && item.packs.length > 0 && (
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>/ шт</span>
          )}
          {item.old && (
            <span style={{ fontSize: 14, color: "#aab3a8", textDecoration: "line-through" }}>{item.old}</span>
          )}
        </div>
        {item.packs.length > 0 && (
          <span style={{ fontSize: 12, color: "var(--green-3)", fontWeight: 600 }}>
            Комплекты: {item.packs.join(" · ")} шт
          </span>
        )}
        {showButton && (
          <span
            className="bn-hover-fade"
            style={{
              marginTop: "auto",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              padding: 11,
              borderRadius: 11,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            Заказать на Ozon
          </span>
        )}
      </div>
    </Link>
  );
}
