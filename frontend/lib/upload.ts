// lib/upload.ts
import { API_URL } from "@/lib/auth";
import { getToken } from "@/lib/secure";

const API_PREFIX = (process.env.EXPO_PUBLIC_API_PREFIX ?? "/api").replace(/\/$/, "");

function joinUrl(base: string, ...parts: string[]) {
  const b = (base || "").replace(/\/$/, "");
  const p = parts.filter(Boolean).map((s) => String(s).replace(/^\/+|\/+$/g, "")).join("/");
  return `${b}/${p}`;
}

export async function uploadImages(uris: string[]): Promise<string[]> {
  if (!uris.length) return [];
  const url = joinUrl(API_URL, API_PREFIX, "listings", "upload");  // << aqui!

  const form = new FormData();
  uris.forEach((uri, idx) => {
    const name = uri.split(/[\/\\]/).pop() || `foto_${idx}.jpg`;
    const type = name.toLowerCase().endsWith(".png") ? "image/png"
              : name.toLowerCase().endsWith(".webp") ? "image/webp"
              : "image/jpeg";
    form.append("files", { uri, name, type } as any);
  });

  const token = await getToken();
  const res = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } as any : undefined,
    body: form,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha no upload (${res.status}). ${txt}`);
  }
  return res.json();
}
