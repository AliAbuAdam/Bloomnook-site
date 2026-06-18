"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  /** true, пока не пришёл первый ответ от Firebase о состоянии сессии. */
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Перевод кодов ошибок Firebase Auth в человекочитаемые русские сообщения.
 * Незнакомые коды отдаём общим текстом, чтобы не показывать пользователю
 * технический код.
 */
export function authErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Некорректный email";
    case "auth/user-disabled":
      return "Аккаунт заблокирован";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Неверный email или пароль";
    case "auth/email-already-in-use":
      return "Этот email уже зарегистрирован";
    case "auth/weak-password":
      return "Пароль слишком простой (минимум 6 символов)";
    case "auth/too-many-requests":
      return "Слишком много попыток. Попробуйте позже";
    case "auth/requires-recent-login":
      return "Для смены пароля войдите в аккаунт заново";
    case "auth/network-request-failed":
      return "Нет связи с сервером. Проверьте интернет";
    default:
      return "Что-то пошло не так. Попробуйте ещё раз";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function register(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email.trim());
  }

  /**
   * Смена пароля. Firebase требует «свежий» вход, поэтому сначала
   * переаутентифицируемся текущим паролем, затем меняем на новый.
   */
  async function changePassword(currentPassword: string, newPassword: string) {
    const current = auth.currentUser;
    if (!current || !current.email) {
      throw new Error("Нет активной сессии");
    }
    const credential = EmailAuthProvider.credential(current.email, currentPassword);
    await reauthenticateWithCredential(current, credential);
    await updatePassword(current, newPassword);
  }

  const value: AuthContextValue = {
    user,
    loading,
    register,
    login,
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
