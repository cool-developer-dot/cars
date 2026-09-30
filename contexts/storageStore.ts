"use client";

import { useSyncExternalStore } from "react";

/**
 * A JSON value in localStorage / sessionStorage as an external store, for
 * useSyncExternalStore: the server (and hydration pass) sees `null`, the
 * client sees the saved value, and every tab stays in step.
 */
export function createStorageStore<T>(key: string, kind: "local" | "session") {
  const listeners = new Set<() => void>();
  let cacheRaw: string | null | undefined;
  let cacheValue: T | null = null;
  // Set when a write fails (quota, blocked): memory becomes the source of truth
  let memoryOnly = false;

  const storage = () => (kind === "local" ? window.localStorage : window.sessionStorage);

  const read = (): T | null => {
    if (memoryOnly) return cacheValue;
    let raw: string | null = null;
    try {
      raw = storage().getItem(key);
    } catch {
      // Storage blocked: serve whatever this page view has set
      return cacheValue;
    }
    // Same string, same object — keeps the snapshot referentially stable
    if (raw !== cacheRaw) {
      cacheRaw = raw;
      try {
        cacheValue = raw ? (JSON.parse(raw) as T) : null;
      } catch {
        cacheValue = null;
      }
    }
    return cacheValue;
  };

  const emit = () => listeners.forEach((l) => l());

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const set = (value: T | null) => {
    try {
      if (value == null) storage().removeItem(key);
      else storage().setItem(key, JSON.stringify(value));
      memoryOnly = false;
    } catch {
      // Private mode / quota: keep the value for this page view at least
      memoryOnly = true;
      cacheValue = value;
    }
    emit();
  };

  const useValue = () => useSyncExternalStore(subscribe, read, () => null);

  return { get: read, set, useValue };
}

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true once running in the browser */
export const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
