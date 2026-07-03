import { pb } from "./pb";

/** Ответ серверного хука создания платежа ЮKassa. */
export interface CreatePaymentResult {
  paymentId: string;
  /** Токен для встроенного виджета (сценарий confirmation type = embedded). */
  confirmationToken: string | null;
  /** URL страницы оплаты (сценарий redirect) — если сервер вернёт его вместо токена. */
  confirmationUrl: string | null;
}

/**
 * Создать платёж ЮKassa для ранее оформленного заказа.
 *
 * Вызывает серверный роут PocketBase (`pb_hooks/yookassa.pb.js`), который делает
 * server-to-server запрос к API ЮKassa с секретным ключом. `pb.send` автоматически
 * добавляет заголовок авторизации текущего пользователя — сервер проверяет, что
 * заказ принадлежит ему.
 */
export async function createPayment(orderId: string): Promise<CreatePaymentResult> {
  return pb.send("/api/yookassa/create-payment", {
    method: "POST",
    body: { orderId },
  });
}
