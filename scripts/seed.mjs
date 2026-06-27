// Разовый сид демо-каталога товаров в PocketBase (коллекция `products`).
// Запуск:
//   PB_URL=http://127.0.0.1:8090 \
//   PB_SUPERUSER_EMAIL=admin@example.com \
//   PB_SUPERUSER_PASSWORD=... \
//   node scripts/seed.mjs
import PocketBase from "pocketbase";

const RAW = [
  { name: "Тюльпан «Триумф», микс", cat: "Тюльпаны", motif: "tulip", price: 690, old: 990, disc: 30, rating: 4.9 },
  { name: "Нарцисс «Маунт Худ»", cat: "Нарциссы", motif: "narcissus", price: 540, old: 720, disc: 25, rating: 4.8 },
  { name: "Гиацинт «Дельфт Блю»", cat: "Гиацинты", motif: "hyacinth", price: 480, old: 600, disc: 20, rating: 5.0 },
  { name: "Лилия «Касабланка»", cat: "Лилии", motif: "lily", price: 920, old: 1150, disc: 20, rating: 4.9 },
  { name: "Крокус «Жанна д’Арк»", cat: "Крокусы", motif: "crocus", price: 320, old: 420, disc: 24, rating: 4.7 },
  { name: "Тюльпан «Дарвин», красный", cat: "Тюльпаны", motif: "tulip", price: 750, old: 990, disc: 24, rating: 4.8 },
  { name: "Нарцисс «Тет-а-Тет»", cat: "Нарциссы", motif: "narcissus", price: 420, old: 0, disc: 0, rating: 4.9 },
  { name: "Гиацинт «Пинк Перл»", cat: "Гиацинты", motif: "hyacinth", price: 510, old: 640, disc: 20, rating: 4.8 },
  { name: "Лилия «Стар Гейзер»", cat: "Лилии", motif: "lily", price: 870, old: 1090, disc: 20, rating: 5.0 },
  { name: "Крокус, ботанический микс", cat: "Крокусы", motif: "crocus", price: 290, old: 390, disc: 25, rating: 4.7 },
  { name: "Тюльпан «Куин оф Найт»", cat: "Тюльпаны", motif: "tulip", price: 820, old: 0, disc: 0, rating: 4.9 },
  { name: "Гиацинт «Карнеги», белый", cat: "Гиацинты", motif: "hyacinth", price: 470, old: 590, disc: 20, rating: 4.6 },
];

const URL = process.env.PB_URL || "http://127.0.0.1:8090";
const EMAIL = process.env.PB_SUPERUSER_EMAIL;
const PASSWORD = process.env.PB_SUPERUSER_PASSWORD;
if (!EMAIL || !PASSWORD) {
  console.error("Задайте PB_SUPERUSER_EMAIL и PB_SUPERUSER_PASSWORD.");
  process.exit(1);
}

const pb = new PocketBase(URL);
pb.autoCancellation(false);
await pb.collection("_superusers").authWithPassword(EMAIL, PASSWORD);

const existing = await pb.collection("products").getList(1, 1);
if (existing.totalItems > 0) {
  console.log(`В коллекции уже ${existing.totalItems} товаров — сид пропущен (чтобы не дублировать).`);
  process.exit(0);
}

let i = 0;
for (const p of RAW) {
  await pb.collection("products").create({
    ...p,
    lat: "",
    image: "",
    images: [],
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
    order: i++,
  });
}
console.log(`Засеяно товаров: ${RAW.length}`);
process.exit(0);
