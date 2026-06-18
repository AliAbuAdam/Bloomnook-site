import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

/** Позиция в заказе. */
export interface OrderItem {
  name: string;
  qty: number;
  price: number; // цена за единицу, ₽
}

/** Заказ пользователя, как он хранится в Firestore. */
export interface Order {
  id: string;
  createdAt: Date | null;
  items: OrderItem[];
  total: number; // итоговая сумма, ₽
  status: string; // напр. "Оформлен", "Доставлен"
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
    };
  });
}
