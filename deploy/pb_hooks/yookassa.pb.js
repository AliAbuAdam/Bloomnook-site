/// <reference path="../pb_data/types.d.ts" />
//
// Приём платежей ЮKassa для Bloom Nook — регистрация роутов PocketBase.
//
// Почему здесь: сайт статический (GitHub Pages), серверного Next.js нет, а
// секретный ключ ЮKassa и приём webhook требуют доверенного сервера в РФ. Им
// выступает этот PocketBase (VDS в Москве). Секреты берём из переменных
// окружения ($os.getenv), в код не коммитим.
//
// Вся логика — в модуле yookassa_lib.js рядом. Обработчики routerAdd в
// PocketBase выполняются в изолированном контексте и НЕ видят функции верхнего
// уровня этого файла, поэтому модуль подключаем через require(`${__hooks}/…`)
// ВНУТРИ обработчиков.
//
// Переменные окружения (см. deploy/README.md, задаются через systemd EnvironmentFile):
//   YOOKASSA_SHOP_ID           — числовой идентификатор магазина (напр. 1387923)
//   YOOKASSA_SECRET_KEY        — секретный ключ (live_… / test_…)
//   YOOKASSA_RECEIPTS_ENABLED  — "1" чтобы добавлять фискальный чек (54-ФЗ)
//   YOOKASSA_TAX_SYSTEM_CODE   — код системы налогообложения чека (1-6); ПУСТО — не
//                                передавать (для АУСН и при одной системе — берётся из кабинета/кассы)
//   YOOKASSA_VAT_CODE          — ставка НДС позиций (по умолчанию 1 — без НДС; АУСН/УСН не платят НДС)
//   SITE_URL                   — базовый URL сайта (напр. https://bloomnook.ru)

// POST /api/yookassa/create-payment — создаёт платёж, отдаёт confirmation_token.
routerAdd("POST", "/api/yookassa/create-payment", (e) => {
  return require(`${__hooks}/yookassa_lib.js`).createPayment(e);
}, $apis.requireAuth());

// POST /api/yookassa/webhook — уведомления ЮKassa о смене статуса платежа.
routerAdd("POST", "/api/yookassa/webhook", (e) => {
  return require(`${__hooks}/yookassa_lib.js`).webhook(e);
});
