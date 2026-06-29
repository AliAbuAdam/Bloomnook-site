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
  const [detail, setDetail] = useState("");

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
        setError(authErrorMessage(err));
        // Технические детали ответа PocketBase — чтобы видеть точную причину
        // (например, какой именно код валидации по email).
        const e = err as { response?: { data?: unknown }; message?: string };
        const data = e?.response?.data;
        setDetail(data && Object.keys(data).length ? JSON.stringify(data) : e?.message ?? "");
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
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: detail ? 12 : 24 }}>{error}</p>
          {detail && (
            <pre
              style={{
                maxWidth: "100%",
                overflowX: "auto",
                textAlign: "left",
                fontSize: 12,
                lineHeight: 1.5,
                color: "var(--muted)",
                background: "var(--surface, #f4f6f2)",
                border: "1px solid var(--line)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 24,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {detail}
            </pre>
          )}
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
