"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "bn-cookie-consent";

/**
 * Плашка-уведомление о cookie. Появляется при первом визите и скрывается после
 * нажатия «Принимаю»; выбор сохраняется в localStorage, чтобы не показываться снова.
 */
export default function CookieBanner() {
  // Стартуем скрытыми, решение о показе принимаем после монтирования —
  // иначе при гидрации статичного экспорта плашка мелькнёт у тех, кто уже согласился.
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* приватный режим — просто скрываем на эту сессию */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Уведомление об использовании файлов cookie"
      className="bn-pad"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 80,
        background: "#fff",
        borderTop: "1px solid var(--line)",
        boxShadow: "0 -12px 40px -24px rgba(24,53,18,.5)",
        padding: "18px 32px",
      }}
    >
      <div
        className="bn-cookie-inner"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--muted)", flex: "1 1 320px", maxWidth: 880 }}>
          Мы используем файлы cookie для обеспечения корректной работы сайта, авторизации в личном кабинете и
          улучшения вашего пользовательского опыта. Оставаясь на сайте, вы соглашаетесь с нашей{" "}
          <Link
            href="/privacy"
            style={{ color: "var(--green-3)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}
          >
            Политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="bn-hover-fade"
          style={{
            flex: "none",
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            padding: "12px 28px",
            borderRadius: 999,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Принимаю
        </button>
      </div>
    </div>
  );
}
