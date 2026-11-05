"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener("arise-theme-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("arise-theme-change", onChange);
  };
};

const getTheme = () => {
  const saved = window.localStorage.getItem("arise-theme");
  return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getTheme, () => false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("arise-theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("arise-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] transition hover:border-[#FF2A6D] hover:text-[#FF2A6D]"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
