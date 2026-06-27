"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Motif from "@/components/Motif";
import AuthModal from "@/components/AuthModal";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import { Minus, Plus, Close, Truck, Lock, Check } from "@/components/icons";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/lib/orders";
import { money } from "@/lib/data";

const gridCols = "2.4fr 1fr 1.2fr 1fr 40px";

const summaryRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 12 };
const summaryLabel: React.CSSProperties = { color: "var(--muted)" };
const summaryValue: React.CSSProperties = { fontWeight: 700, whiteSpace: "nowrap" };

const fieldLabel: React.CSSProperties = { fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" };
const fieldInput: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid var(--line)",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 14.5,
  fontFamily: "inherit",
  outline: "none",
  background: "#fff",
};

/** Цена за комплект (или «по запросу», если цена не задана). */
function packPrice(unitPrice: number, pack: number): string {
  return unitPrice > 0 ? money(unitPrice * pack) : "по запросу";
}

export default function CartPage() {
  const { lines, hydrated, totalPieces, subtotal, setQty, remove, clear } = useCart();
  const { user } = useAuth();

  const [mode, setMode] = useState<"cart" | "checkout">("cart");
  const [authOpen, setAuthOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  // Контактные данные получателя.
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);

  // Подставляем email из аккаунта, пока поле пустое.
  useEffect(() => {
    if (user?.email) setEmail((e) => e || user.email!);
  }, [user]);

  // Если корзина опустела (не из-за оформления) — возвращаемся к виду корзины.
  useEffect(() => {
    if (lines.length === 0) setMode("cart");
  }, [lines.length]);

  function goToCheckout() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (lines.length === 0) return;
    setError("");
    setMode("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function placeOrder() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (lines.length === 0) return;
    if (!name.trim() || !phone.trim() || !email.trim() || !city.trim() || !address.trim()) {
      setError("Заполните обязательные поля: имя, телефон, email, город и адрес доставки.");
      return;
    }
    if (!consent) {
      setError("Подтвердите согласие на обработку персональных данных.");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      const items = lines.map((l) => ({
        name: l.pack > 1 ? `${l.name} (${l.pack} шт)` : l.name,
        qty: l.qty,
        price: l.unitPrice * l.pack,
      }));
      const id = await createOrder(user.uid, items, subtotal, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        comment: comment.trim(),
      });
      clear();
      setOrderId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError("Не удалось оформить заказ. Попробуйте ещё раз.");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setPlacing(false);
    }
  }

  const checkout = mode === "checkout";

  return (
    <main>
      <div style={{ background: "var(--sage-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
          <h1 className="bn-h" style={{ fontSize: "clamp(30px, 6vw, 46px)", fontWeight: 600, margin: 0 }}>
            {checkout ? "Оформление заказа" : "Корзина"}
          </h1>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 10 }}>
            <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>
              Главная
            </Link>{" "}
            /&nbsp; <span style={{ color: "var(--ink)" }}>{checkout ? "Оформление" : "Корзина"}</span>
          </div>
        </div>
      </div>

      {!hydrated ? (
        <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", textAlign: "center", color: "var(--muted)" }}>
          Загрузка…
        </div>
      ) : orderId ? (
        <OrderSuccess id={orderId} loggedIn={!!user} />
      ) : lines.length === 0 ? (
        <EmptyCart />
      ) : (
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
            {checkout ? (
              <CheckoutForm
                values={{ name, phone, email, city, address, comment }}
                set={{ setName, setPhone, setEmail, setCity, setAddress, setComment }}
                consent={consent}
                onConsentChange={setConsent}
                onBack={() => setMode("cart")}
              />
            ) : (
              <>
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
                {lines.map((l) => (
                  <div
                    key={`${l.id}:${l.pack}`}
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
                      <Link
                        href={`/product?id=${l.id}`}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 12,
                          background: "var(--sage)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flex: "none",
                          overflow: "hidden",
                        }}
                      >
                        {l.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={l.image} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Motif href={l.useHref} strokeWidth={3} style={{ width: 32 }} />
                        )}
                      </Link>
                      <div>
                        <Link href={`/product?id=${l.id}`} style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.25, color: "var(--ink)", textDecoration: "none" }}>
                          {l.name}
                        </Link>
                        <div style={{ fontSize: 13, color: "var(--muted)" }}>
                          {l.cat}
                          {l.pack > 1 ? ` · комплект ${l.pack} шт` : ""}
                        </div>
                      </div>
                    </div>
                    <span className="bn-cc-price" style={{ fontWeight: 600 }}>{packPrice(l.unitPrice, l.pack)}</span>
                    <div className="bn-cc-qty" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--line)", borderRadius: 999 }}>
                        <button
                          onClick={() => setQty(l.id, l.pack, l.qty - 1)}
                          aria-label="Уменьшить количество"
                          style={{ border: "none", background: "none", width: 36, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", cursor: "pointer" }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={{ width: 34, textAlign: "center", fontWeight: 700 }}>{l.qty}</span>
                        <button
                          onClick={() => setQty(l.id, l.pack, l.qty + 1)}
                          aria-label="Увеличить количество"
                          style={{ border: "none", background: "none", width: 36, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)", cursor: "pointer" }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <span className="bn-cc-sum" style={{ fontWeight: 800, textAlign: "right" }}>
                      {l.unitPrice > 0 ? money(l.unitPrice * l.pack * l.qty) : "—"}
                    </span>
                    <button
                      onClick={() => remove(l.id, l.pack)}
                      aria-label="Удалить из корзины"
                      className="bn-cc-del"
                      style={{ border: "none", background: "none", display: "flex", justifyContent: "center", color: "#b9c2b6", cursor: "pointer" }}
                    >
                      <Close />
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 26, flexWrap: "wrap" }}>
                  <button
                    onClick={clear}
                    style={{ border: "none", background: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "var(--muted)" }}
                  >
                    Очистить корзину
                  </button>
                  <Link
                    href="/shop"
                    style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: 3 }}
                  >
                    Продолжить покупки
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* summary */}
          <div style={{ border: "1px solid var(--line)", borderRadius: 20, padding: 28, position: "sticky", top: 96 }}>
            <h3 className="bn-h" style={{ fontSize: 24, fontWeight: 600, margin: "0 0 22px" }}>
              Ваш заказ
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14.5 }}>
              <div style={summaryRow}>
                <span style={summaryLabel}>Товаров</span>
                <span style={summaryValue}>{totalPieces}</span>
              </div>
              <div style={summaryRow}>
                <span style={summaryLabel}>Сумма</span>
                <span style={summaryValue}>{subtotal > 0 ? money(subtotal) : "по запросу"}</span>
              </div>
              <div style={summaryRow}>
                <span style={summaryLabel}>Доставка</span>
                <span style={{ ...summaryValue, color: "var(--green)" }}>Бесплатно</span>
              </div>
            </div>
            <div style={{ height: 1, background: "var(--line)", margin: "20px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Итого</span>
              <span className="bn-h" style={{ fontSize: 28, fontWeight: 700, whiteSpace: "nowrap" }}>
                {subtotal > 0 ? money(subtotal) : "по запросу"}
              </span>
            </div>
            {error && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <button
              onClick={checkout ? placeOrder : goToCheckout}
              disabled={placing || (checkout && !consent)}
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
                cursor: placing || (checkout && !consent) ? "default" : "pointer",
                opacity: placing || (checkout && !consent) ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontFamily: "inherit",
              }}
            >
              {checkout ? <Check size={19} strokeWidth={2.2} /> : <Truck size={19} strokeWidth={1.8} />}
              {checkout ? (placing ? "Оформляем…" : "Подтвердить заказ") : "Оформить заказ"}
            </button>
            {!user && !checkout && (
              <div style={{ fontSize: 12.5, color: "var(--muted)", textAlign: "center", marginTop: 12 }}>
                Войдите в аккаунт, чтобы оформить заказ — он сохранится в разделе «Мои заказы».
              </div>
            )}
            {checkout && (
              <button
                onClick={() => setMode("cart")}
                style={{ width: "100%", border: "none", background: "none", marginTop: 12, cursor: "pointer", fontFamily: "inherit", fontSize: 13.5, fontWeight: 700, color: "var(--muted)" }}
              >
                ← Вернуться в корзину
              </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 14, fontSize: 12.5, color: "var(--muted)" }}>
              <Lock />
              Бесплатная доставка по всей России
            </div>
          </div>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}

interface FormValues {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  comment: string;
}

interface FormSetters {
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setCity: (v: string) => void;
  setAddress: (v: string) => void;
  setComment: (v: string) => void;
}

/** Форма контактов и доставки на шаге оформления. */
function CheckoutForm({
  values,
  set,
  consent,
  onConsentChange,
  onBack,
}: {
  values: FormValues;
  set: FormSetters;
  consent: boolean;
  onConsentChange: (v: boolean) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
        <h2 className="bn-h" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
          Контакты и доставка
        </h2>
        <button
          onClick={onBack}
          style={{ border: "none", background: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13.5, color: "var(--muted)" }}
        >
          ← В корзину
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="bn-stack">
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={fieldLabel}>Имя получателя *</label>
          <input style={fieldInput} value={values.name} onChange={(e) => set.setName(e.target.value)} autoComplete="name" placeholder="Иван Иванов" />
        </div>
        <div>
          <label style={fieldLabel}>Телефон *</label>
          <input style={fieldInput} value={values.phone} onChange={(e) => set.setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="+7 900 000-00-00" />
        </div>
        <div>
          <label style={fieldLabel}>Email *</label>
          <input style={fieldInput} type="email" value={values.email} onChange={(e) => set.setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
        </div>
        <div>
          <label style={fieldLabel}>Город *</label>
          <input style={fieldInput} value={values.city} onChange={(e) => set.setCity(e.target.value)} autoComplete="address-level2" placeholder="Москва" />
        </div>
        <div>
          <label style={fieldLabel}>Адрес доставки *</label>
          <input style={fieldInput} value={values.address} onChange={(e) => set.setAddress(e.target.value)} autoComplete="street-address" placeholder="Улица, дом, квартира" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={fieldLabel}>Комментарий к заказу</label>
          <textarea
            style={{ ...fieldInput, minHeight: 88, resize: "vertical" }}
            value={values.comment}
            onChange={(e) => set.setComment(e.target.value)}
            placeholder="Удобное время доставки, пожелания…"
          />
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <ConsentCheckbox checked={consent} onChange={onConsentChange} id="checkout-consent" />
      </div>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 14, lineHeight: 1.6 }}>
        Поля со звёздочкой (*) обязательны. После оформления мы свяжемся с вами для подтверждения.
      </p>
    </div>
  );
}

/** Пустая корзина. */
function EmptyCart() {
  return (
    <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 32px 96px", textAlign: "center" }}>
      <p style={{ fontSize: 17, color: "var(--muted)", margin: "0 0 22px" }}>
        В корзине пока пусто. Загляните в каталог — там много красивого.
      </p>
      <Link
        href="/shop"
        className="bn-hover-fade"
        style={{
          display: "inline-block",
          background: "var(--accent)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          padding: "14px 26px",
          borderRadius: 999,
          textDecoration: "none",
        }}
      >
        Перейти в магазин
      </Link>
    </div>
  );
}

/** Экран успешного оформления заказа. */
function OrderSuccess({ id, loggedIn }: { id: string; loggedIn: boolean }) {
  return (
    <div className="bn-pad" style={{ maxWidth: 640, margin: "0 auto", padding: "72px 32px 96px", textAlign: "center" }}>
      <span
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--sage)",
          color: "var(--green)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Check size={30} strokeWidth={2.4} />
      </span>
      <h2 className="bn-h" style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 600, margin: "0 0 10px" }}>
        Заказ оформлен!
      </h2>
      <p style={{ fontSize: 15, color: "var(--muted)", margin: "0 0 6px", lineHeight: 1.6 }}>
        Спасибо за заказ. Номер: <b style={{ color: "var(--ink)" }}>#{id.slice(0, 8).toUpperCase()}</b>.
      </p>
      <p style={{ fontSize: 14.5, color: "var(--muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
        Мы свяжемся с вами для подтверждения и уточнения доставки.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {loggedIn && (
          <Link
            href="/account"
            className="bn-hover-fade"
            style={{ background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 24px", borderRadius: 999, textDecoration: "none" }}
          >
            Мои заказы
          </Link>
        )}
        <Link
          href="/shop"
          style={{ border: "1.5px solid var(--line)", color: "var(--ink)", fontWeight: 700, fontSize: 15, padding: "13px 24px", borderRadius: 999, textDecoration: "none" }}
        >
          Продолжить покупки
        </Link>
      </div>
    </div>
  );
}
