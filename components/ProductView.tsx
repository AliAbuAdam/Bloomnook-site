"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Motif from "./Motif";
import { Star, Heart, Truck, Minus, Plus, Check, Cart } from "./icons";
import { fetchDisplayProductById } from "@/lib/products";
import { money, type Product, type Season } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";

const SEASON_LABEL: Record<Season, string> = {
  autumn: "Осенняя посадка (сентябрь — октябрь)",
  spring: "Весенняя посадка (апрель — май)",
};

/** Характеристики товара для таблицы — только заполненные поля. */
function specs(p: Product): { label: string; value: string }[] {
  return [
    { label: "Класс / группа", value: p.cls },
    { label: "Высота", value: p.height ? `${p.height} см` : "" },
    { label: "Срок цветения", value: p.bloom },
    { label: "Глубина посадки", value: p.depth ? `${p.depth} см` : "" },
    { label: "Зона USDA", value: p.zone },
    { label: "Применение", value: p.usage },
  ].filter((s) => s.value);
}

export default function ProductView() {
  const params = useSearchParams();
  const id = params.get("id");
  const { add } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState(0);
  const [qty, setQty] = useState(1);
  // Выбранная фасовка — число штук в одном комплекте. 1 — поштучно.
  const [pack, setPack] = useState(1);
  const [tab, setTab] = useState(0);
  // Кратковременная отметка «Добавлено ✓» после клика по «В корзину».
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setGallery(0);
    setQty(1);
    setPack(1);
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }
    fetchDisplayProductById(id)
      .then((p) => {
        if (alive) setProduct(p);
      })
      .catch(() => {
        if (alive) setProduct(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const crumb = (name: string) => (
    <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
      <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 32px", fontSize: 14, color: "var(--muted)" }}>
        <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
          Главная
        </Link>{" "}
        /&nbsp;{" "}
        <Link href="/shop" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
          Магазин
        </Link>{" "}
        /&nbsp; <span style={{ color: "var(--ink)" }}>{name}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        {crumb("Товар")}
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", textAlign: "center", color: "var(--muted)" }}>
          Загрузка…
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        {crumb("Товар не найден")}
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "var(--muted)", margin: "0 0 20px" }}>
            Такого товара нет или он был удалён.
          </p>
          <Link
            href="/shop"
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              padding: "12px 22px",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Вернуться в магазин
          </Link>
        </div>
      </>
    );
  }

  const p = product;
  const hasPhotos = p.images.length > 0;
  const mainPhoto = hasPhotos ? p.images[Math.min(gallery, p.images.length - 1)] : null;
  const specRows = specs(p);

  // Фасовка: поштучно (1) всегда первой, далее комплекты из карточки.
  const packOptions = [1, ...p.packs];
  // Защита от устаревшего выбора после смены товара.
  const activePack = packOptions.includes(pack) ? pack : 1;
  const hasPrice = p.priceValue > 0;
  // Цена линейна: комплект из N шт = цена за шт × N. Поэтому N шт поштучно
  // и один комплект из N шт стоят одинаково.
  const pricePerPack = p.priceValue * activePack;
  const oldPerPack = p.oldValue * activePack;
  const totalPieces = activePack * qty;
  const total = pricePerPack * qty;

  return (
    <>
      {crumb(p.name)}
      <div
        className="bn-pad bn-stack-md"
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
            {p.hasDisc && p.disc && (
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
                  zIndex: 1,
                }}
              >
                {p.disc}
              </span>
            )}
            {mainPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainPhoto} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Motif href={p.useHref} strokeWidth={2} style={{ width: "50%" }} />
            )}
          </div>
          {p.images.length > 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 14 }}>
              {p.images.map((url, i) => (
                <div
                  key={url}
                  onClick={() => setGallery(i)}
                  style={{
                    cursor: "pointer",
                    background: "var(--sage-2)",
                    border: gallery === i ? "2px solid var(--accent)" : "1.5px solid var(--line)",
                    borderRadius: 14,
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "var(--green-3)", fontWeight: 600 }}>{p.cat}</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: p.inStock ? "var(--green)" : "#9C3A26",
                background: p.inStock ? "var(--sage)" : "#FCEDE9",
                border: `1px solid ${p.inStock ? "#cfe0c6" : "#F0C5BA"}`,
                padding: "4px 11px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              {p.inStock ? "В наличии" : "Под заказ"}
            </span>
          </div>
          <h1 className="bn-h" style={{ fontSize: "clamp(28px, 5.5vw, 40px)", fontWeight: 600, margin: "0 0 6px", lineHeight: 1.1 }}>
            {p.name}
          </h1>
          {p.lat && (
            <div style={{ fontSize: 15, color: "#aab3a8", fontStyle: "italic", marginBottom: 12 }}>{p.lat}</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={17} />
              ))}
            </span>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>{p.rating}</span>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 30, fontWeight: 800 }}>
                {hasPrice ? money(pricePerPack) : p.price}
              </span>
              {hasPrice && p.oldValue > 0 && (
                <span style={{ fontSize: 18, color: "#aab3a8", textDecoration: "line-through" }}>
                  {money(oldPerPack)}
                </span>
              )}
            </div>
            {hasPrice && activePack > 1 && (
              <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 4 }}>
                за комплект ({activePack} шт) · {money(p.priceValue)} за шт
              </div>
            )}
          </div>
          {p.color && (
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--muted)", margin: "0 0 26px", maxWidth: 520 }}>
              {p.color}.
            </p>
          )}

          {specRows.length > 0 && (
            <div
              style={{
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: "6px 18px",
                marginBottom: 26,
              }}
            >
              {specRows.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "11px 0",
                    fontSize: 14,
                    borderTop: i === 0 ? "none" : "1px solid var(--line)",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>{s.label}</span>
                  <span style={{ fontWeight: 600, textAlign: "right" }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {packOptions.length > 1 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Фасовка</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {packOptions.map((n) => {
                  const selected = n === activePack;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setPack(n);
                        setQty(1);
                      }}
                      aria-pressed={selected}
                      style={{
                        border: selected ? "1.5px solid var(--accent)" : "1.5px solid var(--line)",
                        background: selected ? "var(--sage)" : "#fff",
                        color: "var(--ink)",
                        borderRadius: 14,
                        padding: "9px 16px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        minWidth: 96,
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{n === 1 ? "Поштучно" : `${n} шт`}</div>
                      {hasPrice && (
                        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
                          {money(p.priceValue * n)}
                          {n > 1 ? " / компл." : " / шт"}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            {activePack > 1 ? "Количество комплектов" : "Количество"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
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
              onClick={() => {
                add(p, activePack, qty);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1600);
              }}
              className="bn-hover-fade"
              style={{
                flex: 1,
                border: "none",
                background: added ? "var(--green)" : "var(--accent)",
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
              {added ? <Check size={19} strokeWidth={2.4} /> : <Cart size={19} strokeWidth={1.8} />}
              {added ? "Добавлено" : "В корзину"}
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
          {hasPrice && totalPieces > 1 && (
            <div style={{ fontSize: 14.5, marginBottom: 18 }}>
              {activePack > 1 && (
                <span style={{ color: "var(--muted)" }}>Всего {totalPieces} шт · </span>
              )}
              <b>Итого: {money(total)}</b>
            </div>
          )}
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
              <b>Бесплатная доставка</b> по всей России — с трекингом отправления и памяткой по посадке.
            </span>
          </div>
          <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.9 }}>
            {p.lat && (
              <div>
                <b style={{ color: "var(--ink)" }}>Сорт:</b> {p.lat}
              </div>
            )}
            <div>
              <b style={{ color: "var(--ink)" }}>Срок посадки:</b> {SEASON_LABEL[p.season]}
            </div>
            <div>
              <b style={{ color: "var(--ink)" }}>Категория:</b> {p.cat}
            </div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 32px 24px" }}>
        <div style={{ display: "flex", gap: 36, borderBottom: "1px solid var(--line)", marginBottom: 28 }}>
          {["Описание", "Посадка и уход"].map((labelText, i) => (
            <button
              key={labelText}
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
              {labelText}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div style={{ maxWidth: 820, fontSize: 15, lineHeight: 1.75, color: "#42503f" }}>
            {p.color && <p style={{ margin: "0 0 16px" }}>{p.color}.</p>}
            {p.usage && (
              <p style={{ margin: "0 0 18px" }}>
                <b style={{ color: "var(--ink)" }}>Применение:</b> {p.usage}.
              </p>
            )}
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {p.cls && (
                <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Check size={18} strokeWidth={2} style={{ stroke: "var(--green)", flex: "none" }} />
                  {p.cls}
                </li>
              )}
              {p.height && (
                <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Check size={18} strokeWidth={2} style={{ stroke: "var(--green)", flex: "none" }} />
                  Высота {p.height} см
                </li>
              )}
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
              <b style={{ color: "var(--ink)" }}>Когда сажать:</b> {SEASON_LABEL[p.season]}.
            </p>
            {p.depth && (
              <p style={{ margin: "0 0 14px" }}>
                <b style={{ color: "var(--ink)" }}>Глубина посадки:</b> {p.depth} см.
              </p>
            )}
            <p style={{ margin: "0 0 14px" }}>
              <b style={{ color: "var(--ink)" }}>Почва:</b> рыхлая, дренированная, нейтральная. На зиму замульчируйте торфом или листвой.
            </p>
            {p.zone && (
              <p style={{ margin: 0 }}>
                <b style={{ color: "var(--ink)" }}>Зона зимостойкости (USDA):</b> {p.zone}.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
