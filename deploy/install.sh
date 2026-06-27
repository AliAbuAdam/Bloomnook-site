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
mkdir -p "$PB_DIR"

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
echo "  4) Логи:   journalctl -u pocketbase -f"
