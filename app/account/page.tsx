"use client";

import { useCallback, useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { useAuth, authErrorMessage } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { fetchUserOrders, type Order } from "@/lib/orders";
import { money } from "@/lib/data";

const input: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid var(--line)",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  background: "#fff",
};

const label: React.CSSProperties = { fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" };

const primaryBtn: React.CSSProperties = {
  border: "none",
  background: "var(--accent)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  padding: "11px 20px",
  borderRadius: 999,
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  border: "1.5px solid var(--line)",
  background: "#fff",
  color: "var(--ink)",
  fontWeight: 700,
  fontSize: 14,
  padding: "10px 18px",
  borderRadius: 999,
  cursor: "pointer",
};

const card: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: 24,
  marginBottom: 24,
};

const dateFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export default function AccountPage() {
  const { user, loading, logout, changePassword } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  // --- смена пароля ---
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwNotice, setPwNotice] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  // --- заказы ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const loadOrders = useCallback(async (uid: string) => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      setOrders(await fetchUserOrders(uid));
    } catch (e) {
      setOrdersError("Не удалось загрузить заказы. Обновите страницу.");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadOrders(user.uid);
  }, [user, loadOrders]);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwNotice("");
    if (next !== confirm) {
      setPwError("Новые пароли не совпадают");
      return;
    }
    setPwBusy(true);
    try {
      await changePassword(current, next);
      setPwNotice("Пароль изменён");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      setPwError(authErrorMessage(code));
    } finally {
      setPwBusy(false);
    }
  }

  // ---------- загрузка сессии ----------
  if (loading) {
    return (
      <main className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", textAlign: "center", color: "var(--muted)" }}>
        Загрузка…
      </main>
    );
  }

  // ---------- гость ----------
  if (!user) {
    return (
      <>
        <main className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 420, ...card, textAlign: "center" }}>
            <h1 className="bn-h" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px" }}>
              Личный кабинет
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 24px" }}>
              Войдите или зарегистрируйтесь, чтобы видеть свои заказы и управлять аккаунтом.
            </p>
            <button style={{ ...primaryBtn, width: "100%", padding: 14 }} onClick={() => setAuthOpen(true)}>
              Войти / Зарегистрироваться
            </button>
          </div>
        </main>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  // ---------- залогинен ----------
  return (
    <main className="bn-pad" style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <h1 className="bn-h" style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 600, margin: 0 }}>
          Личный кабинет
        </h1>
        <button style={ghostBtn} onClick={() => logout()}>
          Выйти
        </button>
      </div>

      {/* Профиль */}
      <section style={card}>
        <h2 className="bn-h" style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>
          Профиль
        </h2>
        <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>{user.email}</p>
      </section>

      {/* Смена пароля */}
      <section style={card}>
        <h2 className="bn-h" style={{ fontSize: 20, fontWeight: 600, margin: "0 0 18px" }}>
          Сменить пароль
        </h2>
        <form onSubmit={handleChangePassword} style={{ display: "grid", gap: 16, maxWidth: 360 }}>
          <div>
            <label style={label}>Текущий пароль</label>
            <input style={input} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
          </div>
          <div>
            <label style={label}>Новый пароль</label>
            <input style={input} type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
          </div>
          <div>
            <label style={label}>Повторите новый пароль</label>
            <input style={input} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
          </div>
          {pwError && <div style={{ color: "#c0392b", fontSize: 13 }}>{pwError}</div>}
          {pwNotice && <div style={{ color: "var(--green-3)", fontSize: 13 }}>{pwNotice}</div>}
          <div>
            <button type="submit" style={{ ...primaryBtn, opacity: pwBusy ? 0.6 : 1 }} disabled={pwBusy}>
              {pwBusy ? "Сохранение…" : "Сменить пароль"}
            </button>
          </div>
        </form>
      </section>

      {/* Заказы */}
      <section style={card}>
        <h2 className="bn-h" style={{ fontSize: 20, fontWeight: 600, margin: "0 0 18px" }}>
          Мои заказы
        </h2>
        {ordersLoading ? (
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>Загрузка…</p>
        ) : ordersError ? (
          <p style={{ color: "#c0392b", fontSize: 14, margin: 0 }}>{ordersError}</p>
        ) : orders.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            Заказов пока нет. Выберите луковицы в каталоге и оформите заказ — он появится здесь.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map((o) => (
              <div key={o.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>
                    {o.createdAt ? dateFmt.format(o.createdAt) : "—"}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--green-3)", fontWeight: 700 }}>{o.status}</span>
                </div>
                <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6 }}>
                  {o.items.map((it, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        {it.name} × {it.qty}
                      </span>
                      <span>{money(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", marginTop: 10, paddingTop: 10, fontWeight: 700, fontSize: 14 }}>
                  <span>Итого</span>
                  <span>{money(o.total)}</span>
                </div>
                {o.customer && (o.customer.name || o.customer.city || o.customer.address) && (
                  <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
                    Доставка: {[o.customer.name, o.customer.city, o.customer.address].filter(Boolean).join(", ")}
                    {o.customer.phone ? ` · ${o.customer.phone}` : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
