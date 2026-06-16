import Link from "next/link";
import Image from "next/image";
import { Search, Heart, Cart, User } from "./icons";

const navLink: React.CSSProperties = {
  cursor: "pointer",
  color: "var(--ink)",
  textDecoration: "none",
};

const navItems = [
  { label: "Главная", href: "/" },
  { label: "Магазин", href: "/shop" },
  { label: "Категории", href: "/#cats" },
  { label: "Посадка", href: "/#steps" },
  { label: "Отзывы", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link href="/" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Image src="/header_logo.svg" alt="Bloom Nook" width={105} height={40} style={{ height: 40, width: "auto" }} priority />
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 30, fontSize: 15, fontWeight: 600 }}>
          {navItems.map((n) => (
            <Link key={n.label} href={n.href} style={navLink}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "var(--ink)" }}>
          <Search style={{ cursor: "pointer" }} />
          <Heart style={{ cursor: "pointer" }} />
          <Link href="/cart" style={{ cursor: "pointer", position: "relative", color: "var(--ink)", display: "flex" }}>
            <Cart />
            <span
              style={{
                position: "absolute",
                top: -7,
                right: -9,
                background: "var(--accent)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                minWidth: 16,
                height: 16,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
              }}
            >
              4
            </span>
          </Link>
          <User style={{ cursor: "pointer" }} />
        </div>
      </div>
    </header>
  );
}
