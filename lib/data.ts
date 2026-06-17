export type Motif = "tulip" | "narcissus" | "hyacinth" | "lily" | "crocus";

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
 * `image` (одна картинка) — для совместимости со старыми записями в Firestore.
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
  color: string;
  usage: string;
  /**
   * Доступные комплекты (фасовка) — число штук в наборе. Цена линейна:
   * комплект из N шт стоит `priceValue × N`. Поштучная продажа (1 шт)
   * доступна всегда и добавляется на витрине автоматически. [] — только поштучно.
   */
  packs: number[];
  tile: string;
}

interface RawProduct {
  id: number;
  name: string;
  lat: string;
  cat: string;
  motif: Motif;
  image?: string;
  images?: string[];
  price: number;
  old: number;
  disc: number;
  rating: number;
  inStock: boolean;
  season: Season;
  cls: string;
  height: string;
  bloom: string;
  depth: string;
  zone: string;
  color: string;
  usage: string;
}

// Реальный каталог Bloom Nook. Цена / старая цена / скидка — заглушки (0),
// проставляются в админке. Срок посадки выведен по группе: тюльпаны — осень,
// лилии / гименокаллис / эукомис / кринум — весна.
// Реальный каталог из таблицы. Цена / старая цена / скидка / наличие — пустые
// (заполняются в админке). Все агро-характеристики — из таблицы.
export const RAW_PRODUCTS: RawProduct[] = [
  { id: 1, name: "Тюльпан «Лондон»", lat: "London", cat: "Тюльпан", motif: "tulip", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "autumn", cls: "Класс 5 (Дарвиновы гибриды)", height: "60–70", bloom: "Май (середина)", depth: "15–20", zone: "3–4", color: "Кроваво-красный с жёлтым дном, дно чёрно-коричневое", usage: "Срезка, группы" },
  { id: 2, name: "Тюльпан «Айс Крим»", lat: "Ice Cream", cat: "Тюльпан", motif: "tulip", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "autumn", cls: "Класс 11 (Махровый поздний)", height: "35–40", bloom: "Май (конец)", depth: "10–12", zone: "4", color: "Белый центр в окружении розовых лепестков, похож на мороженое", usage: "Контейнеры, бордюры" },
  { id: 3, name: "Тюльпан «Турмале»", lat: "Tourmalet", cat: "Тюльпан", motif: "tulip", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "autumn", cls: "Класс 7 (Бахромчатый)", height: "45–50", bloom: "Май", depth: "12–15", zone: "4", color: "Красный с ярко-жёлтой бахромой, бокал 7,5 см", usage: "Новинка 2022 года" },
  { id: 4, name: "Тюльпан «Аспирант»", lat: "Aspirant", cat: "Тюльпан", motif: "tulip", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "autumn", cls: "Класс 3 (Триумф)", height: "50–55", bloom: "Май (начало)", depth: "15", zone: "3–4", color: "Красный с белой каймой, неприхотлив, сизая листва", usage: "Озеленение" },
  { id: 5, name: "Тюльпан «Каньон»", lat: "Canyon", cat: "Тюльпан", motif: "tulip", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "autumn", cls: "Класс 11 (Махровый поздний)", height: "45", bloom: "Май (конец)", depth: "12", zone: "4", color: "Пурпурно-красный, почти чёрный в тени", usage: "Декор, срезка" },
  { id: 6, name: "Лилия «Старгейзер»", lat: "Stargazer", cat: "Лилия", motif: "lily", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "spring", cls: "Восточный гибрид", height: "80–100", bloom: "Июль-Август", depth: "15–20", zone: "5", color: "Малиново-розовый с крапом, направлен вверх", usage: "Ароматные букеты" },
  { id: 7, name: "Лилия «Аннамари Дрим»", lat: "Annemarie's Dream", cat: "Лилия", motif: "lily", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "spring", cls: "Азиатский гибрид", height: "70–80", bloom: "Июнь-Июль", depth: "15", zone: "3–4", color: "Махровая, белоснежная, без запаха и пыльцы", usage: "Аллергикам" },
  { id: 8, name: "Лилия «Эприкот Фадж»", lat: "Apricot Fudge", cat: "Лилия", motif: "lily", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "spring", cls: "Азиатский гибрид", height: "60–70", bloom: "Июль", depth: "15", zone: "4", color: "Уникальная форма «розочки», абрикосовый цвет", usage: "Флористика" },
  { id: 9, name: "Нарцисс «Пауэлла Альба»", lat: "Powellii Album", cat: "Нарцисс", motif: "narcissus", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "spring", cls: "Видовой / Кринум", height: "60–90", bloom: "Август", depth: "20", zone: "6–7", color: "Крупные белые колокольчатые цветы", usage: "Солитер, юг РФ" },
  { id: 10, name: "Гименокаллис «Адванс»", lat: "Advance", cat: "Гименокаллис", motif: "narcissus", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "spring", cls: "Исмене (Ismene)", height: "45–60", bloom: "Июнь-Июль", depth: "10", zone: "8", color: "Белый, экзотический вид, аромат ванили", usage: "Контейнеры" },
  { id: 11, name: "Эукомис «Биколор»", lat: "Bicolor", cat: "Эукомис", motif: "lily", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, season: "spring", cls: "Хохлатый лилейник", height: "30–60", bloom: "Июль-Август", depth: "12", zone: "7–8", color: "Зелёно-белый с пурпурной каймой, вид «ананаса»", usage: "Рокарии, кадки" },
];

const TILE_TINTS = ["#EEF3EA", "#F5F2E8"];

export const products: Product[] = RAW_PRODUCTS.map((p, i) => {
  const images = normalizeImages(p.images, p.image);
  return {
  id: p.id,
  name: p.name,
  lat: p.lat,
  cat: p.cat,
  motif: p.motif,
  image: images[0] ?? "",
  images,
  useHref: "#m-" + p.motif,
  price: p.price ? money(p.price) : "Цена по запросу",
  priceValue: p.price,
  old: p.old ? money(p.old) : null,
  oldValue: p.old,
  disc: p.disc ? discount(p.disc) : null,
  hasDisc: !!p.disc,
  rating: p.rating.toFixed(1),
  ratingValue: p.rating,
  inStock: p.inStock,
  season: p.season,
  cls: p.cls,
  height: p.height,
  heightCm: heightToCm(p.height),
  bloom: p.bloom,
  bloomMonths: bloomToMonths(p.bloom),
  depth: p.depth,
  zone: p.zone,
  color: p.color,
  usage: p.usage,
  packs: [],
  tile: TILE_TINTS[i % 2],
  };
});

export const bestsellers = products.slice(0, 4);
export const related = products.slice(5, 9);

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

export interface CartItem {
  name: string;
  cat: string;
  useHref: string;
  price: string;
  qty: number;
  sub: string;
}

export const cart: CartItem[] = [
  { name: "Тюльпан «Триумф», микс", cat: "Тюльпаны", useHref: "#m-tulip", price: "690 ₽", qty: 4, sub: "2" + NNBSP + "760 ₽" },
  { name: "Нарцисс «Маунт Худ»", cat: "Нарциссы", useHref: "#m-narcissus", price: "540 ₽", qty: 2, sub: "1" + NNBSP + "080 ₽" },
  { name: "Гиацинт «Дельфт Блю»", cat: "Гиацинты", useHref: "#m-hyacinth", price: "480 ₽", qty: 3, sub: "1" + NNBSP + "440 ₽" },
  { name: "Лилия «Касабланка»", cat: "Лилии", useHref: "#m-lily", price: "920 ₽", qty: 1, sub: "920 ₽" },
];
