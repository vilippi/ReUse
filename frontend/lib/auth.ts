// lib/api.ts
import { decode as atob } from "base-64";
import { getToken as _getToken, clearToken as _clearToken } from "@/lib/secure";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.21:8000"; // ajuste p/ seu ambiente

// Prefixo global da API (se seu FastAPI foi incluído com prefix="/api")
const API_PREFIX = (process.env.EXPO_PUBLIC_API_PREFIX ?? "/api").replace(/\/$/, "");

export type LoginResponse = { access_token: string; token_type?: string };

// Helper: junta partes de URL sem gerar // duplicado
function joinUrl(base: string, ...parts: string[]) {
  const b = (base || "").replace(/\/$/, "");
  const p = parts
    .filter(Boolean)
    .map((s) => String(s).replace(/^\/+/, ""))
    .join("/");
  return `${b}/${p}`;
}

// fetch com timeout para evitar travar a UI
async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  ms = 8000
) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

/** Healthcheck rápido do backend (use no AuthGate se quiser). */
export async function pingApi(ms = 2000): Promise<boolean> {
  const base = (API_URL || "").replace(/\/$/, "");
  const candidates = [
    `${base}${API_PREFIX}/health`,
    `${base}/`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetchWithTimeout(url, { method: "GET" }, ms);
      if (res.ok) return true;
    } catch {
      // tenta próximo
    }
  }
  return false;
}

/** Login: POST { email, password } -> { access_token } */
export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  const url = joinUrl(API_URL, API_PREFIX, "auth/login");

  let res: Response;
  try {
    res = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
      8000
    );
  } catch {
    // Erro de rede/timeout/DNS
    throw new Error(
      `Falha de rede ao conectar em ${url}.
Verifique:
• EXPO_PUBLIC_API_URL = ${API_URL}
• EXPO_PUBLIC_API_PREFIX = ${API_PREFIX || "(vazio)"}
• Backend acessível do device? (host/porta/firewall)
• Emulador Android: use 10.0.2.2; dispositivo físico: IP da máquina`
    );
  }

  if (res.status === 401) {
    throw new Error("Credenciais inválidas (401)");
  }
  if (!res.ok) {
    // detalha erro do backend
    let detail = "";
    try {
      const maybeJson = await res.clone().json();
      detail = (maybeJson as any)?.detail || JSON.stringify(maybeJson);
    } catch {}
    const txt = detail || (await res.text().catch(() => "Erro ao autenticar"));
    throw new Error(txt || `Falha no login (${res.status})`);
  }

  return res.json();
}

/* ============================
   JWT helpers (expiração local)
   ============================ */

/** Decodifica o payload (base64url) do JWT sem verificar assinatura */
export function decodeJwtPayload<T = any>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadB64Url = parts[1];
    const payloadB64 = payloadB64Url.replace(/-/g, "+").replace(/_/g, "/");
    // padding
    const pad = payloadB64.length % 4;
    const payloadPadded = pad ? payloadB64 + "=".repeat(4 - pad) : payloadB64;
    const json = atob(payloadPadded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** Retorna true se o JWT estiver expirado (usa claim exp em segundos) */
export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload<{ exp?: number }>(token);
  if (!payload?.exp) return false; // se não houver 'exp', considere não expirado (ou mude p/ true se preferir forçar login)
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

/** Lê o token do SecureStore; se expirado, apaga e retorna null */
export async function getValidToken(): Promise<string | null> {
  const t = await _getToken();
  if (!t) return null;
  if (isJwtExpired(t)) {
    await _clearToken();
    return null;
  }
  return t;
}
