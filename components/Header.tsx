"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import headerLogo from "@/public/header_logo.svg";
import { Search, Heart, Cart, User, Menu, Close } from "./icons";

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

const cartBadge: React.CSSProperties = {
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
};

export default function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
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
        className="bn-pad"
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
          <Image src={headerLogo} alt="Bloom Nook" width={105} height={40} style={{ height: 40, width: "auto" }} priority />
        </Link>
        <nav className="bn-nav-desktop" style={{ display: "flex", alignItems: "center", gap: 30, fontSize: 15, fontWeight: 600 }}>
          {navItems.map((n) => (
            <Link key={n.label} href={n.href} style={navLink}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "var(--ink)" }}>
          <span className="bn-hide-xs" style={{ display: "flex", cursor: "pointer" }}>
            <Search />
          </span>
          <span className="bn-hide-xs" style={{ display: "flex", cursor: "pointer" }}>
            <Heart />
          </span>
          <Link href="/cart" style={{ cursor: "pointer", position: "relative", color: "var(--ink)", display: "flex" }}>
            <Cart />
            <span style={cartBadge}>4</span>
          </Link>
          <span className="bn-hide-xs" style={{ display: "flex", cursor: "pointer" }}>
            <User />
          </span>
          <button
            className="bn-burger"
            onClick={() => setOpen(true)}
            aria-label="Открыть меню"
            style={{
              border: "none",
              background: "none",
              padding: 0,
              cursor: "pointer",
              color: "var(--ink)",
              alignItems: "center",
            }}
          >
            <Menu />
          </button>
        </div>
      </div>
    </header>

    {/* mobile drawer — kept OUTSIDE <header>: the header's backdrop-filter
        would otherwise act as the containing block for these fixed elements. */}
    <div className={`bn-drawer-backdrop${open ? " open" : ""}`} onClick={() => setOpen(false)} aria-hidden={!open} />
      <aside className={`bn-drawer${open ? " open" : ""}`} aria-hidden={!open}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <Image src={headerLogo} alt="Bloom Nook" width={96} height={36} style={{ height: 36, width: "auto" }} />
          <button
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
            style={{ border: "none", background: "none", padding: 6, cursor: "pointer", color: "var(--ink)" }}
          >
            <Close size={22} />
          </button>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 17, fontWeight: 600 }}>
          {navItems.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={() => setOpen(false)}
              style={{ ...navLink, padding: "12px 0", borderBottom: "1px solid var(--line)" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/cart"
          onClick={() => setOpen(false)}
          className="bn-hover-fade"
          style={{
            marginTop: 22,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "var(--accent)",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          <Cart size={19} /> Корзина
        </Link>
      </aside>
    </>
  );
}
