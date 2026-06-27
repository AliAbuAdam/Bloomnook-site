// Делает пользователя сайта администратором: создаёт (если нужно) запись в
// коллекции `users` и запись в `admins`, привязанную к ней.
//
// Запуск:
//   PB_URL=https://api.bloomnook.ru \
//   PB_SUPERUSER_EMAIL=… PB_SUPERUSER_PASSWORD=… \
//   ADMIN_EMAIL=user@example.com ADMIN_PASSWORD=… \
//   node scripts/pb-make-admin.mjs
import PocketBase from "pocketbase";

const URL = process.env.PB_URL || "http://127.0.0.1:8090";
const SU_EMAIL = process.env.PB_SUPERUSER_EMAIL;
const SU_PASS = process.env.PB_SUPERUSER_PASSWORD;
const EMAIL = process.env.ADMIN_EMAIL;
const PASS = process.env.ADMIN_PASSWORD;

if (!SU_EMAIL || !SU_PASS || !EMAIL || !PASS) {
  console.error("Нужны PB_SUPERUSER_EMAIL/PASSWORD и ADMIN_EMAIL/PASSWORD.");
  process.exit(1);
}

const pb = new PocketBase(URL);
pb.autoCancellation(false);
await pb.collection("_superusers").authWithPassword(SU_EMAIL, SU_PASS);

// Найти или создать пользователя сайта.
let user;
try {
  user = await pb.collection("users").getFirstListItem(pb.filter("email = {:e}", { e: EMAIL }));
  console.log(`= пользователь ${EMAIL} уже есть`);
} catch {
  user = await pb.collection("users").create({
    email: EMAIL,
    password: PASS,
    passwordConfirm: PASS,
    verified: true,
  });
  console.log(`+ создан пользователь ${EMAIL}`);
}

// Выдать админство, если ещё нет.
const existing = await pb.collection("admins").getFullList({ filter: pb.filter("user = {:id}", { id: user.id }) });
if (existing.length) {
  console.log("= уже администратор");
} else {
  await pb.collection("admins").create({ user: user.id });
  console.log("+ выдано админство");
}
console.log("Готово.");
