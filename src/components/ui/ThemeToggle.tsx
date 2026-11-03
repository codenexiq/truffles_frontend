"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/utils";

const STORAGE_KEY = "theme";

/**
 * Light / dark switch.
 *
 * The initial theme is set before first paint by the inline script in
 * `app/layout.tsx` (saved choice, otherwise the OS preference). This button
 * only flips it. Both icons are always rendered and CSS shows the right one
 * from `<html data-theme>`, so there is no hydration mismatch and no flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";

    // Cross-fade colours for a moment instead of snapping.
    root.classList.add("theme-fade");
    root.setAttribute("data-theme", next);
    window.setTimeout(() => root.classList.remove("theme-fade"), 500);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode / blocked storage: theme still switches for this visit */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={cn(
        "theme-toggle relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-black/30 text-gold backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_18px_rgba(212,175,55,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer",
        className
      )}
    >
      <Sun className="theme-icon-sun h-[18px] w-[18px]" />
      <Moon className="theme-icon-moon h-[18px] w-[18px]" />
    </button>
  );
}
