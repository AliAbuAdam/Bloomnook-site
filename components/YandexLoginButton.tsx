"use client";

/**
 * Кнопка «Войти с Яндекс ID» в фирменном оформлении (брендбук Яндекс ID):
 * белый фон, фирменный красный логотип-значок слева, текст «Войти с Яндекс ID».
 * Запускает OAuth2-флоу PocketBase (см. loginWithYandex в AuthContext).
 *
 * Цвет логотипа фиксированный (фирменный красный #FC3F1D), поэтому значок задан
 * здесь, а не берётся из icons.tsx (там монохромная иконка под currentColor).
 */

const YANDEX_RED = "#FC3F1D";

/** Фирменный значок Яндекс ID — красный скруглённый квадрат с белой «Я». */
function YandexIdMark({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden focusable="false">
      <rect width="24" height="24" rx="6" fill={YANDEX_RED} />
      <text
        x="12"
        y="17.5"
        textAnchor="middle"
        fontSize="16"
        fontWeight={800}
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#fff"
      >
        Я
      </text>
    </svg>
  );
}

export default function YandexLoginButton({
  onClick,
  disabled = false,
  busy = false,
}: {
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        border: "1.5px solid var(--line)",
        background: "#fff",
        color: "#21201f",
        fontWeight: 700,
        fontSize: 14,
        fontFamily: "inherit",
        padding: 13,
        borderRadius: 999,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <YandexIdMark />
      {busy ? "Подождите…" : "Войти с Яндекс ID"}
    </button>
  );
}
