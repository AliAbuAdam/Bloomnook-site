import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { money, discount, heightToCm, bloomToMonths, normalizeImages, type Motif, type Season, type Product } from "./data";

/** Raw product fields as stored in the Firestore `products` collection. */
export interface ProductInput {
  name: string;
  lat: string; // сорт на латинице, "" — нет
  cat: string;
  motif: Motif;
  image: string; // обложка = первое фото (дублируется из images[0] для совместимости)
  images: string[]; // все фото товара (URL в Firebase Storage); [] — нет (рисуется силуэт-мотив)
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
  color: string; // особенности окраски и формы
  usage: string; // применение
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

/** A stored product with its Firestore document id. */
export interface AdminProduct extends ProductInput {
  id: string;
}

export const PRODUCTS_COLLECTION = "products";
export const ADMINS_COLLECTION = "admins";

/** True, если для данного UID есть документ в коллекции `admins`. */
export async function isAdminUser(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, ADMINS_COLLECTION, uid));
  return snap.exists();
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
    color: p.color,
    usage: p.usage,
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
    color: "",
    usage: "",
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
    color: String(data.color ?? ""),
    usage: String(data.usage ?? ""),
    packs: normalizePacks(data.packs),
    order: Number(data.order ?? 0),
  };
}

/** Fetch all products ordered by their `order` field. */
export async function fetchProducts(): Promise<AdminProduct[]> {
  const snap = await getDocs(query(collection(db, PRODUCTS_COLLECTION), orderBy("order")));
  return snap.docs.map((d) => ({ id: d.id, ...inputFromDoc(d.data()) }));
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
  await addDoc(collection(db, PRODUCTS_COLLECTION), withNormalizedImages(input) as unknown as Record<string, unknown>);
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), withNormalizedImages(input) as unknown as Record<string, unknown>);
}

/** Загрузить один товар по его id документа (для страницы товара). */
export async function fetchProductById(id: string): Promise<AdminProduct | null> {
  const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...inputFromDoc(snap.data()) };
}

/** Загрузить один товар по id в форме для витрины (страница товара). */
export async function fetchDisplayProductById(id: string): Promise<Product | null> {
  const p = await fetchProductById(id);
  return p ? toDisplayProduct(p, 0) : null;
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

/**
 * Загрузить фото товара в Firebase Storage (папка `products/`) и вернуть его
 * публичный URL для сохранения в поле `image`.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `products/${Date.now()}-${safeName}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file, { contentType: file.type || "image/jpeg" });
  return getDownloadURL(ref);
}

/** Удалить файл фото по его download-URL. Тихо игнорирует чужие/внешние ссылки. */
export async function deleteProductImage(url: string): Promise<void> {
  if (!url || !url.includes("firebasestorage.googleapis.com")) return;
  try {
    await deleteObject(storageRef(storage, url));
  } catch {
    /* файл уже удалён или путь не из нашего бакета — не критично */
  }
}

