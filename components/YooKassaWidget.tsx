"use client";

import { useEffect, useRef } from "react";

// Встроенный платёжный виджет ЮKassa (сценарий confirmation type = embedded).
// Подключает внешний скрипт ЮKassa и рендерит форму оплаты в контейнер. После
// успешной оплаты виджет сам перенаправляет браузер на return_url.
// Документация: https://yookassa.ru/developers/payment-acceptance/integration-scenarios/widget/quick-start

const WIDGET_SRC = "https://yookassa.ru/checkout-widget/v1/checkout-widget.js";
const CONTAINER_ID = "yookassa-payment-form";

/** Минимальная типизация конструктора виджета из внешнего скрипта. */
interface CheckoutWidget {
  render: (id: string) => Promise<void>;
  destroy?: () => void;
}
interface CheckoutWidgetCtor {
  new (opts: {
    confirmation_token: string;
    return_url: string;
    error_callback?: (error: unknown) => void;
  }): CheckoutWidget;
}
declare global {
  interface Window {
    YooMoneyCheckoutWidget?: CheckoutWidgetCtor;
  }
}

let scriptPromise: Promise<void> | null = null;

/** Однократно загрузить скрипт виджета ЮKassa. */
function loadWidgetScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YooMoneyCheckoutWidget) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = WIDGET_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Не удалось загрузить форму оплаты ЮKassa."));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export default function YooKassaWidget({
  token,
  returnUrl,
  onError,
}: {
  token: string;
  returnUrl: string;
  onError?: (message: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<CheckoutWidget | null>(null);
  // onError держим в ref, чтобы не пересоздавать виджет при новом инлайн-колбэке.
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;
    loadWidgetScript()
      .then(() => {
        if (cancelled || !ref.current || !window.YooMoneyCheckoutWidget) return;
        const widget = new window.YooMoneyCheckoutWidget({
          confirmation_token: token,
          return_url: returnUrl,
          error_callback: (err) => onErrorRef.current?.(String(err)),
        });
        widgetRef.current = widget;
        widget.render(CONTAINER_ID).catch((err: unknown) => {
          if (!cancelled) onErrorRef.current?.(String(err));
        });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Ошибка загрузки формы оплаты.";
          onErrorRef.current?.(msg);
        }
      });
    return () => {
      cancelled = true;
      try {
        widgetRef.current?.destroy?.();
      } catch {
        /* виджет уже уничтожен — игнорируем */
      }
      widgetRef.current = null;
    };
  }, [token, returnUrl]);

  return <div id={CONTAINER_ID} ref={ref} />;
}
