// Разовая миграция КАТАЛОГА из Firestore в PocketBase.
// Переносит товары (коллекция `products`) и их фотографии: каждое фото
// скачивается из Firebase Storage и перезаливается в PocketBase (коллекция
// `media`), ссылки в товаре переписываются на новые.
//
// Заказы и пользователей этот скрипт НЕ переносит:
//  - пароли Firebase Auth не экспортируются в PocketBase (хеши несовместимы) —
//    покупатели регистрируются заново;
//  - заказы привязаны к uid и читаются только владельцем, для массового
//    переноса нужен Firebase Admin SDK (service account). Для нового магазина
//    обычно проще не переносить историю заказов.
//
// Запуск:
//   PB_URL=http://127.0.0.1:8090 \
//   PB_SUPERUSER_EMAIL=admin@example.com PB_SUPERUSER_PASSWORD=... \
//   node --env-file=.env.local scripts/migrate-firestore-to-pb.mjs
//
// .env.local должен содержать NEXT_PUBLIC_FIREBASE_* (как сейчас).

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import PocketBase from "pocketbase";

// ---- Firestore (источник) ----
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
if (!firebaseConfig.projectId) {
  console.error("Нет NEXT_PUBLIC_FIREBASE_*. Запускайте с --env-file=.env.local");
  process.exit(1);
}
const db = getFirestore(initializeApp(firebaseConfig));

// ---- PocketBase (приёмник) ----
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
  console.error(`В PocketBase уже ${existing.totalItems} товаров — прерываю, чтобы не дублировать.`);
  process.exit(1);
}

/** Скачать фото по URL и залить в media, вернуть новый URL PocketBase. */
async function rehostImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const type = res.headers.get("content-type") || "image/jpeg";
  const ext = type.split("/")[1]?.split(";")[0] || "jpg";
  const file = new File([buf], `img.${ext}`, { type });
  const rec = await pb.collection("media").create({ file });
  return pb.files.getURL(rec, rec.file);
}

const snap = await getDocs(collection(db, "products"));
console.log(`Товаров в Firestore: ${snap.size}`);

let n = 0;
for (const d of snap.docs) {
  const p = d.data();
  const srcImages = Array.isArray(p.images) ? p.images : p.image ? [p.image] : [];
  const images = [];
  for (const url of srcImages) {
    try {
      images.push(await rehostImage(url));
    } catch (e) {
      console.warn(`  фото пропущено (${url}): ${e.message}`);
    }
  }
  await pb.collection("products").create({
    name: String(p.name ?? ""),
    lat: String(p.lat ?? ""),
    cat: String(p.cat ?? ""),
    motif: String(p.motif ?? "tulip"),
    image: images[0] ?? "",
    images,
    price: Number(p.price ?? 0),
    old: Number(p.old ?? 0),
    disc: Number(p.disc ?? 0),
    rating: Number(p.rating ?? 0),
    inStock: p.inStock !== false,
    season: p.season === "spring" ? "spring" : "autumn",
    cls: String(p.cls ?? ""),
    height: String(p.height ?? ""),
    bloom: String(p.bloom ?? ""),
    depth: String(p.depth ?? ""),
    zone: String(p.zone ?? ""),
    caliber: String(p.caliber ?? ""),
    color: String(p.color ?? ""),
    usage: String(p.usage ?? ""),
    care: String(p.care ?? ""),
    packs: Array.isArray(p.packs) ? p.packs : [],
    order: Number(p.order ?? n),
  });
  n++;
  console.log(`  ✓ ${p.name} (${images.length} фото)`);
}
console.log(`Перенесено товаров: ${n}`);
process.exit(0);
