"use client";

import { useEffect, useState } from "react";
import { applyTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-md border border-border px-2 py-1 font-mono text-xs text-text-subtle transition-colors hover:text-accent-hover"
    >
      {theme === "dark" ? "☾ dark" : "☀ light"}
    </button>
  );
}
