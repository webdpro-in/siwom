"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const key = "siwom-theme";
function subscribe(onChange: () => void) {
  window.addEventListener("siwom-theme-change", onChange);
  return () => window.removeEventListener("siwom-theme-change", onChange);
}
function snapshot() { return document.documentElement.dataset.theme ?? "dark"; }
function apply(theme: string) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event("siwom-theme-change"));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "dark");

  useEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(key); } catch { /* Storage may be disabled. */ }
      apply(saved === "light" || saved === "dark" ? saved : system.matches ? "dark" : "light");
    };
    system.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    sync();
    return () => {
      system.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border-strong text-text transition-colors hover:bg-surface-2"
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        try { localStorage.setItem(key, next); } catch { /* Still works for this visit. */ }
        apply(next);
      }}
    >
      <Sun aria-hidden className="theme-sun size-4.5" strokeWidth={1.5} />
      <Moon aria-hidden className="theme-moon size-4.5" strokeWidth={1.5} />
    </button>
  );
}
