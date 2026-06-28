"use client";

import { useEffect, useState } from "react";
import { useAuth, authErrorMessage } from "@/contexts/AuthContext";
import ConsentCheckbox from "./ConsentCheckbox";
import YandexLoginButton from "./YandexLoginButton";
import { Close } from "./icons";

type Mode = "login" | "register" | "reset";

const input: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid var(--line)",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  background: "#fff",
};

const label: React.CSSProperties = { fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" };

const primaryBtn: React.CSSProperties = {
  border: "none",
  background: "var(--accent)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
  padding: 14,
  borderRadius: 999,
  cursor: "pointer",
  width: "100%",
};

const linkBtn: React.CSSProperties = {
  border: "none",
  background: "none",
  color: "var(--green-3)",
  fontWeight: 700,
  fontSize: 13.5,
  cursor: "pointer",
  padding: 0,
  fontFamily: "inherit",
};

/**
 * Пользователь закрыл popup Яндекса, не завершив вход. PocketBase SDK кидает в
 * этом случае обычную ошибку — отличаем её по тексту, чтобы не пугать юзера.
 */
function isPopupClosed(err: unknown): boolean {
  const msg = (err as { message?: string })?.message?.toLowerCase() ?? "";
  return msg.includes("popup") || msg.includes("closed") || msg.includes("cancel");
}

const TITLES: Record<Mode, string> = {
  login: "Вход",
  register: "Регистрация",
  reset: "Восстановление пароля",
};

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, register, resetPassword, loginWithYandex } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [consent, setConsent] = useState(false);
  const [yandexConsent, setYandexConsent] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  // Lock body scroll while the modal is open (как в Header для шторки).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Сбрасываем поля и режим при каждом открытии.
  useEffect(() => {
    if (open) {
      setMode("login");
      setEmail("");
      setPassword("");
      setConfirm("");
      setConsent(false);
      setYandexConsent(false);
      setError("");
      setNotice("");
      setBusy(false);
    }
  }, [open]);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
    setPassword("");
    setConfirm("");
    setConsent(false);
    setYandexConsent(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (mode === "register" && password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    if (mode === "register" && !consent) {
      setError("Подтвердите согласие на обработку персональных данных");
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
        onClose();
      } else if (mode === "register") {
        await register(email, password);
        onClose();
      } else {
        await resetPassword(email);
        setNotice("Письмо для сброса пароля отправлено. Проверьте почту.");
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleYandex() {
    setError("");
    setNotice("");

    if (!yandexConsent) {
      setError("Подтвердите согласие на обработку персональных данных");
      return;
    }

    setBusy(true);
    try {
      await loginWithYandex();
      onClose();
    } catch (err) {
      // Закрытие popup пользователем — не ошибка, ничего не показываем.
      if (isPopupClosed(err)) return;
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="bn-drawer-backdrop open" onClick={onClose} aria-hidden={false} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={TITLES[mode]}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          pointerEvents: "none",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: 400,
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 24px 60px rgba(24,53,18,.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
            <h2 className="bn-h" style={{ fontSize: 26, fontWeight: 600, margin: 0 }}>
              {TITLES[mode]}
            </h2>
            <button
              onClick={onClose}
              aria-label="Закрыть"
              style={{ border: "none", background: "none", padding: 4, cursor: "pointer", color: "var(--muted)", marginTop: 2 }}
            >
              <Close size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Email</label>
              <input
                style={input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoComplete="username"
                required
              />
            </div>

            {mode !== "reset" && (
              <div style={{ marginBottom: 16 }}>
                <label style={label}>Пароль</label>
                <input
                  style={input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                />
              </div>
            )}

            {mode === "register" && (
              <div style={{ marginBottom: 16 }}>
                <label style={label}>Повторите пароль</label>
                <input
                  style={input}
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            {mode === "register" && (
              <div style={{ marginBottom: 16 }}>
                <ConsentCheckbox checked={consent} onChange={setConsent} id="auth-consent" />
              </div>
            )}

            {error && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 16 }}>{error}</div>}
            {notice && <div style={{ color: "var(--green-3)", fontSize: 13, marginBottom: 16 }}>{notice}</div>}

            <button
              type="submit"
              disabled={busy || (mode === "register" && !consent)}
              style={{ ...primaryBtn, opacity: busy || (mode === "register" && !consent) ? 0.6 : 1, cursor: busy || (mode === "register" && !consent) ? "default" : "pointer" }}
            >
              {busy
                ? "Подождите…"
                : mode === "login"
                ? "Войти"
                : mode === "register"
                ? "Зарегистрироваться"
                : "Отправить письмо"}
            </button>
          </form>

          {/* Вход через Яндекс ID — в режимах вход/регистрация (не при сбросе пароля) */}
          {mode !== "reset" && (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "2px 0 16px", color: "var(--muted)", fontSize: 12.5 }}>
                <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
                или
                <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <ConsentCheckbox checked={yandexConsent} onChange={setYandexConsent} id="yandex-consent" />
              </div>
              <YandexLoginButton onClick={handleYandex} disabled={busy || !yandexConsent} busy={busy} />
            </div>
          )}

          {/* Переключение режимов */}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5, color: "var(--muted)" }}>
            {mode === "login" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <span>
                    Нет аккаунта?{" "}
                    <button type="button" style={linkBtn} onClick={() => switchMode("register")}>
                      Зарегистрироваться
                    </button>
                  </span>
                  <button type="button" style={linkBtn} onClick={() => switchMode("reset")}>
                    Забыли пароль?
                  </button>
                </div>
              </>
            )}
            {mode === "register" && (
              <span>
                Уже есть аккаунт?{" "}
                <button type="button" style={linkBtn} onClick={() => switchMode("login")}>
                  Войти
                </button>
              </span>
            )}
            {mode === "reset" && (
              <button type="button" style={linkBtn} onClick={() => switchMode("login")}>
                ← Назад ко входу
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
