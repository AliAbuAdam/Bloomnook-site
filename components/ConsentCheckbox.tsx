"use client";

import Link from "next/link";

/**
 * Чек-бокс согласия на обработку персональных данных для форм сбора данных
 * (регистрация, оформление заказа). По умолчанию пустой — пользователь обязан
 * проставить его сам (требование Роскомнадзора). Кнопку отправки формы следует
 * блокировать, пока галочка не стоит.
 */
export default function ConsentCheckbox({
  checked,
  onChange,
  id = "pd-consent",
  style,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
  style?: React.CSSProperties;
}) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        cursor: "pointer",
        fontSize: 13,
        lineHeight: 1.5,
        color: "var(--muted)",
        ...style,
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 17, height: 17, marginTop: 1, flex: "none", accentColor: "var(--accent)", cursor: "pointer" }}
      />
      <span>
        Я согласен на обработку моих персональных данных в соответствии с{" "}
        <Link
          href="/privacy"
          target="_blank"
          style={{ color: "var(--green-3)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}
        >
          Политикой конфиденциальности
        </Link>
        .
      </span>
    </label>
  );
}
