"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pb, USERS, YANDEX_OAUTH_KEY } from "@/lib/pb";
import { authErrorMessage } from "@/contexts/AuthContext";

/**
 * Страница возврата после авторизации в Яндексе (redirect-режим, см.
 * loginWithYandex в AuthContext). Забирает `code`/`state` из URL, сверяет state с
 * сохранённым в localStorage и завершает обмен через `authWithOAuth2Code` —
 * PocketBase меняет код на токен (client_secret на сервере) и кладёт сессию.
 * Затем уводит в личный кабинет.
 */
export default function YandexCallbackPage() {
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const yandexError = params.get("error");
      const yandexErrorDesc = params.get("error_description");

      const raw = localStorage.getItem(YANDEX_OAUTH_KEY);
      localStorage.removeItem(YANDEX_OAUTH_KEY);

      // Яндекс отклонил авторизацию (отказ пользователя или несоответствие прав).
      // Показываем реальный текст, чтобы было видно причину (напр. invalid_scope).
      if (yandexError) {
        setError(
          yandexErrorDesc
            ? `Яндекс отклонил вход: ${yandexErrorDesc} (${yandexError})`
            : `Яндекс отклонил вход: ${yandexError}`,
        );
        return;
      }
      if (!code || !raw) {
        setError("Не удалось завершить вход. Попробуйте ещё раз.");
        return;
      }

      try {
        const saved = JSON.parse(raw) as { state: string; codeVerifier: string; redirectUrl: string };
        if (!state || state !== saved.state) {
          throw new Error("state mismatch");
        }
        await pb.collection(USERS).authWithOAuth2Code("yandex", code, saved.codeVerifier, saved.redirectUrl);
        // Успех — в личный кабинет (replace, чтобы callback не остался в истории).
        window.location.replace("/account/");
      } catch (err) {
        // У Яндекс-аккаунта нет привязанной почты — PocketBase не создаёт запись
        // (email обязателен). Показываем понятный текст вместо «некорректный email».
        const e = err as { response?: { data?: Record<string, { code?: string }> } };
        if (e?.response?.data?.email?.code === "validation_required") {
          setError(
            "У этого Яндекс-аккаунта нет привязанной электронной почты, а она нужна для оформления заказов. " +
              "Войдите под аккаунтом Яндекса с почтой или зарегистрируйтесь по email на сайте.",
          );
        } else {
          setError(authErrorMessage(err));
        }
        console.error("Yandex OAuth callback error:", err);
      }
    })();
  }, []);

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      {error ? (
        <>
          <h1 className="bn-h" style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
            Не удалось войти
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>{error}</p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              padding: "12px 24px",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            На главную
          </Link>
        </>
      ) : (
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Завершаем вход через Яндекс…</p>
      )}
    </main>
  );
}
