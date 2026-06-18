"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import headerLogo from "@/public/header_logo.svg";
import { Search, Heart, Cart, User, Menu, Close } from "./icons";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

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
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  // Выпадающее меню профиля (десктоп) для залогиненного пользователя.
  const [menuOpen, setMenuOpen] = useState(false);
  const userBoxRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Закрывать меню профиля по клику вне его.
  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (userBoxRef.current && !userBoxRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  function handleUserClick() {
    if (user) {
      setMenuOpen((v) => !v);
    } else {
      setAuthOpen(true);
    }
  }

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
  }

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
            <Link key={n.label} href={n.href} className="bn-navlink" style={navLink}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "var(--ink)" }}>
          <span className="bn-hide-xs bn-icon-btn" style={{ display: "flex", cursor: "pointer" }}>
            <Search />
          </span>
          <span className="bn-hide-xs bn-icon-btn" style={{ display: "flex", cursor: "pointer" }}>
            <Heart />
          </span>
          <Link href="/cart" className="bn-icon-btn" style={{ cursor: "pointer", position: "relative", color: "var(--ink)", display: "flex" }}>
            <Cart />
            <span style={cartBadge}>4</span>
          </Link>
          <div ref={userBoxRef} className="bn-hide-xs" style={{ position: "relative", display: "flex" }}>
            <button
              onClick={handleUserClick}
              aria-label={user ? "Меню профиля" : "Войти"}
              aria-haspopup={user ? "menu" : undefined}
              aria-expanded={user ? menuOpen : undefined}
              className="bn-icon-btn"
              style={{ border: "none", background: "none", padding: 0, cursor: "pointer", color: "var(--ink)", display: "flex", alignItems: "center" }}
            >
              <User />
            </button>
            {user && menuOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  minWidth: 200,
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  boxShadow: "0 18px 44px rgba(24,53,18,.16)",
                  padding: 8,
                  zIndex: 55,
                }}
              >
                <div style={{ padding: "8px 12px 10px", fontSize: 12.5, color: "var(--muted)", wordBreak: "break-all", borderBottom: "1px solid var(--line)", marginBottom: 6 }}>
                  {user.email}
                </div>
                <Link
                  href="/account"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="bn-drawer-link"
                  style={{ display: "block", padding: "10px 12px", borderRadius: 8, color: "var(--ink)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}
                >
                  Личный кабинет
                </Link>
                <Link
                  href="/account"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="bn-drawer-link"
                  style={{ display: "block", padding: "10px 12px", borderRadius: 8, color: "var(--ink)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}
                >
                  Мои заказы
                </Link>
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  style={{ width: "100%", textAlign: "left", border: "none", background: "none", padding: "10px 12px", borderRadius: 8, color: "#c0392b", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
          <button
            className="bn-burger bn-icon-btn"
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
              className="bn-drawer-link"
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
        {user ? (
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="bn-drawer-link"
            style={{ ...navLink, marginTop: 18, padding: "12px 0", display: "flex", alignItems: "center", gap: 10 }}
          >
            <User size={19} /> Личный кабинет
          </Link>
        ) : (
          <button
            onClick={() => {
              setOpen(false);
              setAuthOpen(true);
            }}
            className="bn-hover-fade"
            style={{
              marginTop: 18,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              border: "1.5px solid var(--line)",
              background: "#fff",
              color: "var(--ink)",
              padding: "13px 22px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <User size={19} /> Войти
          </button>
        )}
      </aside>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
