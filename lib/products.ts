import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { money, discount, RAW_PRODUCTS, type Motif, type Product } from "./data";

/** Raw product fields as stored in the Firestore `products` collection. */
export interface ProductInput {
  name: string;
  cat: string;
  motif: Motif;
  price: number;
  old: number; // 0 = no old price
  disc: number; // 0 = no discount
  rating: number;
  inStock: boolean;
  order: number;
}

/** A stored product with its Firestore document id. */
export interface AdminProduct extends ProductInput {
  id: string;
}

export const PRODUCTS_COLLECTION = "products";

export const MOTIFS: Motif[] = ["tulip", "narcissus", "hyacinth", "lily", "crocus"];
export const CATEGORIES = ["Тюльпаны", "Нарциссы", "Гиацинты", "Лилии", "Крокусы", "Ирисы"];

const TILE_TINTS = ["#EEF3EA", "#F5F2E8"];

/** Map a stored product to the display shape used by the storefront cards. */
export function toDisplayProduct(p: AdminProduct, index: number): Product {
  return {
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
    tile: TILE_TINTS[index % 2],
  };
}

/** Default form values for a new product. */
export function emptyProduct(order: number): ProductInput {
  return { name: "", cat: CATEGORIES[0], motif: "tulip", price: 0, old: 0, disc: 0, rating: 4.8, inStock: true, order };
}

function inputFromDoc(data: Record<string, unknown>): ProductInput {
  return {
    name: String(data.name ?? ""),
    cat: String(data.cat ?? CATEGORIES[0]),
    motif: (data.motif as Motif) ?? "tulip",
    price: Number(data.price ?? 0),
    old: Number(data.old ?? 0),
    disc: Number(data.disc ?? 0),
    rating: Number(data.rating ?? 0),
    inStock: data.inStock !== false,
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

export async function addProduct(input: ProductInput): Promise<void> {
  await addDoc(collection(db, PRODUCTS_COLLECTION), input as unknown as Record<string, unknown>);
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), input as unknown as Record<string, unknown>);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

/** Seed the collection with the built-in demo catalogue (12 products). */
export async function seedDemoProducts(): Promise<number> {
  const batch = writeBatch(db);
  RAW_PRODUCTS.forEach((p, i) => {
    const ref = doc(collection(db, PRODUCTS_COLLECTION));
    const input: ProductInput = {
      name: p.name,
      cat: p.cat,
      motif: p.motif,
      price: p.price,
      old: p.old,
      disc: p.disc,
      rating: p.rating,
      inStock: true,
      order: i,
    };
    batch.set(ref, input as unknown as Record<string, unknown>);
  });
  await batch.commit();
  return RAW_PRODUCTS.length;
}
