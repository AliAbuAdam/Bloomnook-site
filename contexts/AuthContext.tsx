"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { pb, USERS, YANDEX_OAUTH_KEY, type BloomUser } from "@/lib/pb";

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
   * Вход через Яндекс ID — redirect-режим (без popup и realtime, надёжно для
   * статического сайта и пользователей с антивирусами/блокировщиками).
   *
   * Запрашиваем у PocketBase authURL + PKCE-параметры, сохраняем их в
   * localStorage и уводим браузер на страницу авторизации Яндекса. После
   * подтверждения Яндекс вернёт на /auth/callback, где обмен завершит
   * `authWithOAuth2Code` (см. app/auth/callback/page.tsx). redirect_uri ведёт на
   * НАШ сайт, поэтому именно его нужно прописать в кабинете Яндекс OAuth.
   */
  async function loginWithYandex() {
    const methods = await pb.collection(USERS).listAuthMethods();
    const provider = methods.oauth2?.providers?.find((p) => p.name === "yandex");
    if (!provider) {
      throw new Error("Провайдер Яндекс не настроен в PocketBase");
    }
    const redirectUrl = `${window.location.origin}/auth/callback/`;
    localStorage.setItem(
      YANDEX_OAUTH_KEY,
      JSON.stringify({ state: provider.state, codeVerifier: provider.codeVerifier, redirectUrl }),
    );
    // PocketBase выдаёт authURL на oauth.yandex.COM, но в России пользователи
    // залогинены на yandex.RU — это разные cookie-домены, поэтому .com-окно не
    // видит сессию и требует повторный вход. Переключаем авторизацию на .ru,
    // чтобы подхватывались уже залогиненные аккаунты (code Яндекса работает на
    // обоих зеркалах, обмен токена PocketBase выполнит как обычно).
    const authURL = provider.authURL.replace("oauth.yandex.com", "oauth.yandex.ru");
    // provider.authURL заканчивается на "redirect_uri=" — дописываем наш адрес.
    // force_confirm=yes: Яндекс всегда показывает экран подтверждения с выбором
    // аккаунта, а не молча логинит текущую сессию браузера (позволяет сменить
    // аккаунт, напр. если у текущего нет привязанной почты).
    window.location.href = authURL + encodeURIComponent(redirectUrl) + "&force_confirm=yes";
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
