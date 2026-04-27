"use client";

/**
 * Tiny typed wrapper around localStorage so every page can persist
 * demo state without sprinkling try/catch everywhere.
 *
 * Keys are namespaced under `aegis.*` so we never collide with other
 * apps on the same origin.
 */

const PREFIX = "aegis.";

export function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota or private mode — silently ignore */
  }
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

/** Trigger a real CSV file download from a 2D array. */
export function downloadCsv(filename: string, rows: (string | number | null | undefined)[][]) {
  const escape = (v: string | number | null | undefined) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csv = rows.map((r) => r.map(escape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Generate a realistic-looking API key for demo use only. */
export function generateApiKey(prefix: "live" | "test" = "live"): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let body = "";
  for (let i = 0; i < 40; i++) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `sk_${prefix}_${body}`;
}

/** Short id for ad-hoc records (models, policies, keys). */
export function shortId(prefix: string): string {
  const t = Date.now().toString(36).slice(-5);
  const r = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${t}${r}`;
}
