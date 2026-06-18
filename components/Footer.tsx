import Link from "next/link";
import Image from "next/image";
import footerLogo from "@/public/footer_logo.svg";
import { Telegram, Yandex } from "./icons";

const social: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: "rgba(255,255,255,.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  textDecoration: "none",
};

const colLink: React.CSSProperties = { cursor: "pointer", color: "#fff", textDecoration: "none" };
const colTitle: React.CSSProperties = { fontSize: 15, fontWeight: 800, margin: "0 0 16px" };
const colList: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 11, fontSize: 14 };

export default function Footer() {
  return (
    <footer style={{ background: "var(--green)", color: "#fff" }}>
      <div className="bn-pad" style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px 28px" }}>
        <div className="bn-footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1.2fr", gap: 40 }}>
          <div>
            <Image src={footerLogo} alt="Bloom Nook" width={116} height={44} style={{ height: 44, width: "auto", marginBottom: 18 }} />
            <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.8, margin: "0 0 22px", maxWidth: 300 }}>
              Отборные луковицы цветов с доставкой по всей России через Ozon. Сажайте сейчас — цветите весной.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="#" className="bn-social" style={{ ...social, fontSize: 12, fontWeight: 700 }}>
                VK
              </a>
              <a href="#" className="bn-social" style={social}>
                <Telegram size={17} />
              </a>
              <a href="#" className="bn-social" style={social}>
                <Yandex size={19} />
              </a>
            </div>
          </div>
          <div>
            <h4 style={colTitle}>Магазин</h4>
            <div style={colList}>
              <Link href="/shop" className="bn-foot-link" style={colLink}>
                Все товары
              </Link>
              <Link href="/#cats" className="bn-foot-link" style={colLink}>
                Категории
              </Link>
              <Link href="/shop" className="bn-foot-link" style={colLink}>
                Хиты сезона
              </Link>
              <Link href="/shop" className="bn-foot-link" style={colLink}>
                Акции
              </Link>
            </div>
          </div>
          <div>
            <h4 style={colTitle}>Покупателю</h4>
            <div style={colList}>
              <Link href="/#steps" className="bn-foot-link" style={colLink}>
                Как заказать
              </Link>
              <a href="#" className="bn-foot-link" style={colLink}>
                Доставка через Ozon
              </a>
              <a href="#" className="bn-foot-link" style={colLink}>
                Гарантия свежести
              </a>
              <Link href="/#faq" className="bn-foot-link" style={colLink}>
                Вопросы и ответы
              </Link>
            </div>
          </div>
          <div>
            <h4 style={colTitle}>Контакты</h4>
            <div style={{ ...colList, opacity: 0.82 }}>
              <span>+7 495 000-00-00</span>
              <span>hello@bloomnook.ru</span>
              <span>Россия, доставка по всей стране</span>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,.14)", margin: "40px 0 22px" }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 13,
            opacity: 0.7,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span>© 2026 Bloom Nook. Все права защищены.</span>
          <span style={{ display: "flex", gap: 22 }}>
            <a href="#" className="bn-foot-link" style={colLink}>
              Политика конфиденциальности
            </a>
            <a href="#" className="bn-foot-link" style={colLink}>
              Оферта
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
