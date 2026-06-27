# Боевое развёртывание PocketBase (РФ)

Финальная последовательность, чтобы перевести сайт на PocketBase с хранением
данных в России. Шаги, где нужен ваш сервер/домен, помечены 👤.

## 1. 👤 Сервер
Возьмите VPS в РФ (Timeweb Cloud / Selectel / VK Cloud), ОС Ubuntu 22.04+.
Понадобятся root-доступ по SSH и публичный IP.

## 2. 👤 DNS
В управлении доменом `bloomnook.ru` добавьте A-запись:
```
api.bloomnook.ru.   A   <IP вашего VPS>
```
Подождите, пока запись разойдётся (`ping api.bloomnook.ru` показывает ваш IP).

## 3. Установка PocketBase (одна команда на сервере)
Скопируйте `deploy/install.sh` на сервер и запустите под root:
```
scp deploy/install.sh root@<IP>:/root/
ssh root@<IP> 'API_DOMAIN=api.bloomnook.ru bash /root/install.sh'
```
Скрипт ставит PocketBase как systemd-сервис с авто-HTTPS (Let's Encrypt).
Через ~минуту `https://api.bloomnook.ru/api/health` отдаёт `API is healthy`.

## 4. 👤 Суперюзер
```
ssh root@<IP>
sudo -u pocketbase /opt/pocketbase/pocketbase superuser upsert ВАШ_EMAIL ВАШ_ПАРОЛЬ --dir=/opt/pocketbase/pb_data
systemctl restart pocketbase
```
Дашборд: `https://api.bloomnook.ru/_/`

## 5. Коллекции и правила (с рабочей машины)
```
PB_URL=https://api.bloomnook.ru \
PB_SUPERUSER_EMAIL=ВАШ_EMAIL PB_SUPERUSER_PASSWORD=ВАШ_ПАРОЛЬ \
node scripts/pb-setup.mjs
```

## 6. Каталог
- Демо-товары: `… node scripts/seed.mjs`

## 7. Назначить себя админом сайта
В дашборде PocketBase: коллекция `users` → зарегистрируйтесь на сайте (или
создайте запись), затем коллекция `admins` → New record → выберите своего
пользователя. Теперь `/admin` на сайте откроется под этим аккаунтом.

## 8. Прод-сборка сайта
В GitHub: Settings → Secrets and variables → Actions → **Variables** →
добавьте `NEXT_PUBLIC_PB_URL = https://api.bloomnook.ru`.
Запустите деплой (push в `main` или вкладка Actions → Run workflow).

## 9. Проверка
Откройте сайт: регистрация, вход, добавление в корзину, оформление заказа,
вход в `/admin` и редактирование товара. В дашборде PocketBase появляются
записи в `users`, `orders`, `products`.

## 10. Бэкапы (важно для РФ-хранения)
Дашборд → Settings → Backups → включите авто-бэкапы и выгрузку в российский
S3 (Selectel/VK), чтобы и копии оставались в РФ.
