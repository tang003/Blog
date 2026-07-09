"use client";

import { useEffect } from "react";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved === "dark" || (!saved && prefersDark) ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
  }, []);

  function toggleTheme() {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  return (
    <button
      aria-label="切换深色模式"
      className="rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-500"
      onClick={toggleTheme}
      type="button"
    >
      主题
    </button>
  );
}
