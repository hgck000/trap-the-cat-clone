import React from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;

  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
  window.localStorage.setItem("theme", theme);
}

export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>(() => getInitialTheme());

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="px-3 py-1 rounded bg-[var(--surface-2)] border border-[var(--line)] disabled:opacity-50 hover:brightness-95 transition-color"
      aria-label="Toggle dark mode"
    >
      <span>{theme === "dark"}</span>
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
