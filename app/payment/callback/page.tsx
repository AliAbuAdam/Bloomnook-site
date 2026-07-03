"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Close, Lock } from "@/components/icons";
import { pb, ORDERS } from "@/lib/pb";
import { useCart } from "@/contexts/CartContext";

// Статус, к которому пришли после опроса заказа.
type Phase = "checking" | "success" | "failed" | "pending" | "error";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 90000;

/**
 * Страница возврата после оплаты (return_url виджета/redirect ЮKassa). Забирает
 * id заказа из URL и опрашивает его статус в PocketBase, пока серверный
 * webhook-хук не проставит «Оплачен»/«Оплата не прошла». Итог оплаты
 * авторитетно определяет сервер (webhook + перепроверка через API ЮKassa),
 * поэтому здесь мы только отражаем актуальный статус заказа.
 */
export default function PaymentCallbackPage() {
  const { clear } = useCart();
  const [phase, setPhase] = useState<Phase>("checking");
  const [orderId, setOrderId] = useState<string>("");
  // Корзину чистим один раз при первом успехе.
  const clearedRef = useRef(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("order") || "";
    setOrderId(id);
    if (!id) {
      setPhase("error");
      return;
    }

    let stopped = false;
    const startedAt = Date.now();

    async function poll() {
      if (stopped) return;
      try {
        const rec = await pb.collection(ORDERS).getOne(id);
        const status = typeof rec.status === "string" ? rec.status : "";
        if (status === "Оплачен") {
          if (!clearedRef.current) {
            clearedRef.current = true;
            clear();
          }
          setPhase("success");
          return;
        }
        if (status === "Оплата не прошла") {
          setPhase("failed");
          return;
        }
      } catch {
        // Заказ пока недоступен (не тот пользователь / сеть) — не прерываемся,
        // webhook мог ещё не отработать; продолжаем опрос до таймаута.
      }
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        setPhase("pending");
        return;
      }
      window.setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      stopped = true;
    };
  }, [clear]);

  return (
    <main className="bn-pad" style={{ maxWidth: 640, margin: "0 auto", padding: "80px 32px 96px", textAlign: "center" }}>
      {phase === "checking" && (
        <>
          <Badge tone="wait">
            <Lock size={28} strokeWidth={2} />
          </Badge>
          <Title>Проверяем оплату…</Title>
          <Text>Это займёт несколько секунд. Не закрывайте страницу.</Text>
        </>
      )}

      {phase === "success" && (
        <>
          <Badge tone="ok">
            <Check size={30} strokeWidth={2.4} />
          </Badge>
          <Title>Оплата прошла!</Title>
          <Text>
            Заказ <b style={{ color: "var(--ink)" }}>#{orderId.slice(0, 8).toUpperCase()}</b> оплачен. Мы свяжемся с вами
            для подтверждения и уточнения доставки.
          </Text>
          <Actions>
            <Primary href="/account">Мои заказы</Primary>
            <Secondary href="/shop">Продолжить покупки</Secondary>
          </Actions>
        </>
      )}

      {phase === "failed" && (
        <>
          <Badge tone="err">
            <Close size={26} />
          </Badge>
          <Title>Оплата не прошла</Title>
          <Text>Платёж отклонён или отменён. Вы можете попробовать оплатить заказ ещё раз из корзины.</Text>
          <Actions>
            <Primary href="/cart">Вернуться в корзину</Primary>
            <Secondary href="/account">Мои заказы</Secondary>
          </Actions>
        </>
      )}

      {phase === "pending" && (
        <>
          <Badge tone="wait">
            <Lock size={28} strokeWidth={2} />
          </Badge>
          <Title>Оплата обрабатывается</Title>
          <Text>
            Подтверждение занимает больше обычного. Как только оплата пройдёт, статус заказа
            <b style={{ color: "var(--ink)" }}> #{orderId.slice(0, 8).toUpperCase()}</b> обновится в разделе «Мои заказы».
          </Text>
          <Actions>
            <Primary href="/account">Мои заказы</Primary>
            <Secondary href="/shop">Продолжить покупки</Secondary>
          </Actions>
        </>
      )}

      {phase === "error" && (
        <>
          <Badge tone="err">
            <Close size={26} />
          </Badge>
          <Title>Заказ не указан</Title>
          <Text>Не удалось определить заказ для проверки оплаты. Проверьте статус в разделе «Мои заказы».</Text>
          <Actions>
            <Primary href="/account">Мои заказы</Primary>
            <Secondary href="/shop">В магазин</Secondary>
          </Actions>
        </>
      )}
    </main>
  );
}

function Badge({ tone, children }: { tone: "ok" | "err" | "wait"; children: React.ReactNode }) {
  const colors =
    tone === "ok"
      ? { bg: "var(--sage)", fg: "var(--green)" }
      : tone === "err"
        ? { bg: "#fdecea", fg: "#c0392b" }
        : { bg: "var(--sage-2)", fg: "var(--muted)" };
  return (
    <span
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: colors.bg,
        color: colors.fg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }}
    >
      {children}
    </span>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="bn-h" style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 600, margin: "0 0 10px" }}>
      {children}
    </h1>
  );
}

function Text({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, color: "var(--muted)", margin: "0 0 28px", lineHeight: 1.6 }}>{children}</p>;
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>{children}</div>;
}

function Primary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="bn-hover-fade"
      style={{ background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 24px", borderRadius: 999, textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}

function Secondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{ border: "1.5px solid var(--line)", color: "var(--ink)", fontWeight: 700, fontSize: 15, padding: "13px 24px", borderRadius: 999, textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}
