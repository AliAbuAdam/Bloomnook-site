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
| `orders` | пользователь видит/создаёт только свои заказы; правка — суперюзер |
| `admins` | пользователь видит только свою запись; запись — только суперюзер |

Админ = запись в коллекции `admins` с relation `user` на пользователя.
**Назначить админа:** в дашборде PocketBase создайте запись в `admins`, выбрав
нужного пользователя.

## 3. Наполнить каталог

- **Демо-товары:** `PB_URL=… PB_SUPERUSER_EMAIL=… PB_SUPERUSER_PASSWORD=… node scripts/seed.mjs`

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
