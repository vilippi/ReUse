// lib/marketplace.ts

import { getToken } from "@/lib/secure";
import { API_URL } from "./auth";

// Se usa prefixo global tipo "/api", coloque aqui (ou importe de lib/api)
const API_PREFIX = (process.env.EXPO_PUBLIC_API_PREFIX ?? "api").replace(/\/$/, "");

function joinUrl(base: string, ...parts: string[]) {
  const b = (base || "").replace(/\/$/, "");
  const p = parts
    .filter(Boolean)
    .map((s) => String(s).replace(/^\/+/, ""))
    .join("/");
  return `${b}/${p}`;
}

// Tipos mínimos (ajuste conforme seu backend)
export type ListingIn = {
  title: string;
  description: string;
  price: number;              // float
  stock: number;              // int
  categoryId: string;         // ObjectId em string
  images: string[];           // URLs (por enquanto, usaremos URI local só p/ teste)
  status: "active" | "inactive" | "sold" | string;
};

export type ListingOut = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  status: string;
};

async function fetchWithAuth(url: string, init: RequestInit = {}) {
  const token = await getToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...init, headers });
  return res;
}

/** POST /api/listings  -> cria anúncio */
export async function createListing(input: ListingIn): Promise<ListingOut> {
  const url = joinUrl(API_URL, API_PREFIX, "listings");

  let res: Response;
  try {
    res = await fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (err) {
    throw new Error(`Falha de rede ao conectar em ${url}`);
  }

  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try {
      const j = await res.clone().json();
      msg = (j as any)?.detail || JSON.stringify(j);
    } catch {
      try { msg = await res.text(); } catch {}
    }
    throw new Error(msg || "Erro ao criar anúncio");
  }

  return res.json();
}
