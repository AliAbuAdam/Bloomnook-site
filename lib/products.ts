import { pb, PRODUCTS, MEDIA, ADMINS } from "./pb";
import { money, discount, heightToCm, bloomToMonths, normalizeImages, type Motif, type Season, type Product } from "./data";

/** Raw product fields as stored in the PocketBase `products` collection. */
export interface ProductInput {
  name: string;
  lat: string; // сорт на латинице, "" — нет
  cat: string;
  motif: Motif;
  image: string; // обложка = первое фото (дублируется из images[0] для совместимости)
  images: string[]; // все фото товара (URL медиа-файлов PocketBase); [] — нет (рисуется силуэт-мотив)
  price: number;
  old: number; // 0 = no old price
  disc: number; // 0 = no discount
  rating: number;
  inStock: boolean;
  season: Season;
  cls: string; // класс / группа
  height: string; // высота, см ("60–70")
  bloom: string; // срок цветения ("Июль-Август")
  depth: string; // глубина посадки, см
  zone: string; // зона USDA
  caliber: string; // разбор / калибр луковиц ("20/22")
  color: string; // особенности окраски и формы
  usage: string; // применение
  care: string; // условия выращивания и уход
  packs: number[]; // комплекты (шт в наборе), напр. [3, 5, 10]; [] — только поштучно
  order: number;
}

/**
 * Привести список комплектов к чистому виду: целые положительные числа,
 * без дублей и без «1» (поштучная продажа добавляется на витрине сама),
 * в порядке возрастания.
 */
export function normalizePacks(raw: unknown): number[] {
  const arr = Array.isArray(raw) ? raw : [];
  const nums = arr
    .map((v) => Math.floor(Number(v)))
    .filter((n) => Number.isFinite(n) && n > 1);
  return Array.from(new Set(nums)).sort((a, b) => a - b);
}

/** A stored product with its PocketBase record id. */
export interface AdminProduct extends ProductInput {
  id: string;
}

export const PRODUCTS_COLLECTION = PRODUCTS;

/**
 * True, если текущий авторизованный пользователь — администратор.
 * Админство выдаётся записью в коллекции `admins` (создаётся только из
 * админки PocketBase). API-правила разрешают видеть лишь свою запись, поэтому
 * непустой результат = пользователь админ.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const uid = pb.authStore.record?.id;
  if (!uid) return false;
  const rows = await pb.collection(ADMINS).getFullList({
    filter: pb.filter("user = {:uid}", { uid }),
  });
  return rows.length > 0;
}

export const MOTIFS: Motif[] = ["tulip", "narcissus", "hyacinth", "lily", "crocus"];
export const CATEGORIES = ["Тюльпан", "Лилия", "Нарцисс", "Гименокаллис", "Эукомис"];
export const SEASONS: { value: Season; label: string }[] = [
  { value: "autumn", label: "Осенняя посадка" },
  { value: "spring", label: "Весенняя посадка" },
];

const TILE_TINTS = ["#EEF3EA", "#F5F2E8"];

/** Map a stored product to the display shape used by the storefront cards. */
export function toDisplayProduct(p: AdminProduct, index: number): Product {
  return {
    id: p.id,
    name: p.name,
    lat: p.lat,
    cat: p.cat,
    motif: p.motif,
    image: p.images[0] ?? "",
    images: p.images,
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
    caliber: p.caliber,
    color: p.color,
    usage: p.usage,
    care: p.care,
    packs: normalizePacks(p.packs),
    tile: TILE_TINTS[index % 2],
  };
}

/** Default form values for a new product. */
export function emptyProduct(order: number): ProductInput {
  return {
    name: "",
    lat: "",
    cat: CATEGORIES[0],
    motif: "tulip",
    image: "",
    images: [],
    price: 0,
    old: 0,
    disc: 0,
    rating: 4.8,
    inStock: true,
    season: "autumn",
    cls: "",
    height: "",
    bloom: "",
    depth: "",
    zone: "",
    caliber: "",
    color: "",
    usage: "",
    care: "",
    packs: [],
    order,
  };
}

function inputFromDoc(data: Record<string, unknown>): ProductInput {
  return {
    name: String(data.name ?? ""),
    lat: String(data.lat ?? ""),
    cat: String(data.cat ?? CATEGORIES[0]),
    motif: (data.motif as Motif) ?? "tulip",
    image: normalizeImages(data.images, data.image)[0] ?? "",
    images: normalizeImages(data.images, data.image),
    price: Number(data.price ?? 0),
    old: Number(data.old ?? 0),
    disc: Number(data.disc ?? 0),
    rating: Number(data.rating ?? 0),
    inStock: data.inStock !== false,
    season: (data.season as Season) === "spring" ? "spring" : "autumn",
    cls: String(data.cls ?? ""),
    height: String(data.height ?? ""),
    bloom: String(data.bloom ?? ""),
    depth: String(data.depth ?? ""),
    zone: String(data.zone ?? ""),
    caliber: String(data.caliber ?? ""),
    color: String(data.color ?? ""),
    usage: String(data.usage ?? ""),
    care: String(data.care ?? ""),
    packs: normalizePacks(data.packs),
    order: Number(data.order ?? 0),
  };
}

/** Fetch all products ordered by their `order` field. */
export async function fetchProducts(): Promise<AdminProduct[]> {
  const rows = await pb.collection(PRODUCTS).getFullList({ sort: "order" });
  return rows.map((r) => ({ id: r.id, ...inputFromDoc(r) }));
}

/** Fetch products mapped to the storefront display shape. */
export async function fetchDisplayProducts(): Promise<Product[]> {
  const list = await fetchProducts();
  return list.map((p, i) => toDisplayProduct(p, i));
}

/**
 * Привести фото к консистентному виду перед записью: `images` — чистый массив,
 * `image` — его первый элемент (обложка, для совместимости со старыми читателями).
 */
function withNormalizedImages(input: ProductInput): ProductInput {
  const images = normalizeImages(input.images, input.image);
  return { ...input, images, image: images[0] ?? "", packs: normalizePacks(input.packs) };
}

export async function addProduct(input: ProductInput): Promise<void> {
  await pb.collection(PRODUCTS).create(withNormalizedImages(input));
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  await pb.collection(PRODUCTS).update(id, withNormalizedImages(input));
}

/** Загрузить один товар по его id записи (для страницы товара). */
export async function fetchProductById(id: string): Promise<AdminProduct | null> {
  try {
    const r = await pb.collection(PRODUCTS).getOne(id);
    return { id: r.id, ...inputFromDoc(r) };
  } catch {
    return null;
  }
}

/** Загрузить один товар по id в форме для витрины (страница товара). */
export async function fetchDisplayProductById(id: string): Promise<Product | null> {
  const p = await fetchProductById(id);
  return p ? toDisplayProduct(p, 0) : null;
}

export async function deleteProduct(id: string): Promise<void> {
  await pb.collection(PRODUCTS).delete(id);
}

/**
 * Загрузить фото товара в PocketBase (коллекция `media`, по одному файлу на
 * запись) и вернуть его публичный URL для сохранения в поле `image`/`images`.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const rec = await pb.collection(MEDIA).create({ file });
  return pb.files.getURL(rec, rec.file as string);
}

/** id записи медиа из её файлового URL (`/api/files/{collection}/{recordId}/{file}`). */
function mediaRecordId(url: string): string | null {
  const m = url.match(/\/api\/files\/[^/]+\/([^/]+)\/[^/?]+/);
  return m ? m[1] : null;
}

/** Удалить файл фото по его URL. Тихо игнорирует чужие/внешние ссылки. */
export async function deleteProductImage(url: string): Promise<void> {
  if (!url) return;
  if (pb.baseURL && !url.startsWith(pb.baseURL)) return; // не из нашего хранилища
  const id = mediaRecordId(url);
  if (!id) return;
  try {
    await pb.collection(MEDIA).delete(id);
  } catch {
    /* файл уже удалён или запись не наша — не критично */
  }
}
