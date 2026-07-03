# Бэкенд на PocketBase (хранение данных в РФ)

Бэкенд сайта — **PocketBase**: самохостируемый сервер с REST API и встроенной
авторизацией. Это позволяет держать базу данных покупателей **на сервере в
России** и выполнить требование о локализации персональных данных
(ч. 5 ст. 18 152-ФЗ).

Сайт остаётся статикой (GitHub Pages) и обращается к PocketBase напрямую из
браузера.

## 1. Поднять PocketBase на российском хостинге

1. Возьмите VPS в РФ (Timeweb Cloud, Selectel, VK Cloud), Linux.
2. Скачайте бинарник PocketBase под архитектуру сервера с
   https://github.com/pocketbase/pocketbase/releases (версия 0.28+).
3. Запустите за reverse-proxy (Caddy/nginx) с TLS на поддомене, напр.
   `api.bloomnook.ru`. Caddy сам выпустит сертификат:
   ```
   api.bloomnook.ru {
     reverse_proxy 127.0.0.1:8090
   }
   ```
   PocketBase: `./pocketbase serve --http=127.0.0.1:8090` (через systemd-юнит).
4. Создайте суперюзера:
   `./pocketbase superuser upsert ВАШ_EMAIL ВАШ_ПАРОЛЬ`
5. **CORS:** в дашборде PocketBase (`/_/` → Settings → Application) добавьте
   origin сайта `https://bloomnook.ru` в список разрешённых.
6. **Бэкапы:** Settings → Backups → включите авто-бэкапы и (желательно) выгрузку
   в российский S3 (Selectel/VK), чтобы и копии оставались в РФ.

## 2. Создать коллекции и правила доступа

Автоматически — скриптом из репозитория (требует доступ к серверу):

```
PB_URL=https://api.bloomnook.ru \
PB_SUPERUSER_EMAIL=ВАШ_EMAIL \
PB_SUPERUSER_PASSWORD=ВАШ_ПАРОЛЬ \
node scripts/pb-setup.mjs
```

Скрипт создаёт коллекции и API-правила:

| Коллекция | Доступ |
|---|---|
| `users` (есть по умолчанию) | публичная регистрация, пользователь видит себя |
| `products` | чтение — всем; запись — только админам |
| `media` (фото товаров) | чтение — всем; запись — только админам |
| `orders` | пользователь видит/создаёт только свои заказы; правка — суперюзер/хук оплаты |
| `admins` | пользователь видит только свою запись; запись — только суперюзер |
| `content` (тексты разделов: отзывы, акция, FAQ) | чтение — всем; запись — только админам |

Админ = запись в коллекции `admins` с relation `user` на пользователя.
**Назначить админа:** в дашборде PocketBase создайте запись в `admins`, выбрав
нужного пользователя.

## 3. Наполнить каталог

- **Демо-товары:** `PB_URL=… PB_SUPERUSER_EMAIL=… PB_SUPERUSER_PASSWORD=… node scripts/seed.mjs`

## 3.1. Вход через Яндекс ID (опционально)

На сайте есть кнопка «Войти с Яндекс ID». Чтобы она заработала, нужно один раз
настроить OAuth2-провайдер — секрет хранится на сервере PocketBase, в браузер не
попадает.

1. **Зарегистрировать приложение** на <https://oauth.yandex.ru> → «Создать приложение»:
   - Платформа — **Веб-сервисы**.
   - **Redirect URI** (сайт использует redirect-режим, поэтому адрес ведёт на САЙТ,
     а не на PocketBase; со слешем в конце, как требует `trailingSlash`):
     - прод: `https://bloomnook.ru/auth/callback/`
     - локально (для разработки): `http://localhost:3001/auth/callback/`
   - Доступы (scopes): **«Доступ к адресу электронной почты»** (`login:email`) и
     «Доступ к имени, фамилии и полу» (`login:info`). Email обязателен — без него
     PocketBase не создаст запись в коллекции `users`. `login:info` даёт имя и
     аватар — сайт сохраняет их в поля `name`/`avatarUrl` пользователя и показывает
     в шапке и личном кабинете (поля создаёт `scripts/pb-setup.mjs`).
   - Сохранить **ClientID** и **Client secret**.
2. **Включить провайдер в PocketBase** (в версии 0.23+ OAuth2 настраивается внутри
   auth-коллекции, а НЕ в глобальных Settings): дашборд `https://api.bloomnook.ru/_/` →
   **Collections** → коллекция **`users`** → шестерёнка (Edit collection) →
   вкладка **Options** → секция **OAuth2** → включить → **+ Add provider** →
   **Yandex** → вставить Client ID и Client secret → **Save**.
3. Там же убедиться, что у `users` задано `createRule`, позволяющее регистрацию новых
   пользователей (иначе первый вход через Яндекс не создаст запись).

Обмен кода на токен делает PocketBase (client_secret хранится на сервере); сайт лишь
передаёт ему код со страницы `/auth/callback`. Если меняете домен сайта — обновите
Redirect URI в кабинете Яндекса.

## 3.2. Приём оплат через ЮKassa

Онлайн-оплата работает через серверный **JS-хук PocketBase** — секретный ключ
ЮKassa хранится на сервере (в РФ) и в браузер не попадает. Хук создаёт платежи и
принимает webhook о смене статуса.

1. **Загрузить хук на сервер** в каталог `pb_hooks` (PocketBase сам его подхватит).
   Хук — это ДВА файла: `yookassa.pb.js` (роуты) и `yookassa_lib.js` (логика; вынесена
   отдельно, т.к. обработчики routerAdd в PocketBase не видят функции верхнего уровня
   файла-хука и подключают модуль через `require`). Копируйте оба:
   ```
   scp deploy/pb_hooks/*.js root@<IP>:/opt/pocketbase/pb_hooks/
   # ВАЖНО: выдать права на ВСЮ папку pb_hooks. Иначе PocketBase не прочитает хук
   # (panic: open ... permission denied) и будет крэшиться при старте, уронив сайт.
   ssh root@<IP> 'chown -R pocketbase:pocketbase /opt/pocketbase/pb_hooks && chmod 755 /opt/pocketbase/pb_hooks && chmod 644 /opt/pocketbase/pb_hooks/*.js'
   ```
2. **Задать секреты** в `/opt/pocketbase/pb.env` (файл-шаблон создаёт `install.sh`,
   права 600). Значения — из личного кабинета ЮKassa (Интеграция → Ключи API):
   ```
   YOOKASSA_SHOP_ID=1387923            # числовой идентификатор магазина
   YOOKASSA_SECRET_KEY=live_…          # секретный ключ (боевой или test_… для теста)
   YOOKASSA_RECEIPTS_ENABLED=1         # 1 — добавлять фискальный чек (54-ФЗ)
   YOOKASSA_TAX_SYSTEM_CODE=           # ПУСТО для АУСН (см. ниже); иначе код 1-6
   YOOKASSA_VAT_CODE=1                 # ставка НДС позиций (1 — без НДС)
   SITE_URL=https://bloomnook.ru       # база для return_url (в redirect-режиме)
   ```
   Затем `systemctl restart pocketbase`. Обновить поля заказа под оплату:
   `PB_URL=… PB_SUPERUSER_EMAIL=… PB_SUPERUSER_PASSWORD=… node scripts/pb-setup.mjs`
   (идемпотентно добавит `paymentId`/`paidAt` в `orders`).
3. **Настроить HTTP-уведомления** в кабинете ЮKassa (Интеграция → HTTP-уведомления):
   URL `https://api.bloomnook.ru/api/yookassa/webhook`, события `payment.succeeded` и
   `payment.canceled`. Хук проверяет источник по официальным IP ЮKassa и
   перепроверяет статус через `GET /v3/payments/{id}` (телу уведомления не доверяет).

**Система налогообложения магазина — АУСН 8% («доходы»).** У АУСН нет отдельного кода
в фискальном формате (тег 1055 знает только ОСН/УСН/ЕСХН/ПСН), поэтому
`YOOKASSA_TAX_SYSTEM_CODE` оставляем **пустым** — при одной системе ЮKassa берёт её из
настроек кабинета/подключённой кассы. АУСН не платит НДС, поэтому `YOOKASSA_VAT_CODE=1`
(без НДС). Если позже появится несколько систем налогообложения — задайте код явно
(`tax_system_code`: 1 ОСН, 2 УСН доходы, 3 УСН доходы-расходы, 6 ПСН).
Чтобы отправлять платежи **без чека**, поставьте `YOOKASSA_RECEIPTS_ENABLED=0`.
Для перехода со встроенного виджета на **redirect** — в `yookassa.pb.js` поменяйте
`confirmation: { type: "embedded" }` на `{ type: "redirect", return_url: … }`.

**Безопасность:** секретный ключ, переданный где-либо открытым текстом (в задаче,
чате), считайте скомпрометированным — сгенерируйте новый в кабинете ЮKassa и
пропишите его в `pb.env`.

## 4. Переключить сайт

1. В `.env.local` (и в окружении сборки GitHub Pages, если задаёте там) укажите
   `NEXT_PUBLIC_PB_URL=https://api.bloomnook.ru`.
2. `npm run build` и задеплойте как обычно.

## Локальная разработка

```
# терминал 1 — бэкенд
./pocketbase serve            # http://127.0.0.1:8090, дашборд на /_/
node scripts/pb-setup.mjs     # создать коллекции (PB_SUPERUSER_* в env)

# терминал 2 — сайт
npm run dev                   # NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090 по умолчанию
```
