"use client";

import { useCallback, useEffect, useState } from "react";
import Motif from "@/components/Motif";
import ContentManager from "@/components/ContentManager";
import { pb, USERS, type BloomUser } from "@/lib/pb";
import { money } from "@/lib/data";
import {
  AdminProduct,
  ProductInput,
  CATEGORIES,
  MOTIFS,
  SEASONS,
  emptyProduct,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
  isCurrentUserAdmin,
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

/**
 * Числовое поле, которое умеет быть пустым.
 * Обычный <input type="number"> с value={число} не даёт стереть 0
 * (Number("") снова 0), поэтому держим собственный текстовый черновик.
 */
function NumField({
  value,
  onChange,
  ...rest
}: { value: number; onChange: (n: number) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  const [text, setText] = useState(value === 0 ? "" : String(value));
  useEffect(() => {
    // Синхронизируемся с внешним значением (открытие на редактирование,
    // автоподсчёт), но не перебиваем то, что пользователь уже печатает.
    const parsed = text === "" ? 0 : Number(text);
    if (parsed !== value) setText(value === 0 ? "" : String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <input
      {...rest}
      type="number"
      value={text}
      onChange={(e) => {
        const v = e.target.value;
        setText(v);
        onChange(v === "" ? 0 : Number(v));
      }}
    />
  );
}

/**
 * Редактор комплектов (фасовки): админ задаёт, сколько штук в наборе.
 * Числа вводятся через поле (можно сразу несколько: «3, 5, 10»), добавляются
 * по Enter или кнопкой. Поштучная продажа (1 шт) доступна всегда — её добавлять
 * не нужно. Кол-во комплектов не ограничено.
 */
function PacksField({ value, onChange }: { value: number[]; onChange: (next: number[]) => void }) {
  const [text, setText] = useState("");

  function commit() {
    const parsed = text
      .split(/[^\d]+/)
      .map((s) => parseInt(s, 10))
      .filter((n) => Number.isFinite(n) && n > 1);
    if (parsed.length) {
      const merged = Array.from(new Set([...value, ...parsed])).sort((a, b) => a - b);
      onChange(merged);
    }
    setText("");
  }

  function remove(n: number) {
    onChange(value.filter((v) => v !== n));
  }

  const chip: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "#fff",
    border: "1.5px solid var(--line)",
    borderRadius: 999,
    padding: "7px 8px 7px 14px",
    fontSize: 13.5,
    fontWeight: 700,
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: value.length ? 10 : 0 }}>
        <span style={{ ...chip, background: "var(--sage)", borderColor: "#cfe0c6", color: "var(--green)", paddingRight: 14 }}>
          1 шт · поштучно
        </span>
        {value.map((n) => (
          <span key={n} style={chip}>
            {n} шт
            <button
              type="button"
              onClick={() => remove(n)}
              aria-label={`Убрать комплект ${n} шт`}
              style={{
                width: 20,
                height: 20,
                border: "none",
                background: "var(--sage)",
                color: "var(--muted)",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 14,
                lineHeight: "20px",
                padding: 0,
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ ...input, maxWidth: 200 }}
          inputMode="numeric"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          placeholder="напр. 3, 5, 10"
        />
        <button type="button" style={{ ...ghostBtn, padding: "10px 18px" }} onClick={commit}>
          Добавить
        </button>
      </div>
    </div>
  );
}

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
  const [user, setUser] = useState<BloomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"products" | "content">("products");
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const authed = !!user && isAdmin;

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  const [form, setForm] = useState<ProductInput | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Фото, уже сохранённые у редактируемого товара (на момент открытия формы).
  // Нужны, чтобы отличать «свежие» загрузки от уже опубликованных файлов.
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function evaluate(rec: BloomUser | null) {
      setUser(rec);
      if (rec) {
        try {
          setIsAdmin(await isCurrentUserAdmin());
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthReady(true);
    }
    void evaluate((pb.authStore.record as BloomUser) ?? null);
    return pb.authStore.onChange((_token, record) => {
      void evaluate((record as BloomUser) ?? null);
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setDataError("");
    try {
      setProducts(await fetchProducts());
    } catch (e) {
      setDataError(
        "Не удалось загрузить товары. Проверь подключение к базе данных и обнови страницу.",
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

  // Скидка считается автоматически из старой и новой цены.
  useEffect(() => {
    if (!form) return;
    const computed =
      form.old > form.price && form.price > 0 ? Math.round((1 - form.price / form.old) * 100) : 0;
    if (computed !== form.disc) setForm((f) => (f ? { ...f, disc: computed } : f));
  }, [form?.price, form?.old, form?.disc, form]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      await pb.collection(USERS).authWithPassword(email.trim(), password);
      // authStore.onChange выставит user и откроет админку.
    } catch {
      setLoginError("Неверный email или пароль");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    pb.authStore.clear();
    setEmail("");
    setPassword("");
    cancelForm();
  }

  function openNew() {
    const nextOrder = products.length ? Math.max(...products.map((p) => p.order)) + 1 : 0;
    setForm(emptyProduct(nextOrder));
    setEditingId(null);
    setOriginalImages([]);
  }

  function openEdit(p: AdminProduct) {
    const { id, ...rest } = p;
    void id;
    setForm({ ...rest });
    setEditingId(p.id);
    setOriginalImages(p.images);
  }

  /** Удалить из Storage «осиротевшие» файлы (загруженные в этой сессии и не сохранённые). */
  function discardSessionUploads(images: string[]) {
    images
      .filter((u) => !originalImages.includes(u))
      .forEach((u) => void deleteProductImage(u));
  }

  /** Закрыть форму без сохранения, прибрав за собой свежезагруженные файлы. */
  function cancelForm() {
    if (form) discardSessionUploads(form.images);
    setForm(null);
    setEditingId(null);
    setOriginalImages([]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      if (editingId) await updateProduct(editingId, form);
      else await addProduct(form);
      // Сохранение прошло — теперь можно безопасно стереть из Storage те ранее
      // опубликованные фото, которые админ убрал из товара.
      originalImages
        .filter((u) => !form.images.includes(u))
        .forEach((u) => void deleteProductImage(u));
      setForm(null);
      setEditingId(null);
      setOriginalImages([]);
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
      // Подчищаем фото товара из Storage.
      p.images.forEach((u) => void deleteProductImage(u));
      await load();
    } catch (err) {
      alert("Не удалось удалить товар. Подробности в консоли.");
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  function setField<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      // Грузим по очереди и дописываем в конец списка фото.
      const urls: string[] = [];
      for (const file of files) {
        urls.push(await uploadProductImage(file));
      }
      setForm((f) => (f ? { ...f, images: [...f.images, ...urls] } : f));
    } catch (err) {
      alert("Не удалось загрузить фото. Проверь подключение к хранилищу. Подробности в консоли.");
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // Удалить одно фото из списка (по индексу).
  function removeImage(idx: number) {
    setForm((f) => {
      if (!f) return f;
      const url = f.images[idx];
      // Если фото загружено в этой сессии и ещё не сохранено — стираем файл сразу.
      // Уже опубликованные файлы удалим из Storage только при «Сохранить».
      if (url && !originalImages.includes(url)) void deleteProductImage(url);
      return { ...f, images: f.images.filter((_, i) => i !== idx) };
    });
  }

  // Сделать фото обложкой — переставить его в начало списка.
  function makeCover(idx: number) {
    setForm((f) => {
      if (!f || idx === 0) return f;
      const next = [...f.images];
      const [pic] = next.splice(idx, 1);
      next.unshift(pic);
      return { ...f, images: next };
    });
  }

  // ---------- ПРОВЕРКА СЕССИИ ----------
  if (!authReady) {
    return (
      <main className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", textAlign: "center", color: "var(--muted)" }}>
        Загрузка…
      </main>
    );
  }

  // ---------- ВОШЁЛ, НО НЕ АДМИН ----------
  if (user && !isAdmin) {
    return (
      <main className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 400, border: "1px solid var(--line)", borderRadius: 20, padding: 36, textAlign: "center" }}>
          <h1 className="bn-h" style={{ fontSize: 26, fontWeight: 600, margin: "0 0 8px" }}>
            Нет доступа
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 24px" }}>
            Аккаунт {user.email} не является администратором.
          </p>
          <button style={{ ...ghostBtn, width: "100%" }} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </main>
    );
  }

  // ---------- LOGIN ----------
  if (!authed) {
    return (
      <main className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px", display: "flex", justifyContent: "center" }}>
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
    <main className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
        <h1 className="bn-h" style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 600, margin: 0 }}>
          Админка
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{user?.email}</span>
          <button style={ghostBtn} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>

      {/* ВКЛАДКИ: товары / текстовые разделы сайта */}
      <div style={{ display: "flex", gap: 8, margin: "16px 0 24px", flexWrap: "wrap" }}>
        <button style={tab === "products" ? primaryBtn : ghostBtn} onClick={() => setTab("products")}>
          Товары
        </button>
        <button style={tab === "content" ? primaryBtn : ghostBtn} onClick={() => setTab("content")}>
          Разделы сайта
        </button>
      </div>

      {tab === "content" && <ContentManager />}

      {tab === "products" && (
      <>
      <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 24px" }}>
        Изменения сохраняются в базе и сразу отражаются на витрине (главная и магазин).
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <button style={primaryBtn} onClick={openNew}>
          + Добавить товар
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
          <div className="bn-admin-form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            <div style={{ gridColumn: "span 3" }}>
              <label style={label}>
                Фото товара{" "}
                <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                  — можно несколько; первое фото становится обложкой
                </span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }}>
                {form.images.map((url, i) => (
                  <div
                    key={url}
                    style={{
                      position: "relative",
                      width: 96,
                      height: 96,
                      borderRadius: 12,
                      border: i === 0 ? "2px solid var(--accent)" : "1px solid var(--line)",
                      background: "var(--sage)",
                      overflow: "hidden",
                      flex: "none",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {i === 0 && (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          width: "100%",
                          textAlign: "center",
                          background: "var(--accent)",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 0",
                        }}
                      >
                        Обложка
                      </span>
                    )}
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => makeCover(i)}
                        title="Сделать обложкой"
                        style={{
                          position: "absolute",
                          left: 4,
                          bottom: 4,
                          border: "none",
                          background: "rgba(255,255,255,0.92)",
                          color: "var(--accent)",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 7px",
                          borderRadius: 999,
                          cursor: "pointer",
                        }}
                      >
                        ★ обложка
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      title="Удалить фото"
                      aria-label="Удалить фото"
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        width: 22,
                        height: 22,
                        border: "none",
                        background: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        fontSize: 14,
                        lineHeight: "22px",
                        textAlign: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* Кнопка добавления фото */}
                <label
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 12,
                    border: "1.5px dashed var(--line)",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    color: "var(--muted)",
                    fontSize: 12.5,
                    fontWeight: 700,
                    textAlign: "center",
                    cursor: uploading ? "default" : "pointer",
                    opacity: uploading ? 0.6 : 1,
                    flex: "none",
                  }}
                >
                  {form.images.length === 0 ? (
                    <Motif href={"#m-" + form.motif} strokeWidth={3} style={{ width: 34 }} />
                  ) : (
                    <span style={{ fontSize: 26, lineHeight: 1, color: "var(--accent)" }}>+</span>
                  )}
                  {uploading ? "Загрузка…" : form.images.length ? "Добавить" : "Выбрать фото"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImage}
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
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
              <label style={label}>Сорт (латиница)</label>
              <input style={input} value={form.lat} onChange={(e) => setField("lat", e.target.value)} placeholder="London" />
            </div>
            <div>
              <label style={label}>Срок посадки</label>
              <select style={input} value={form.season} onChange={(e) => setField("season", e.target.value as ProductInput["season"])}>
                {SEASONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={label}>Цена, ₽</label>
              <NumField style={input} min={0} value={form.price} onChange={(v) => setField("price", v)} required />
            </div>
            <div>
              <label style={label}>Старая цена, ₽ (пусто — нет скидки)</label>
              <NumField style={input} min={0} value={form.old} onChange={(v) => setField("old", v)} />
            </div>
            <div>
              <label style={label}>Скидка (считается сама)</label>
              <div
                style={{
                  ...input,
                  background: "var(--sage)",
                  color: form.disc ? "var(--green)" : "var(--muted)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {form.disc ? `−${form.disc}%` : "—"}
              </div>
            </div>
            <div>
              <label style={label}>Рейтинг</label>
              <NumField style={input} min={0} max={5} step={0.1} value={form.rating} onChange={(v) => setField("rating", v)} />
            </div>
            <div>
              <label style={label}>Порядок</label>
              <NumField style={input} value={form.order} onChange={(v) => setField("order", v)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
              <input id="inStock" type="checkbox" checked={form.inStock} onChange={(e) => setField("inStock", e.target.checked)} style={{ width: 18, height: 18 }} />
              <label htmlFor="inStock" style={{ fontSize: 14, fontWeight: 600 }}>
                В наличии
              </label>
            </div>
            <div style={{ gridColumn: "span 3" }}>
              <label style={label}>
                Комплекты{" "}
                <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                  — сколько штук в наборе. Цена комплекта = цена за шт × количество. Поштучно — всегда.
                </span>
              </label>
              <PacksField value={form.packs} onChange={(next) => setField("packs", next)} />
            </div>
            <div style={{ gridColumn: "span 3", height: 1, background: "var(--line)", margin: "4px 0" }} />
            <div>
              <label style={label}>Класс / группа</label>
              <input style={input} value={form.cls} onChange={(e) => setField("cls", e.target.value)} placeholder="Класс 3 (Триумф)" />
            </div>
            <div>
              <label style={label}>Высота, см</label>
              <input style={input} value={form.height} onChange={(e) => setField("height", e.target.value)} placeholder="60–70" />
            </div>
            <div>
              <label style={label}>Срок цветения</label>
              <input style={input} value={form.bloom} onChange={(e) => setField("bloom", e.target.value)} placeholder="Май (середина)" />
            </div>
            <div>
              <label style={label}>Глубина посадки, см</label>
              <input style={input} value={form.depth} onChange={(e) => setField("depth", e.target.value)} placeholder="15–20" />
            </div>
            <div>
              <label style={label}>Зона USDA</label>
              <input style={input} value={form.zone} onChange={(e) => setField("zone", e.target.value)} placeholder="3–4" />
            </div>
            <div>
              <label style={label}>Разбор луковиц</label>
              <input style={input} value={form.caliber} onChange={(e) => setField("caliber", e.target.value)} placeholder="20/22" />
            </div>
            <div style={{ gridColumn: "span 3" }}>
              <label style={label}>Особенности окраски и формы</label>
              <input style={input} value={form.color} onChange={(e) => setField("color", e.target.value)} />
            </div>
            <div style={{ gridColumn: "span 3" }}>
              <label style={label}>Применение</label>
              <input style={input} value={form.usage} onChange={(e) => setField("usage", e.target.value)} placeholder="Срезка, группы" />
            </div>
            <div style={{ gridColumn: "span 3" }}>
              <label style={label}>Условия выращивания и уход</label>
              <textarea
                style={{ ...input, minHeight: 96, resize: "vertical" }}
                value={form.care}
                onChange={(e) => setField("care", e.target.value)}
                placeholder="Освещение, полив, почва, подкормки, зимовка…"
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button type="submit" style={primaryBtn} disabled={saving}>
              {saving ? "Сохранение…" : "Сохранить"}
            </button>
            <button type="button" style={ghostBtn} onClick={cancelForm}>
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
            className="bn-admin-head"
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
              className="bn-admin-row"
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
              <span className="bn-ar-img" style={{ width: 44, height: 44, borderRadius: 10, background: "var(--sage)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Motif href={"#m-" + p.motif} strokeWidth={3} style={{ width: 24 }} />
                )}
              </span>
              <span className="bn-ar-name" style={{ fontWeight: 700 }}>{p.name}</span>
              <span className="bn-ar-cat" style={{ color: "var(--muted)" }}>{p.cat}</span>
              <span className="bn-ar-price" style={{ fontWeight: 700 }}>{money(p.price)}</span>
              <span className="bn-ar-disc" style={{ color: p.disc ? "var(--green)" : "var(--muted)" }}>{p.disc ? `−${p.disc}%` : "—"}</span>
              <span className="bn-ar-stock" style={{ color: p.inStock ? "var(--green)" : "#c0392b", fontWeight: 600 }}>{p.inStock ? "В наличии" : "Под заказ"}</span>
              <span className="bn-ar-act" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
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
        Вход защищён авторизацией, запись в каталог доступна только администраторам.
      </p>
      </>
      )}
    </main>
  );
}
