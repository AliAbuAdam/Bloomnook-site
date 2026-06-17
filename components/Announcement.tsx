import { Phone, Telegram, Yandex } from "./icons";

const socialCircle: React.CSSProperties = {
  width: 26,
  height: 26,
  border: "1px solid rgba(255,255,255,.35)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  textDecoration: "none",
};

export default function Announcement() {
  return (
    <div style={{ background: "var(--green)", color: "#fff" }}>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "9px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 7, opacity: 0.92 }}>
          <Phone /> +7 495 000-00-00
        </span>
        <span style={{ opacity: 0.95 }}>Бесплатная доставка через Ozon при заказе от 2 000 ₽</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="#" style={{ ...socialCircle, fontSize: 10, fontWeight: 700 }}>
            VK
          </a>
          <a href="#" style={socialCircle}>
            <Telegram />
          </a>
          <a href="#" style={socialCircle}>
            <Yandex size={15} />
          </a>
        </span>
      </div>
    </div>
  );
}
