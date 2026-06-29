export type Motif = "tulip" | "narcissus" | "hyacinth" | "lily" | "crocus";

/** Контакты и соцсети Bloom Nook — единый источник для шапки, подвала и страницы контактов. */
export const CONTACT = {
  phone: "+7 925 531-99-38",
  phoneHref: "tel:+79255319938",
  email: "hello@bloomnook.ru",
  /** Чат с менеджером в Telegram. */
  telegram: "https://t.me/BloomNook1",
  /** Чат Bloom Nook в Яндексе. */
  yandex: "https://yandex.ru/chat/p/fa682602-6daa-95ee-799a-39195f7c1358?utm_source=invite",
} as const;

/** Русское склонение слова «сорт» по числу: 1 сорт, 2 сорта, 5 сортов. */
export function sortsLabel(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  let word = "сортов";
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) word = "сорт";
    else if (mod10 >= 2 && mod10 <= 4) word = "сорта";
  }
  return n + NBSP + word;
}

/** Срок посадки луковиц. */
export type Season = "autumn" | "spring";

const NBSP = " ";
const NNBSP = " ";
const RUB = "₽";
const MINUS = "−";

/** Format a number as roubles, e.g. 6200 -> "6 200 ₽" (non-breaking space). */
export function money(n: number): string {
  return n.toLocaleString("ru-RU") + NBSP + RUB;
}

/** Format a discount percentage, e.g. 30 -> "−30 %". */
export function discount(d: number): string {
  return MINUS + d + NNBSP + "%";
}

/** Месяцы, по которым строится фильтр «Срок цветения». */
export const BLOOM_MONTHS = ["Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь"] as const;

/** Нижняя граница высоты (см) из строки вида «60–70» или «45». 0 — если не распознано. */
export function heightToCm(height: string): number {
  const m = height.match(/\d+/);
  return m ? Number(m[0]) : 0;
}

/** Месяцы цветения, упомянутые в строке вида «Июль-Август» — для фильтра. */
export function bloomToMonths(bloom: string): string[] {
  return BLOOM_MONTHS.filter((mn) => bloom.includes(mn));
}

/**
 * Привести фото товара к массиву. Поддерживает и новое поле `images`, и старое
 * `image` (одна картинка) — для совместимости со старыми записями.
 */
export function normalizeImages(images?: unknown, image?: unknown): string[] {
  if (Array.isArray(images)) return images.map(String).filter(Boolean);
  const single = typeof image === "string" ? image : "";
  return single ? [single] : [];
}

export interface Product {
  id: string | number;
  name: string;
  lat: string;
  cat: string;
  motif: Motif;
  image: string; // обложка (первое фото), "" — нет
  images: string[]; // все фото товара; [] — нет
  useHref: string;
  price: string;
  priceValue: number;
  old: string | null;
  oldValue: number;
  disc: string | null;
  hasDisc: boolean;
  rating: string;
  ratingValue: number;
  inStock: boolean;
  season: Season;
  cls: string;
  height: string;
  heightCm: number;
  bloom: string;
  bloomMonths: string[];
  depth: string;
  zone: string;
  caliber: string; // разбор / калибр луковиц («20/22»)
  color: string;
  usage: string;
  care: string; // условия выращивания и уход
  /**
   * Доступные комплекты (фасовка) — число штук в наборе. Цена линейна:
   * комплект из N шт стоит `priceValue × N`. Поштучная продажа (1 шт)
   * доступна всегда и добавляется на витрине автоматически. [] — только поштучно.
   */
  packs: number[];
  tile: string;
}

export interface Category {
  name: string;
  motif: Motif;
  count: string;
  useHref: string;
}

export const categories: Category[] = [
  { name: "Тюльпаны", motif: "tulip", count: "48 сортов" },
  { name: "Нарциссы", motif: "narcissus", count: "32 сорта" },
  { name: "Гиацинты", motif: "hyacinth", count: "24 сорта" },
  { name: "Лилии", motif: "lily", count: "40 сортов" },
  { name: "Крокусы", motif: "crocus", count: "18 сортов" },
  { name: "Ирисы", motif: "lily", count: "22 сорта" },
].map((c) => ({ ...c, motif: c.motif as Motif, useHref: "#m-" + c.motif }));

export interface Step {
  n: string;
  t: string;
  d: string;
}

export const steps: Step[] = [
  { n: "01", t: "Выберите луковицы", d: "Подберите сорт, окраску и фасовку в каталоге — всё с фото цветения и описанием." },
  { n: "02", t: "Оформите на Ozon", d: "Нажмите «Заказать на Ozon» — оплата и доставка проходят на стороне маркетплейса." },
  { n: "03", t: "Получите посылку", d: "Луковицы приедут в защитной упаковке с памяткой по посадке для вашего сорта." },
  { n: "04", t: "Посадите и ждите", d: "Следуйте инструкции — и весной клумба отблагодарит вас цветением." },
];

export type BenefitIcon = "truck" | "shield" | "leaf";

export interface Benefit {
  icon: BenefitIcon;
  t: string;
  d: string;
}

export const benefits: Benefit[] = [
  { icon: "truck", t: "Доставка через Ozon", d: "Быстро и надёжно по всей России — с трекингом и бесплатной доставкой." },
  { icon: "shield", t: "Гарантия свежести", d: "Калиброванные луковицы. Получили несвежий товар — заменим или вернём деньги." },
  { icon: "leaf", t: "Поддержка агронома", d: "Поможем подобрать сорт и подскажем по посадке и уходу." },
];

export interface Testimonial {
  initials: string;
  name: string;
  city: string;
  title: string;
  text: string;
  rating: string;
}

export const testimonials: Testimonial[] = [
  { initials: "АП", name: "Андрей П.", city: "Москва", title: "Луковицы — отборные", text: "Заказал тюльпаны и нарциссы, пришли крупные и плотные. Оформление через Ozon заняло минуту, доставили за два дня.", rating: "5.0" },
  { initials: "ЕС", name: "Елена С.", city: "Санкт-Петербург", title: "Взошло всё до единой", text: "Сажала гиацинты осенью по их памятке — весной зацвела вся клумба. Очень довольна, буду заказывать ещё.", rating: "5.0" },
  { initials: "ДК", name: "Дмитрий К.", city: "Казань", title: "Удобно и понятно", text: "Понравилось, что видно как будет цвести, и что оплата идёт через Ozon — привычно и безопасно.", rating: "4.9" },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  { q: "Какие луковицы вы продаёте?", a: "Тюльпаны, нарциссы, гиацинты, лилии, крокусы и ирисы — только калиброванный посадочный материал проверенных питомников." },
  { q: "Как оформить заказ и оплатить?", a: "Вы выбираете товар на сайте и нажимаете «Заказать на Ozon». Оформление, оплата и доставка проходят на стороне Ozon — привычно и безопасно." },
  { q: "Когда сажать луковицы?", a: "Большинство весеннецветущих луковичных (тюльпаны, нарциссы, гиацинты, крокусы) сажают осенью, с сентября по октябрь. К каждому заказу прилагаем памятку." },
  { q: "Есть ли гарантия свежести?", a: "Да. Мы гарантируем свежесть посадочного материала при поставке. Если луковицы пришли несвежими или повреждёнными — мы заменим товар или вернём деньги." },
  { q: "Как ухаживать после посадки?", a: "Полив при посадке, мульчирование на зиму в холодных регионах и подкормка весной. Подробности — в памятке и у нашего агронома." },
  { q: "В какие регионы доставляете?", a: "По всей России через сеть Ozon. Сроки и стоимость доставки рассчитываются на странице товара в Ozon." },
];

export interface SizeOption {
  n: string;
  p: string;
}

export const sizes: SizeOption[] = [
  { n: "5 луковиц", p: "690 ₽" },
  { n: "10 луковиц", p: "1 290 ₽" },
  { n: "25 луковиц", p: "2 990 ₽" },
];

export const productTabs = ["Описание", "Посадка и уход", "Отзывы"];

export const galleryMotifs: Motif[] = ["tulip", "narcissus", "hyacinth", "crocus"];
