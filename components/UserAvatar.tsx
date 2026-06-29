import { displayName, type BloomUser } from "@/lib/pb";

/**
 * Круглый аватар пользователя: фото из профиля (Яндекс ID), а если его нет —
 * заглушка с первой буквой имени/email на фирменном фоне.
 *
 * Аватары Яндекса лежат на avatars.yandex.net и для статического экспорта
 * рендерятся обычным <img> (без next/image и настройки доменов). referrerPolicy
 * нужен, чтобы CDN Яндекса отдавал картинку при запросе с другого домена.
 */
export default function UserAvatar({ user, size = 32 }: { user: BloomUser | null; size?: number }) {
  if (user?.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block", flex: "none" }}
      />
    );
  }
  const initial = (displayName(user)[0] || "?").toUpperCase();
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--sage)",
        color: "var(--green)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: Math.round(size * 0.44),
        flex: "none",
      }}
    >
      {initial}
    </span>
  );
}
