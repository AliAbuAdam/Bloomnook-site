"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { pb, USERS, type BloomUser } from "@/lib/pb";

interface AuthContextValue {
  user: BloomUser | null;
  /** true, пока не определено начальное состояние сессии. */
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  /** Вход/регистрация через Яндекс ID (OAuth2-провайдер PocketBase). */
  loginWithYandex: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Перевод ошибок PocketBase в человекочитаемые русские сообщения.
 * PocketBase кидает `ClientResponseError` с полями `status` и `response.data`
 * (ошибки валидации по полям). Незнакомое отдаём общим текстом.
 */
export function authErrorMessage(err: unknown): string {
  const e = err as { status?: number; response?: { data?: Record<string, { code?: string }> } };
  const data = e?.response?.data ?? {};

  if (data.email?.code === "validation_not_unique") return "Этот email уже зарегистрирован";
  if (data.email) return "Некорректный email";
  if (data.password) return "Пароль слишком простой (минимум 8 символов)";
  if (data.oldPassword) return "Неверный текущий пароль";

  switch (e?.status) {
    case 400:
      return "Неверный email или пароль";
    case 401:
    case 403:
      return "Для этого действия войдите в аккаунт заново";
    case 429:
      return "Слишком много попыток. Попробуйте позже";
    case 0:
      return "Нет связи с сервером. Проверьте интернет";
    default:
      return "Что-то пошло не так. Попробуйте ещё раз";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BloomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Начальное состояние из персистентного authStore (localStorage).
    setUser((pb.authStore.record as BloomUser) ?? null);
    setLoading(false);
    // Подписка на изменения сессии (вход/выход/обновление токена).
    return pb.authStore.onChange((_token, record) => {
      setUser((record as BloomUser) ?? null);
    });
  }, []);

  async function register(email: string, password: string) {
    const e = email.trim();
    await pb.collection(USERS).create({ email: e, password, passwordConfirm: password });
    await pb.collection(USERS).authWithPassword(e, password);
  }

  async function login(email: string, password: string) {
    await pb.collection(USERS).authWithPassword(email.trim(), password);
  }

  /**
   * Вход через Яндекс ID. Открывает popup Яндекса; PocketBase сам обменивает
   * код на токен (client_secret хранится на сервере), создаёт/находит запись в
   * `users` и кладёт сессию в authStore. Подписка onChange выше обновит `user`.
   */
  async function loginWithYandex() {
    await pb.collection(USERS).authWithOAuth2({ provider: "yandex" });
  }

  async function logout() {
    pb.authStore.clear();
  }

  async function resetPassword(email: string) {
    await pb.collection(USERS).requestPasswordReset(email.trim());
  }

  /**
   * Смена пароля. PocketBase требует текущий пароль (`oldPassword`) и
   * инвалидирует токен после смены, поэтому повторно авторизуемся новым паролем.
   */
  async function changePassword(currentPassword: string, newPassword: string) {
    const current = pb.authStore.record;
    if (!current?.id || !current.email) {
      throw new Error("Нет активной сессии");
    }
    await pb.collection(USERS).update(current.id, {
      oldPassword: currentPassword,
      password: newPassword,
      passwordConfirm: newPassword,
    });
    await pb.collection(USERS).authWithPassword(current.email as string, newPassword);
  }

  const value: AuthContextValue = {
    user,
    loading,
    register,
    login,
    loginWithYandex,
    logout,
    resetPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth должен использоваться внутри <AuthProvider>");
  }
  return ctx;
}
