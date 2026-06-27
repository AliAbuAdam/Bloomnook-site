import { pb, ORDERS } from "./pb";

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

/** Заказ пользователя, как он хранится в PocketBase. */
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

/**
 * Загрузить заказы пользователя (по убыванию даты создания).
 * Доступ ограничен API-правилами PocketBase: пользователь видит только свои
 * заказы (`user = @request.auth.id`).
 */
export async function fetchUserOrders(uid: string): Promise<Order[]> {
  const rows = await pb.collection(ORDERS).getFullList({
    filter: pb.filter("user = {:uid}", { uid }),
    sort: "-created",
  });
  return rows.map((r) => ({
    id: r.id,
    createdAt: r.created ? new Date(r.created as string) : null,
    items: Array.isArray(r.items) ? (r.items as OrderItem[]) : [],
    total: typeof r.total === "number" ? r.total : 0,
    status: typeof r.status === "string" ? r.status : "Оформлен",
    customer: customerFromDoc(r.customer),
  }));
}

/**
 * Создать заказ пользователя из позиций корзины с контактами получателя.
 * Дата создания (`created`) проставляется PocketBase автоматически, статус по
 * умолчанию — «Оформлен». Возвращает id заказа.
 */
export async function createOrder(
  uid: string,
  items: OrderItem[],
  total: number,
  customer: OrderCustomer,
): Promise<string> {
  const rec = await pb.collection(ORDERS).create({
    user: uid,
    items,
    total,
    status: "Оформлен",
    customer,
  });
  return rec.id;
}
