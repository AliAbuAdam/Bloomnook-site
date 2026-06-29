import { pb } from "./pb";
import { testimonials as defaultTestimonials, faqs as defaultFaqs, type Testimonial, type Faq } from "./data";

/**
 * Редактируемые из админки текстовые разделы сайта (Linear CEO-39): отзывы,
 * акция посадки и FAQ. Хранятся в коллекции PocketBase `content` — по одной
 * записи на раздел: поле `key` (уникальный ключ раздела) + `data` (JSON).
 *
 * Чтение публичное; запись — только админам (API-правила коллекции, см.
 * scripts/pb-setup.mjs). Пока запись раздела не создана/не отредактирована,
 * витрина показывает значения по умолчанию из lib/data.ts — сайт никогда не
 * остаётся с пустыми разделами.
 */
export const CONTENT = "content";

/** Ключи разделов в коллекции `content`. */
export const CONTENT_KEYS = {
  promo: "promo",
  reviews: "reviews",
  faq: "faq",
} as const;

/** Текстовое наполнение блока «Акция посадки» (компонент SeasonalPromo). */
export interface PromoContent {
  /** Надзаголовок-капс над заголовком. */
  eyebrow: string;
  /** Первая (обычная) часть заголовка. */
  titleLead: string;
  /** Вторая (выделенная курсивом/цветом) часть заголовка. */
  titleAccent: string;
  /** Описание под заголовком. */
  text: string;
  /** Подпись на бейдже с таймером. */
  badge: string;
  /** Текст кнопки-ссылки. */
  ctaText: string;
  /** Куда ведёт кнопка. */
  ctaHref: string;
  /** Дедлайн акции для обратного отсчёта (ISO-строка, локальное время). */
  deadline: string;
}

export const DEFAULT_PROMO: PromoContent = {
  eyebrow: "Ограниченное предложение",
  titleLead: "Осенняя",
  titleAccent: "посадка",
  text: "Скидки до 30% на луковицы весеннего цветения. Успейте посадить до холодов.",
  badge: "До конца акции",
  ctaText: "К акции",
  ctaHref: "/shop",
  deadline: "2026-10-20T09:00:00",
};

/** Отзыв садовода (без поля initials — оно считается из имени). */
export type ReviewItem = Omit<Testimonial, "initials">;

export const DEFAULT_REVIEWS: ReviewItem[] = defaultTestimonials.map(({ initials, ...rest }) => {
  void initials;
  return rest;
});

export const DEFAULT_FAQ: Faq[] = defaultFaqs;

/**
 * Инициалы из имени: «Андрей П.» → «АП», «Елена» → «Е». Берём первые буквы
 * первых двух слов. Используется для аватарок-кружков в блоке отзывов, чтобы
 * админу не приходилось задавать инициалы вручную.
 */
export function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Прочитать раздел `key` из коллекции `content`. Если записи нет или база
 * недоступна — возвращает `fallback` (значения по умолчанию). `requestKey: null`
 * отключает авто-отмену PocketBase на случай параллельных запросов.
 */
async function fetchContent<T>(key: string, fallback: T): Promise<T> {
  try {
    const rec = await pb.collection(CONTENT).getFirstListItem(pb.filter("key = {:key}", { key }), {
      requestKey: null,
    });
    const data = rec.data as T;
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchPromo(): Promise<PromoContent> {
  // Сливаем с дефолтом: если в базе сохранён неполный объект (старая запись),
  // недостающие поля берутся из DEFAULT_PROMO.
  const data = await fetchContent<Partial<PromoContent>>(CONTENT_KEYS.promo, {});
  return { ...DEFAULT_PROMO, ...data };
}

export async function fetchReviews(): Promise<ReviewItem[]> {
  const data = await fetchContent<ReviewItem[]>(CONTENT_KEYS.reviews, DEFAULT_REVIEWS);
  return Array.isArray(data) && data.length ? data : DEFAULT_REVIEWS;
}

export async function fetchFaq(): Promise<Faq[]> {
  const data = await fetchContent<Faq[]>(CONTENT_KEYS.faq, DEFAULT_FAQ);
  return Array.isArray(data) && data.length ? data : DEFAULT_FAQ;
}

/**
 * Сохранить (создать или обновить) раздел `key`. Требует прав админа —
 * вызывается из админки. Upsert по уникальному ключу.
 */
export async function saveContent(key: string, data: unknown): Promise<void> {
  let existingId: string | null = null;
  try {
    const rec = await pb.collection(CONTENT).getFirstListItem(pb.filter("key = {:key}", { key }), {
      requestKey: null,
    });
    existingId = rec.id;
  } catch {
    existingId = null; // записи ещё нет
  }
  if (existingId) await pb.collection(CONTENT).update(existingId, { data });
  else await pb.collection(CONTENT).create({ key, data });
}
