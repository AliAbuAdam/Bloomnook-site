#!/usr/bin/env bash
# Разворачивает PocketBase на чистом Ubuntu/Debian VPS (в РФ) как systemd-сервис
# с автоматическим HTTPS (Let's Encrypt). Reverse-proxy не нужен — PocketBase
# сам слушает 80/443 и выпускает сертификат для вашего домена.
#
# Запуск на сервере под root:
#   API_DOMAIN=api.bloomnook.ru bash install.sh
#
# Перед запуском: A-запись API_DOMAIN должна указывать на IP этого сервера,
# а порты 80 и 443 должны быть открыты.
set -euo pipefail

API_DOMAIN="${API_DOMAIN:-api.bloomnook.ru}"
PB_VERSION="${PB_VERSION:-0.28.4}"
PB_DIR=/opt/pocketbase

if [[ $EUID -ne 0 ]]; then echo "Запустите под root (sudo)."; exit 1; fi

case "$(uname -m)" in
  x86_64) ARCH=amd64 ;;
  aarch64|arm64) ARCH=arm64 ;;
  *) echo "Неподдерживаемая архитектура: $(uname -m)"; exit 1 ;;
esac

echo "→ Домен: $API_DOMAIN · PocketBase $PB_VERSION · $ARCH"

apt-get update -qq
apt-get install -y -qq unzip curl >/dev/null

id pocketbase &>/dev/null || useradd --system --home "$PB_DIR" --shell /usr/sbin/nologin pocketbase
mkdir -p "$PB_DIR" "$PB_DIR/pb_hooks"

# Шаблон файла с секретами (переменные окружения для сервиса). Создаём только
# если его ещё нет, чтобы не затирать уже заданные ключи. Права 600 — секреты.
if [[ ! -f "$PB_DIR/pb.env" ]]; then
  cat > "$PB_DIR/pb.env" <<'ENVF'
# Секреты приёма платежей ЮKassa (см. deploy/pb_hooks/yookassa.pb.js).
# Заполните значения и выполните: systemctl restart pocketbase
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
YOOKASSA_RECEIPTS_ENABLED=1
# Код системы налогообложения (1-6). Для АУСН оставьте ПУСТЫМ — валидного кода
# в фискальном формате нет, система берётся из настроек кабинета/кассы.
YOOKASSA_TAX_SYSTEM_CODE=
# Ставка НДС позиций: 1 — без НДС (АУСН/УСН не платят НДС).
YOOKASSA_VAT_CODE=1
SITE_URL=https://bloomnook.ru
ENVF
  echo "→ Создан шаблон секретов $PB_DIR/pb.env — заполните YOOKASSA_* перед приёмом оплат."
fi
chmod 600 "$PB_DIR/pb.env"

echo "→ Скачиваю PocketBase…"
curl -fsSL -o /tmp/pb.zip \
  "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip"
unzip -o /tmp/pb.zip pocketbase -d "$PB_DIR" >/dev/null
chown -R pocketbase:pocketbase "$PB_DIR"

echo "→ Пишу systemd-юнит…"
cat > /etc/systemd/system/pocketbase.service <<UNIT
[Unit]
Description=PocketBase (Bloom Nook)
After=network.target

[Service]
Type=simple
User=pocketbase
Group=pocketbase
LimitNOFILE=4096
# Позволяет несуперпользователю слушать порты 80/443.
AmbientCapabilities=CAP_NET_BIND_SERVICE
# Секреты (ключи ЮKassa и пр.); "-" — не падать, если файла нет.
EnvironmentFile=-$PB_DIR/pb.env
WorkingDirectory=$PB_DIR
ExecStart=$PB_DIR/pocketbase serve --dir=$PB_DIR/pb_data $API_DOMAIN
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

# Открыть порты, если установлен ufw.
if command -v ufw >/dev/null; then ufw allow 80/tcp >/dev/null || true; ufw allow 443/tcp >/dev/null || true; fi

systemctl daemon-reload
systemctl enable --now pocketbase

echo
echo "✓ PocketBase запущен и слушает $API_DOMAIN (HTTPS появится после выпуска сертификата, ~1 мин)."
echo
echo "Дальше:"
echo "  1) Создайте суперюзера (дашборд):"
echo "     sudo -u pocketbase $PB_DIR/pocketbase superuser upsert ВАШ_EMAIL ВАШ_ПАРОЛЬ --dir=$PB_DIR/pb_data"
echo "     systemctl restart pocketbase"
echo "  2) Дашборд: https://$API_DOMAIN/_/"
echo "  3) С рабочей машины создайте коллекции:"
echo "     PB_URL=https://$API_DOMAIN PB_SUPERUSER_EMAIL=… PB_SUPERUSER_PASSWORD=… node scripts/pb-setup.mjs"
echo "  4) Приём оплат ЮKassa:"
echo "     - загрузите хук (ОБА файла):  scp deploy/pb_hooks/*.js root@<IP>:$PB_DIR/pb_hooks/"
echo "       # ВАЖНО: права на всю папку (иначе PocketBase не прочитает хук и упадёт при старте):"
echo "       chown -R pocketbase:pocketbase $PB_DIR/pb_hooks && chmod 755 $PB_DIR/pb_hooks && chmod 644 $PB_DIR/pb_hooks/*.js"
echo "     - впишите ключи в $PB_DIR/pb.env (YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY, …)"
echo "     - systemctl restart pocketbase"
echo "     - в кабинете ЮKassa → Интеграция → HTTP-уведомления укажите URL"
echo "       https://$API_DOMAIN/api/yookassa/webhook (события payment.succeeded, payment.canceled)"
echo "  5) Логи:   journalctl -u pocketbase -f"
