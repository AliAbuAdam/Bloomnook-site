/// <reference path="../pb_data/types.d.ts" />
//
// Приём платежей ЮKassa для Bloom Nook — серверная часть на JS-хуках PocketBase.
//
// Почему здесь: сайт статический (GitHub Pages), серверного Next.js нет, а
// секретный ключ ЮKassa и приём webhook требуют доверенного сервера в РФ. Им
// выступает этот PocketBase (VDS в Москве). Секреты берём из переменных
// окружения ($os.getenv), в код не коммитим.
//
// Переменные окружения (см. deploy/README.md, задаются через systemd EnvironmentFile):
//   YOOKASSA_SHOP_ID           — числовой идентификатор магазина (напр. 1387923)
//   YOOKASSA_SECRET_KEY        — секретный ключ (live_… / test_…)
//   YOOKASSA_RECEIPTS_ENABLED  — "1" чтобы добавлять фискальный чек (54-ФЗ)
//   YOOKASSA_TAX_SYSTEM_CODE   — код системы налогообложения чека (1-6); ПУСТО — не
//                                передавать (для АУСН и при одной системе — берётся из кабинета/кассы)
//   YOOKASSA_VAT_CODE          — ставка НДС позиций (по умолчанию 1 — без НДС; АУСН/УСН не платят НДС)
//   SITE_URL                   — базовый URL сайта (напр. https://bloomnook.ru)
//
// Роуты:
//   POST /api/yookassa/create-payment  — создаёт платёж, отдаёт confirmation_token
//   POST /api/yookassa/webhook         — уведомления ЮKassa о смене статуса платежа

const YK_API = "https://api.yookassa.ru/v3";

// Официальные диапазоны IP, с которых ЮKassa шлёт HTTP-уведомления.
// https://yookassa.ru/developers/using-api/webhooks (проверка источника webhook).
const YK_IPV4_CIDRS = [
  "185.71.76.0/27",
  "185.71.77.0/27",
  "77.75.153.0/25",
  "77.75.156.11/32",
  "77.75.156.35/32",
  "77.75.154.128/25",
];
const YK_IPV6_PREFIX = "2a02:5180:"; // 2a02:5180::/32

// --- Вспомогательные функции (самодостаточные, без внешних зависимостей) ---

// Base64 для ASCII-строк (goja не даёт btoa). Нужен для заголовка
// Authorization: Basic base64("shopId:secretKey").
function base64(str) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  let i = 0;
  while (i < str.length) {
    const c1 = str.charCodeAt(i++);
    const c2 = str.charCodeAt(i++);
    const c3 = str.charCodeAt(i++);
    const e1 = c1 >> 2;
    const e2 = ((c1 & 3) << 4) | (c2 >> 4);
    let e3 = ((c2 & 15) << 2) | (c3 >> 6);
    let e4 = c3 & 63;
    if (isNaN(c2)) { e3 = 64; e4 = 64; }
    else if (isNaN(c3)) { e4 = 64; }
    out += chars.charAt(e1) + chars.charAt(e2)
      + (e3 === 64 ? "=" : chars.charAt(e3))
      + (e4 === 64 ? "=" : chars.charAt(e4));
  }
  return out;
}

// Разобрать значение JSON-поля PocketBase в JS-объект (может прийти строкой).
function asData(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") { try { return JSON.parse(v); } catch (_) { return null; } }
  return v;
}

// Проверить, входит ли IPv4-адрес в CIDR "a.b.c.d/len".
function ipv4InCidr(ip, cidr) {
  const parts = cidr.split("/");
  const net = parts[0];
  const bits = parseInt(parts[1], 10);
  const toInt = (s) => {
    const o = s.split(".");
    if (o.length !== 4) return null;
    return (((+o[0]) << 24) | ((+o[1]) << 16) | ((+o[2]) << 8) | (+o[3])) >>> 0;
  };
  const a = toInt(ip);
  const b = toInt(net);
  if (a === null || b === null) return false;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (a & mask) === (b & mask);
}

// Разрешён ли IP как источник webhook ЮKassa.
function isYooKassaIP(ip) {
  if (!ip) return false;
  if (ip.indexOf(":") !== -1) return ip.toLowerCase().indexOf(YK_IPV6_PREFIX) === 0;
  for (let i = 0; i < YK_IPV4_CIDRS.length; i++) {
    if (ipv4InCidr(ip, YK_IPV4_CIDRS[i])) return true;
  }
  return false;
}

// Заголовок Basic-авторизации для API ЮKassa (или null, если нет ключей).
function ykAuthHeader() {
  const shopId = $os.getenv("YOOKASSA_SHOP_ID");
  const secret = $os.getenv("YOOKASSA_SECRET_KEY");
  if (!shopId || !secret) return null;
  return "Basic " + base64(shopId + ":" + secret);
}

// --- POST /api/yookassa/create-payment ---
// Требует авторизации. Создаёт платёж в ЮKassa для заказа текущего пользователя.
routerAdd("POST", "/api/yookassa/create-payment", (e) => {
  const auth = ykAuthHeader();
  if (!auth) {
    return e.json(500, { message: "Приём платежей не настроен на сервере." });
  }

  const body = e.requestInfo().body || {};
  const orderId = body.orderId;
  if (!orderId) {
    return e.json(400, { message: "Не передан orderId." });
  }

  let order;
  try {
    order = e.app.findRecordById("orders", orderId);
  } catch (_) {
    return e.json(404, { message: "Заказ не найден." });
  }

  // Заказ должен принадлежать авторизованному пользователю.
  if (order.get("user") !== e.auth.id) {
    return e.json(403, { message: "Это не ваш заказ." });
  }
  if (order.get("status") === "Оплачен") {
    return e.json(409, { message: "Заказ уже оплачен." });
  }

  const total = order.get("total");
  if (!(typeof total === "number") || total <= 0) {
    return e.json(400, { message: "Сумма заказа не определена — оплата недоступна." });
  }

  const shortId = String(orderId).slice(0, 8).toUpperCase();
  const payload = {
    amount: { value: total.toFixed(2), currency: "RUB" },
    capture: true,
    confirmation: { type: "embedded" },
    description: "Заказ #" + shortId + " — Bloom Nook",
    metadata: { order_id: orderId },
  };

  // Фискальный чек (54-ФЗ), если включён в окружении.
  if ($os.getenv("YOOKASSA_RECEIPTS_ENABLED") === "1") {
    const customer = asData(order.get("customer")) || {};
    const items = asData(order.get("items")) || [];
    const vatCode = parseInt($os.getenv("YOOKASSA_VAT_CODE") || "1", 10);
    const receiptItems = items.map((it) => ({
      description: String(it.name || "Товар").slice(0, 128),
      quantity: it.qty || 1,
      amount: { value: (Number(it.price) || 0).toFixed(2), currency: "RUB" },
      vat_code: vatCode,
    }));
    const receipt = { items: receiptItems, customer: {} };
    // tax_system_code передаём ТОЛЬКО если он явно задан. При одной системе
    // налогообложения ЮKassa берёт её из настроек кабинета/кассы. Для АУСН в
    // фискальном формате (тег 1055) валидного кода нет — оставляем env пустым.
    const taxSystemRaw = $os.getenv("YOOKASSA_TAX_SYSTEM_CODE");
    if (taxSystemRaw) receipt.tax_system_code = parseInt(taxSystemRaw, 10);
    if (customer.email) receipt.customer.email = customer.email;
    if (customer.phone) receipt.customer.phone = customer.phone;
    // Чек требует контакт покупателя: email или телефон.
    if (receipt.customer.email || receipt.customer.phone) {
      payload.receipt = receipt;
    }
  }

  let res;
  try {
    res = $http.send({
      url: YK_API + "/payments",
      method: "POST",
      headers: {
        "Authorization": auth,
        "Idempotence-Key": String(orderId),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      timeout: 30,
    });
  } catch (err) {
    e.app.logger().error("YooKassa create-payment request failed", "error", String(err));
    return e.json(502, { message: "Не удалось связаться с ЮKassa." });
  }

  if (res.statusCode !== 200 && res.statusCode !== 201) {
    e.app.logger().error("YooKassa create-payment error", "status", res.statusCode, "body", JSON.stringify(res.json));
    return e.json(502, { message: "ЮKassa отклонила создание платежа." });
  }

  const payment = res.json;

  // Сохраняем id платежа и статус ожидания (хук пишет в обход API-правил).
  try {
    order.set("paymentId", payment.id);
    order.set("status", "Ожидает оплаты");
    e.app.save(order);
  } catch (err) {
    e.app.logger().error("YooKassa: не удалось сохранить paymentId в заказ", "error", String(err));
  }

  const confirmation = payment.confirmation || {};
  return e.json(200, {
    paymentId: payment.id,
    confirmationToken: confirmation.confirmation_token || null,
    confirmationUrl: confirmation.confirmation_url || null,
  });
}, $apis.requireAuth());

// --- POST /api/yookassa/webhook ---
// Публичный роут: защита — белый список IP + перепроверка статуса через GET.
routerAdd("POST", "/api/yookassa/webhook", (e) => {
  // 1) Источник должен быть из диапазонов ЮKassa.
  if (!isYooKassaIP(e.realIP())) {
    // Не наш источник — молча подтверждаем (200), чтобы не провоцировать повторы.
    return e.json(200, {});
  }

  const auth = ykAuthHeader();
  if (!auth) return e.json(200, {});

  const body = e.requestInfo().body || {};
  const object = body.object || {};
  const paymentId = object.id;
  if (!paymentId) return e.json(200, {});

  // 2) Перепроверяем платёж авторитетно (не доверяем телу уведомления).
  let res;
  try {
    res = $http.send({
      url: YK_API + "/payments/" + paymentId,
      method: "GET",
      headers: { "Authorization": auth },
      timeout: 30,
    });
  } catch (err) {
    e.app.logger().error("YooKassa webhook: GET payment failed", "error", String(err));
    return e.json(200, {});
  }
  if (res.statusCode !== 200) return e.json(200, {});

  const payment = res.json || {};
  const status = payment.status;
  const orderId = (payment.metadata && payment.metadata.order_id) || null;

  // 3) Находим заказ (по metadata.order_id, иначе по сохранённому paymentId).
  let order = null;
  try {
    if (orderId) order = e.app.findRecordById("orders", orderId);
  } catch (_) { order = null; }
  if (!order) {
    try {
      order = e.app.findFirstRecordByFilter("orders", "paymentId = {:pid}", { pid: paymentId });
    } catch (_) { order = null; }
  }
  if (!order) return e.json(200, {});

  // 4) Обновляем статус заказа.
  if (status === "succeeded" && payment.paid) {
    order.set("status", "Оплачен");
    order.set("paidAt", new Date().toISOString());
  } else if (status === "canceled") {
    order.set("status", "Оплата не прошла");
  } else {
    return e.json(200, {}); // промежуточные статусы игнорируем
  }

  try {
    e.app.save(order);
  } catch (err) {
    e.app.logger().error("YooKassa webhook: не удалось сохранить заказ", "error", String(err));
  }

  return e.json(200, {});
});
