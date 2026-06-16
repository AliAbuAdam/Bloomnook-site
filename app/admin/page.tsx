"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import Motif from "@/components/Motif";
import { auth } from "@/lib/firebase";
import { money } from "@/lib/data";
import {
  AdminProduct,
  ProductInput,
  CATEGORIES,
  MOTIFS,
  emptyProduct,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  seedDemoProducts,
} from "@/lib/products";

const MOTIF_LABELS: Record<string, string> = {
  tulip: "Тюльпан",
  narcissus: "Нарцисс",
  hyacinth: "Гиацинт",
  lily: "Лилия",
  crocus: "Крокус",
};

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

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const authed = !!user;

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  const [form, setForm] = useState<ProductInput | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setDataError("");
    try {
      setProducts(await fetchProducts());
    } catch (e) {
      setDataError(
        "Не удалось загрузить товары из Firestore. Проверь, что база данных создана и включена в проекте bloomnook-site, затем обнови страницу.",
      );
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged выставит user и откроет админку.
    } catch {
      setLoginError("Неверный email или пароль");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setEmail("");
    setPassword("");
    setForm(null);
    setEditingId(null);
  }

  function openNew() {
    const nextOrder = products.length ? Math.max(...products.map((p) => p.order)) + 1 : 0;
    setForm(emptyProduct(nextOrder));
    setEditingId(null);
  }

  function openEdit(p: AdminProduct) {
    const { id, ...rest } = p;
    void id;
    setForm({ ...rest });
    setEditingId(p.id);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      if (editingId) await updateProduct(editingId, form);
      else await addProduct(form);
      setForm(null);
      setEditingId(null);
      await load();
    } catch (err) {
      alert("Не удалось сохранить товар. Подробности в консоли.");
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: AdminProduct) {
    if (!confirm(`Удалить «${p.name}»?`)) return;
    try {
      await deleteProduct(p.id);
      await load();
    } catch (err) {
      alert("Не удалось удалить товар. Подробности в консоли.");
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  async function handleSeed() {
    if (!confirm("Загрузить 12 демо-товаров в Firestore?")) return;
    try {
      await seedDemoProducts();
      await load();
    } catch (err) {
      alert("Не удалось загрузить демо-товары. Подробности в консоли.");
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  function setField<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  // ---------- ПРОВЕРКА СЕССИИ ----------
  if (!authReady) {
    return (
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", textAlign: "center", color: "var(--muted)" }}>
        Загрузка…
      </main>
    );
  }

  // ---------- LOGIN ----------
  if (!authed) {
    return (
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", display: "flex", justifyContent: "center" }}>
        <form
          onSubmit={handleLogin}
          style={{ width: "100%", maxWidth: 400, border: "1px solid var(--line)", borderRadius: 20, padding: 36 }}
        >
          <h1 className="bn-h" style={{ fontSize: 30, fontWeight: 600, margin: "0 0 6px" }}>
            Вход в админку
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 24px" }}>Управление товарами Bloom Nook</p>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Email</label>
            <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" autoComplete="username" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={label}>Пароль</label>
            <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          {loginError && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 16 }}>{loginError}</div>}
          <button type="submit" disabled={loggingIn} style={{ ...primaryBtn, width: "100%", padding: 14, opacity: loggingIn ? 0.6 : 1 }}>
            {loggingIn ? "Вход…" : "Войти"}
          </button>
        </form>
      </main>
    );
  }

  // ---------- PRODUCT MANAGER ----------
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
        <h1 className="bn-h" style={{ fontSize: 36, fontWeight: 600, margin: 0 }}>
          Товары
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{user?.email}</span>
          <button style={ghostBtn} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 24px" }}>
        Изменения сохраняются в Firestore и сразу отражаются на витрине (главная и магазин).
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <button style={primaryBtn} onClick={openNew}>
          + Добавить товар
        </button>
        <button style={ghostBtn} onClick={handleSeed}>
          Загрузить демо-товары
        </button>
        <button style={ghostBtn} onClick={load}>
          Обновить
        </button>
      </div>

      {dataError && (
        <div style={{ background: "#FCEDE9", border: "1px solid #F0C5BA", color: "#9C3A26", borderRadius: 12, padding: 16, fontSize: 14, marginBottom: 24 }}>
          {dataError}
        </div>
      )}

      {/* FORM */}
      {form && (
        <form
          onSubmit={handleSave}
          style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 24, marginBottom: 28, background: "var(--sage-2)" }}
        >
          <h2 className="bn-h" style={{ fontSize: 22, fontWeight: 600, margin: "0 0 18px" }}>
            {editingId ? "Редактировать товар" : "Новый товар"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={label}>Название</label>
              <input style={input} value={form.name} onChange={(e) => setField("name", e.target.value)} required />
            </div>
            <div>
              <label style={label}>Категория</label>
              <select style={input} value={form.cat} onChange={(e) => setField("cat", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={label}>Мотив (иллюстрация)</label>
              <select style={input} value={form.motif} onChange={(e) => setField("motif", e.target.value as ProductInput["motif"])}>
                {MOTIFS.map((m) => (
                  <option key={m} value={m}>
                    {MOTIF_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={label}>Цена, ₽</label>
              <input style={input} type="number" min={0} value={form.price} onChange={(e) => setField("price", Number(e.target.value))} required />
            </div>
            <div>
              <label style={label}>Старая цена, ₽ (0 — нет)</label>
              <input style={input} type="number" min={0} value={form.old} onChange={(e) => setField("old", Number(e.target.value))} />
            </div>
            <div>
              <label style={label}>Скидка, % (0 — нет)</label>
              <input style={input} type="number" min={0} max={99} value={form.disc} onChange={(e) => setField("disc", Number(e.target.value))} />
            </div>
            <div>
              <label style={label}>Рейтинг</label>
              <input style={input} type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => setField("rating", Number(e.target.value))} />
            </div>
            <div>
              <label style={label}>Порядок</label>
              <input style={input} type="number" value={form.order} onChange={(e) => setField("order", Number(e.target.value))} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
              <input id="inStock" type="checkbox" checked={form.inStock} onChange={(e) => setField("inStock", e.target.checked)} style={{ width: 18, height: 18 }} />
              <label htmlFor="inStock" style={{ fontSize: 14, fontWeight: 600 }}>
                В наличии
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button type="submit" style={primaryBtn} disabled={saving}>
              {saving ? "Сохранение…" : "Сохранить"}
            </button>
            <button
              type="button"
              style={ghostBtn}
              onClick={() => {
                setForm(null);
                setEditingId(null);
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* LIST */}
      {loading ? (
        <p style={{ color: "var(--muted)" }}>Загрузка…</p>
      ) : products.length === 0 && !dataError ? (
        <p style={{ color: "var(--muted)" }}>
          Товаров пока нет. Нажми «Загрузить демо-товары», чтобы заполнить каталог, или «Добавить товар».
        </p>
      ) : (
        <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "56px 2.4fr 1.2fr 1fr 1fr 0.8fr 160px",
              gap: 12,
              padding: "14px 18px",
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--muted)",
              background: "var(--sage-2)",
            }}
          >
            <span />
            <span>Название</span>
            <span>Категория</span>
            <span>Цена</span>
            <span>Скидка</span>
            <span>Наличие</span>
            <span style={{ textAlign: "right" }}>Действия</span>
          </div>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 2.4fr 1.2fr 1fr 1fr 0.8fr 160px",
                gap: 12,
                padding: "12px 18px",
                alignItems: "center",
                borderTop: "1px solid var(--line)",
                fontSize: 14,
              }}
            >
              <span style={{ width: 44, height: 44, borderRadius: 10, background: "var(--sage)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Motif href={"#m-" + p.motif} strokeWidth={3} style={{ width: 24 }} />
              </span>
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              <span style={{ color: "var(--muted)" }}>{p.cat}</span>
              <span style={{ fontWeight: 700 }}>{money(p.price)}</span>
              <span style={{ color: p.disc ? "var(--green)" : "var(--muted)" }}>{p.disc ? `−${p.disc}%` : "—"}</span>
              <span style={{ color: p.inStock ? "var(--green)" : "#c0392b", fontWeight: 600 }}>{p.inStock ? "В наличии" : "Под заказ"}</span>
              <span style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button style={{ ...ghostBtn, padding: "7px 14px", fontSize: 13 }} onClick={() => openEdit(p)}>
                  Изм.
                </button>
                <button
                  style={{ ...ghostBtn, padding: "7px 14px", fontSize: 13, color: "#c0392b", borderColor: "#e6c3bb" }}
                  onClick={() => handleDelete(p)}
                >
                  Удал.
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 24, lineHeight: 1.6 }}>
        ⚠️ Вход демонстрационный: учётные данные захардкожены в коде и не являются настоящей защитой. Для боевого режима
        нужно подключить Firebase Authentication и закрыть запись в Firestore правилами.
      </p>
    </main>
  );
}
