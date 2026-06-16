// Разовый сид каталога товаров в Firestore (коллекция `products`).
// Запуск (Node 20.6+): node --env-file=.env.local scripts/seed.mjs
// Правила Firestore требуют авторизации на запись, поэтому скрипт логинится
// под учёткой администратора (ADMIN_EMAIL / ADMIN_PASSWORD из .env.local).
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminEmail || !adminPassword) {
  console.error("Не заданы ADMIN_EMAIL / ADMIN_PASSWORD. Запусти: node --env-file=.env.local scripts/seed.mjs");
  process.exit(1);
}
await signInWithEmailAndPassword(getAuth(app), adminEmail, adminPassword);

const col = collection(db, "products");

const existing = await getDocs(col);
if (!existing.empty) {
  console.log(`В коллекции уже ${existing.size} товаров — сид пропущен (чтобы не дублировать).`);
  process.exit(0);
}

const batch = writeBatch(db);
RAW.forEach((p, i) => {
  batch.set(doc(col), { ...p, inStock: true, order: i });
});
await batch.commit();
console.log(`Засеяно товаров: ${RAW.length}`);
process.exit(0);
