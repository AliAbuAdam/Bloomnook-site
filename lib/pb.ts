import PocketBase, { type RecordModel } from "pocketbase";

/**
 * Клиент PocketBase. Базовый URL берётся из NEXT_PUBLIC_PB_URL (российский
 * хостинг, напр. https://api.bloomnook.ru), с локальным дефолтом для разработки.
 * Это значение попадает в клиентский бандл — публичный адрес API, не секрет.
 *
 * Реальная защита данных — в API-правилах коллекций PocketBase (см.
 * SETUP-pocketbase.md), а не в секретности URL.
 */
export const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090");

/**
 * Ключ localStorage для PKCE-параметров входа через Яндекс (state + codeVerifier
 * + redirectUrl), сохраняемых между уходом на oauth.yandex и возвратом на
 * /auth/callback. Используется в AuthContext и на странице callback.
 */
export const YANDEX_OAUTH_KEY = "bn:yandex-oauth";

/** Имена коллекций PocketBase. */
export const USERS = "users";
export const PRODUCTS = "products";
export const ORDERS = "orders";
export const MEDIA = "media";
export const ADMINS = "admins";

/** Пользователь — запись auth-коллекции `users`. */
export interface BloomUser extends RecordModel {
  email: string;
}

/** Текущий авторизованный пользователь (или null). */
export function currentUser(): BloomUser | null {
  return (pb.authStore.record as BloomUser) ?? null;
}
