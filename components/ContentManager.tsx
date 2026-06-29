"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchPromo,
  fetchReviews,
  fetchFaq,
  saveContent,
  initialsFromName,
  CONTENT_KEYS,
  DEFAULT_PROMO,
  type PromoContent,
  type ReviewItem,
} from "@/lib/content";
import type { Faq as FaqItem } from "@/lib/data";

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

const smallBtn: React.CSSProperties = { ...ghostBtn, padding: "6px 12px", fontSize: 13 };

const sectionCard: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: 24,
  marginBottom: 28,
  background: "var(--sage-2)",
};

const itemCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid var(--line)",
  borderRadius: 12,
  padding: 16,
  marginBottom: 14,
};

/** Шапка раздела с заголовком, статусом сохранения и кнопкой «Сохранить». */
function SectionHead({
  title,
  hint,
  status,
  saving,
  onSave,
}: {
  title: string;
  hint: string;
  status: string;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
      <div>
        <h2 className="bn-h" style={{ fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>
          {title}
        </h2>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0, maxWidth: 560 }}>{hint}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {status && <span style={{ fontSize: 13, color: status.startsWith("Не") ? "#c0392b" : "var(--green)", fontWeight: 600 }}>{status}</span>}
        <button type="button" style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }} disabled={saving} onClick={onSave}>
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}

/** «Сохранено»/«Ошибка» — общий хелпер для статусов сохранения раздела. */
function useSaver(key: string) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const save = useCallback(
    async (data: unknown) => {
      setSaving(true);
      setStatus("");
      try {
        await saveContent(key, data);
        setStatus("Сохранено");
      } catch (e) {
        setStatus("Не удалось сохранить");
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setSaving(false);
      }
    },
    [key],
  );
  return { saving, status, save };
}

/** Переместить элемент массива на позицию вверх/вниз (не мутируя исходный). */
function move<T>(arr: T[], idx: number, dir: -1 | 1): T[] {
  const next = [...arr];
  const target = idx + dir;
  if (target < 0 || target >= next.length) return arr;
  [next[idx], next[target]] = [next[target], next[idx]];
  return next;
}

function PromoEditor() {
  const [promo, setPromo] = useState<PromoContent>(DEFAULT_PROMO);
  const { saving, status, save } = useSaver(CONTENT_KEYS.promo);

  useEffect(() => {
    fetchPromo().then(setPromo).catch(() => {});
  }, []);

  function set<K extends keyof PromoContent>(k: K, v: PromoContent[K]) {
    setPromo((p) => ({ ...p, [k]: v }));
  }

  // <input type="datetime-local"> ждёт формат YYYY-MM-DDТHH:mm (без секунд/зоны).
  const deadlineLocal = promo.deadline ? promo.deadline.slice(0, 16) : "";

  return (
    <section style={sectionCard}>
      <SectionHead
        title="Акция посадки"
        hint="Блок с обратным отсчётом на главной. Заголовок состоит из двух частей: обычной и выделенной (курсив)."
        status={status}
        saving={saving}
        onSave={() => save(promo)}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        <div style={{ gridColumn: "span 2" }}>
          <label style={label}>Надзаголовок (капс)</label>
          <input style={input} value={promo.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
        </div>
        <div>
          <label style={label}>Заголовок — обычная часть</label>
          <input style={input} value={promo.titleLead} onChange={(e) => set("titleLead", e.target.value)} placeholder="Осенняя" />
        </div>
        <div>
          <label style={label}>Заголовок — выделенная часть (курсив)</label>
          <input style={input} value={promo.titleAccent} onChange={(e) => set("titleAccent", e.target.value)} placeholder="посадка" />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label style={label}>Описание</label>
          <textarea
            style={{ ...input, minHeight: 72, resize: "vertical" }}
            value={promo.text}
            onChange={(e) => set("text", e.target.value)}
          />
        </div>
        <div>
          <label style={label}>Текст кнопки</label>
          <input style={input} value={promo.ctaText} onChange={(e) => set("ctaText", e.target.value)} placeholder="К акции" />
        </div>
        <div>
          <label style={label}>Ссылка кнопки</label>
          <input style={input} value={promo.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} placeholder="/shop" />
        </div>
        <div>
          <label style={label}>Подпись над таймером</label>
          <input style={input} value={promo.badge} onChange={(e) => set("badge", e.target.value)} placeholder="До конца акции" />
        </div>
        <div>
          <label style={label}>Дедлайн акции (для отсчёта)</label>
          <input
            style={input}
            type="datetime-local"
            value={deadlineLocal}
            onChange={(e) => set("deadline", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

function ReviewsEditor() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const { saving, status, save } = useSaver(CONTENT_KEYS.reviews);

  useEffect(() => {
    fetchReviews().then(setItems).catch(() => {});
  }, []);

  function setItem(idx: number, patch: Partial<ReviewItem>) {
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function add() {
    setItems((list) => [...list, { name: "", city: "", title: "", text: "", rating: "5.0" }]);
  }

  function remove(idx: number) {
    setItems((list) => list.filter((_, i) => i !== idx));
  }

  return (
    <section style={sectionCard}>
      <SectionHead
        title="Отзывы"
        hint="Карточки отзывов на главной. Инициалы в аватарке считаются из имени автоматически."
        status={status}
        saving={saving}
        onSave={() => save(items)}
      />
      {items.map((it, i) => (
        <div key={i} style={itemCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>
              Отзыв {i + 1}
              {it.name ? ` · ${initialsFromName(it.name)}` : ""}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" style={smallBtn} onClick={() => setItems((l) => move(l, i, -1))} disabled={i === 0} title="Выше">
                ↑
              </button>
              <button type="button" style={smallBtn} onClick={() => setItems((l) => move(l, i, 1))} disabled={i === items.length - 1} title="Ниже">
                ↓
              </button>
              <button type="button" style={{ ...smallBtn, color: "#c0392b", borderColor: "#e6c3bb" }} onClick={() => remove(i)}>
                Удалить
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <div>
              <label style={label}>Имя</label>
              <input style={input} value={it.name} onChange={(e) => setItem(i, { name: e.target.value })} placeholder="Андрей П." />
            </div>
            <div>
              <label style={label}>Город</label>
              <input style={input} value={it.city} onChange={(e) => setItem(i, { city: e.target.value })} placeholder="Москва" />
            </div>
            <div>
              <label style={label}>Оценка</label>
              <input style={input} value={it.rating} onChange={(e) => setItem(i, { rating: e.target.value })} placeholder="5.0" />
            </div>
            <div style={{ gridColumn: "span 3" }}>
              <label style={label}>Заголовок отзыва</label>
              <input style={input} value={it.title} onChange={(e) => setItem(i, { title: e.target.value })} placeholder="Луковицы — отборные" />
            </div>
            <div style={{ gridColumn: "span 3" }}>
              <label style={label}>Текст отзыва</label>
              <textarea
                style={{ ...input, minHeight: 80, resize: "vertical" }}
                value={it.text}
                onChange={(e) => setItem(i, { text: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" style={ghostBtn} onClick={add}>
        + Добавить отзыв
      </button>
    </section>
  );
}

function FaqEditor() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const { saving, status, save } = useSaver(CONTENT_KEYS.faq);

  useEffect(() => {
    fetchFaq().then(setItems).catch(() => {});
  }, []);

  function setItem(idx: number, patch: Partial<FaqItem>) {
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function add() {
    setItems((list) => [...list, { q: "", a: "" }]);
  }

  function remove(idx: number) {
    setItems((list) => list.filter((_, i) => i !== idx));
  }

  return (
    <section style={sectionCard}>
      <SectionHead
        title="FAQ — частые вопросы"
        hint="Аккордеон с вопросами и ответами на главной."
        status={status}
        saving={saving}
        onSave={() => save(items)}
      />
      {items.map((it, i) => (
        <div key={i} style={itemCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Вопрос {i + 1}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" style={smallBtn} onClick={() => setItems((l) => move(l, i, -1))} disabled={i === 0} title="Выше">
                ↑
              </button>
              <button type="button" style={smallBtn} onClick={() => setItems((l) => move(l, i, 1))} disabled={i === items.length - 1} title="Ниже">
                ↓
              </button>
              <button type="button" style={{ ...smallBtn, color: "#c0392b", borderColor: "#e6c3bb" }} onClick={() => remove(i)}>
                Удалить
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={label}>Вопрос</label>
              <input style={input} value={it.q} onChange={(e) => setItem(i, { q: e.target.value })} />
            </div>
            <div>
              <label style={label}>Ответ</label>
              <textarea
                style={{ ...input, minHeight: 80, resize: "vertical" }}
                value={it.a}
                onChange={(e) => setItem(i, { a: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" style={ghostBtn} onClick={add}>
        + Добавить вопрос
      </button>
    </section>
  );
}

/**
 * Редактор текстовых разделов сайта (Linear CEO-39): акция посадки, отзывы, FAQ.
 * Каждый раздел сохраняется отдельной кнопкой в коллекцию PocketBase `content`.
 */
export default function ContentManager() {
  return (
    <div>
      <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 24px" }}>
        Тексты сохраняются в базе и сразу отражаются на главной странице. Каждый раздел сохраняется отдельно.
      </p>
      <PromoEditor />
      <ReviewsEditor />
      <FaqEditor />
    </div>
  );
}
