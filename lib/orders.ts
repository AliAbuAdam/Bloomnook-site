import { collection, getDocs, addDoc, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

/** Позиция в заказе. */
export interface OrderItem {
  name: string;
  qty: number;
  price: number; // цена за единицу, ₽
}

/** Контактные и адресные данные получателя заказа. */
export interface OrderCustomer {
  name: string; // имя получателя
  phone: string;
  email: string;
  city: string;
  address: string; // улица, дом, квартира
  comment: string; // комментарий к заказу ("" — нет)
}

/** Заказ пользователя, как он хранится в Firestore. */
export interface Order {
  id: string;
  createdAt: Date | null;
  items: OrderItem[];
  total: number; // итоговая сумма, ₽
  status: string; // напр. "Оформлен", "Доставлен"
  customer: OrderCustomer | null;
}

/** Привести произвольные данные документа к `OrderCustomer` (или null). */
function customerFromDoc(raw: unknown): OrderCustomer | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  return {
    name: String(c.name ?? ""),
    phone: String(c.phone ?? ""),
    email: String(c.email ?? ""),
    city: String(c.city ?? ""),
    address: String(c.address ?? ""),
    comment: String(c.comment ?? ""),
  };
}

/** Путь к коллекции заказов конкретного пользователя. */
export function ordersCollection(uid: string) {
  return collection(db, "users", uid, "orders");
}

/**
 * Загрузить заказы пользователя (по убыванию даты).
 *
 * Сейчас на сайте нет оформления заказа (покупка идёт через Ozon), поэтому
 * коллекция обычно пуста — это ожидаемо. Структура заложена так, чтобы позже
 * сюда можно было писать заказы (через админку или будущий чекаут).
 */
export async function fetchUserOrders(uid: string): Promise<Order[]> {
  const q = query(ordersCollection(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    const created = data.createdAt;
    return {
      id: d.id,
      createdAt: created instanceof Timestamp ? created.toDate() : null,
      items: Array.isArray(data.items) ? (data.items as OrderItem[]) : [],
      total: typeof data.total === "number" ? data.total : 0,
      status: typeof data.status === "string" ? data.status : "Оформлен",
      customer: customerFromDoc(data.customer),
    };
  });
}

/**
 * Создать заказ пользователя из позиций корзины с контактами получателя.
 * Дата проставляется на сервере (`serverTimestamp`), статус по умолчанию —
 * «Оформлен». Возвращает id заказа.
 */
export async function createOrder(
  uid: string,
  items: OrderItem[],
  total: number,
  customer: OrderCustomer,
): Promise<string> {
  const ref = await addDoc(ordersCollection(uid), {
    createdAt: serverTimestamp(),
    items,
    total,
    status: "Оформлен",
    customer,
  });
  return ref.id;
}
