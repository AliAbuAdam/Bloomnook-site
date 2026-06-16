export type Motif = "tulip" | "narcissus" | "hyacinth" | "lily" | "crocus";

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

export interface Product {
  id: string | number;
  name: string;
  cat: string;
  motif: Motif;
  useHref: string;
  price: string;
  old: string | null;
  disc: string | null;
  hasDisc: boolean;
  rating: string;
  tile: string;
}

interface RawProduct {
  id: number;
  name: string;
  cat: string;
  motif: Motif;
  price: number;
  old: number;
  disc: number;
  rating: number;
}

export const RAW_PRODUCTS: RawProduct[] = [
  { id: 1, name: "Тюльпан «Триумф», микс", cat: "Тюльпаны", motif: "tulip", price: 690, old: 990, disc: 30, rating: 4.9 },
  { id: 2, name: "Нарцисс «Маунт Худ»", cat: "Нарциссы", motif: "narcissus", price: 540, old: 720, disc: 25, rating: 4.8 },
  { id: 3, name: "Гиацинт «Дельфт Блю»", cat: "Гиацинты", motif: "hyacinth", price: 480, old: 600, disc: 20, rating: 5.0 },
  { id: 4, name: "Лилия «Касабланка»", cat: "Лилии", motif: "lily", price: 920, old: 1150, disc: 20, rating: 4.9 },
  { id: 5, name: "Крокус «Жанна д’Арк»", cat: "Крокусы", motif: "crocus", price: 320, old: 420, disc: 24, rating: 4.7 },
  { id: 6, name: "Тюльпан «Дарвин», красный", cat: "Тюльпаны", motif: "tulip", price: 750, old: 990, disc: 24, rating: 4.8 },
  { id: 7, name: "Нарцисс «Тет-а-Тет»", cat: "Нарциссы", motif: "narcissus", price: 420, old: 0, disc: 0, rating: 4.9 },
  { id: 8, name: "Гиацинт «Пинк Перл»", cat: "Гиацинты", motif: "hyacinth", price: 510, old: 640, disc: 20, rating: 4.8 },
  { id: 9, name: "Лилия «Стар Гейзер»", cat: "Лилии", motif: "lily", price: 870, old: 1090, disc: 20, rating: 5.0 },
  { id: 10, name: "Крокус, ботанический микс", cat: "Крокусы", motif: "crocus", price: 290, old: 390, disc: 25, rating: 4.7 },
  { id: 11, name: "Тюльпан «Куин оф Найт»", cat: "Тюльпаны", motif: "tulip", price: 820, old: 0, disc: 0, rating: 4.9 },
  { id: 12, name: "Гиацинт «Карнеги», белый", cat: "Гиацинты", motif: "hyacinth", price: 470, old: 590, disc: 20, rating: 4.6 },
];

const TILE_TINTS = ["#EEF3EA", "#F5F2E8"];

export const products: Product[] = RAW_PRODUCTS.map((p, i) => ({
  id: p.id,
  name: p.name,
  cat: p.cat,
  motif: p.motif,
  useHref: "#m-" + p.motif,
  price: money(p.price),
  old: p.old ? money(p.old) : null,
  disc: p.disc ? discount(p.disc) : null,
  hasDisc: !!p.disc,
  rating: p.rating.toFixed(1),
  tile: TILE_TINTS[i % 2],
}));

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
  { icon: "truck", t: "Доставка через Ozon", d: "Быстро и надёжно по всей России — с трекингом и бесплатной доставкой от 2 000 ₽." },
  { icon: "shield", t: "Гарантия всхожести", d: "Калиброванные луковицы. Не взошло — заменим или вернём деньги." },
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
  { q: "Есть ли гарантия всхожести?", a: "Да. Если луковицы не взошли при соблюдении инструкции по посадке — мы заменим товар или вернём деньги." },
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
