import { Phone, Telegram, Yandex } from "./icons";
import { CONTACT } from "@/lib/data";

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
        className="bn-pad"
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
        <a href={CONTACT.phoneHref} className="bn-ann-phone" style={{ display: "flex", alignItems: "center", gap: 7, opacity: 0.92, color: "inherit", textDecoration: "none" }}>
          <Phone /> <span>{CONTACT.phone}</span>
        </a>
        <span className="bn-ann-tagline" style={{ opacity: 0.95 }}>Бесплатная доставка через Ozon по всей России</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="#" style={{ ...socialCircle, fontSize: 10, fontWeight: 700 }}>
            VK
          </a>
          <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" aria-label="Чат в Telegram" style={socialCircle}>
            <Telegram />
          </a>
          <a href={CONTACT.yandex} target="_blank" rel="noopener noreferrer" aria-label="Чат в Яндексе" style={socialCircle}>
            <Yandex size={15} />
          </a>
        </span>
      </div>
    </div>
  );
}
