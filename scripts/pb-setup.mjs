// Создаёт коллекции PocketBase (products, orders, media, admins) и API-правила
// для сайта Bloom Nook. Идемпотентно: существующие коллекции пропускает.
//
// Запуск (сервер PocketBase должен быть доступен):
//   PB_URL=http://127.0.0.1:8090 \
//   PB_SUPERUSER_EMAIL=admin@example.com \
//   PB_SUPERUSER_PASSWORD=... \
//   node scripts/pb-setup.mjs
//
// Коллекция `users` (auth) уже существует по умолчанию — её не трогаем.

import PocketBase from "pocketbase";

const URL = process.env.PB_URL || "http://127.0.0.1:8090";
const EMAIL = process.env.PB_SUPERUSER_EMAIL;
const PASSWORD = process.env.PB_SUPERUSER_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("Задайте PB_SUPERUSER_EMAIL и PB_SUPERUSER_PASSWORD.");
  process.exit(1);
}

const pb = new PocketBase(URL);
pb.autoCancellation(false);

await pb.collection("_superusers").authWithPassword(EMAIL, PASSWORD).catch((e) => {
  console.error("Не удалось войти суперюзером:", e?.message || e);
  process.exit(1);
});

/** Создать коллекцию, если её ещё нет. */
async function ensure(name, spec) {
  try {
    await pb.collections.getOne(name);
    console.log(`= ${name}: уже есть, пропускаю`);
    return;
  } catch {
    /* нет — создаём */
  }
  await pb.collections.create({ name, ...spec });
  console.log(`+ ${name}: создана`);
}

const usersId = (await pb.collections.getOne("users")).id;

// Правило «текущий пользователь — админ» (есть запись в admins на него).
const IS_ADMIN = '@request.auth.id != "" && @collection.admins.user ?= @request.auth.id';
const IS_OWNER = '@request.auth.id != "" && user = @request.auth.id';

// admins — список администраторов (запись только через дашборд суперюзера).
// Создаём первой: на неё ссылаются правила products/media.
await ensure("admins", {
  type: "base",
  listRule: IS_OWNER,
  viewRule: IS_OWNER,
  createRule: null,
  updateRule: null,
  deleteRule: null,
  fields: [
    { name: "user", type: "relation", required: true, maxSelect: 1, cascadeDelete: true, collectionId: usersId },
  ],
});

// media — файлы-картинки товаров (по одному файлу на запись).
await ensure("media", {
  type: "base",
  listRule: "",
  viewRule: "",
  createRule: IS_ADMIN,
  updateRule: IS_ADMIN,
  deleteRule: IS_ADMIN,
  fields: [
    { name: "file", type: "file", required: true, maxSelect: 1, maxSize: 8388608 },
  ],
});

// products — каталог. Чтение публичное, запись — только админам.
await ensure("products", {
  type: "base",
  listRule: "",
  viewRule: "",
  createRule: IS_ADMIN,
  updateRule: IS_ADMIN,
  deleteRule: IS_ADMIN,
  fields: [
    { name: "name", type: "text", required: true },
    { name: "lat", type: "text" },
    { name: "cat", type: "text" },
    { name: "motif", type: "text" },
    { name: "image", type: "text" },
    { name: "images", type: "json", maxSize: 200000 },
    { name: "price", type: "number" },
    { name: "old", type: "number" },
    { name: "disc", type: "number" },
    { name: "rating", type: "number" },
    { name: "inStock", type: "bool" },
    { name: "season", type: "text" },
    { name: "cls", type: "text" },
    { name: "height", type: "text" },
    { name: "bloom", type: "text" },
    { name: "depth", type: "text" },
    { name: "zone", type: "text" },
    { name: "caliber", type: "text" },
    { name: "color", type: "text" },
    { name: "usage", type: "text" },
    { name: "care", type: "text" },
    { name: "packs", type: "json", maxSize: 200000 },
    { name: "order", type: "number" },
  ],
});

// orders — заказы. Пользователь видит/создаёт только свои; правка — суперюзер.
await ensure("orders", {
  type: "base",
  listRule: IS_OWNER,
  viewRule: IS_OWNER,
  createRule: '@request.auth.id != "" && @request.body.user = @request.auth.id',
  updateRule: null,
  deleteRule: null,
  fields: [
    { name: "user", type: "relation", required: true, maxSelect: 1, cascadeDelete: true, collectionId: usersId },
    { name: "items", type: "json", maxSize: 2000000 },
    { name: "total", type: "number" },
    { name: "status", type: "text" },
    { name: "customer", type: "json", maxSize: 200000 },
    { name: "created", type: "autodate", onCreate: true, onUpdate: false },
  ],
});

// content — редактируемые текстовые разделы сайта (отзывы, акция, FAQ).
// По одной записи на раздел: key (уникальный) + data (JSON).
// Чтение публичное, запись — только админам.
await ensure("content", {
  type: "base",
  listRule: "",
  viewRule: "",
  createRule: IS_ADMIN,
  updateRule: IS_ADMIN,
  deleteRule: IS_ADMIN,
  fields: [
    { name: "key", type: "text", required: true },
    { name: "data", type: "json", maxSize: 2000000 },
  ],
  indexes: ["CREATE UNIQUE INDEX `idx_content_key` ON `content` (`key`)"],
});

console.log("Готово. Схема PocketBase настроена.");
