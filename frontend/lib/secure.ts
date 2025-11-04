// =============================
// lib/secure.ts – armazenar token com segurança (safe para Web)
// =============================
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "reuse_token";

const storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(key, value);
      } catch {}
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      try {
        return localStorage.getItem(key) ?? null;
      } catch {
        return null;
      }
    }
    return SecureStore.getItemAsync(key);
  },
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      try {
        localStorage.removeItem(key);
      } catch {}
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export async function saveToken(token: string): Promise<void> {
  await storage.setItem(TOKEN_KEY, token);
}
export async function getToken(): Promise<string | null> {
  return storage.getItem(TOKEN_KEY);
}
export async function clearToken(): Promise<void> {
  await storage.deleteItem(TOKEN_KEY);
}
