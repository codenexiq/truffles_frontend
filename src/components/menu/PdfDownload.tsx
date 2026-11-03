"use client";

import { useEffect, useState } from "react";
import { Download, FileClock } from "lucide-react";
import { cn } from "@/utils";

/**
 * Put the menu PDF at  frontend/public/menu/truffles-menu.pdf
 * The button checks for it in the browser, so it switches on by itself, with
 * no code change or rebuild: before the file exists it shows "PDF coming soon".
 */
export const MENU_PDF_PATH = "/menu/truffles-menu.pdf";

type State = "checking" | "ready" | "missing";

export function PdfDownload({ className }: { className?: string }) {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let cancelled = false;
    fetch(MENU_PDF_PATH, { method: "HEAD", cache: "no-store" })
      .then((r) => {
        const isPdf = (r.headers.get("content-type") ?? "").includes("pdf");
        if (!cancelled) setState(r.ok && isPdf ? "ready" : "missing");
      })
      .catch(() => !cancelled && setState("missing"));
    return () => {
      cancelled = true;
    };
  }, []);

  const base =
    "inline-flex items-center gap-2 rounded-sm px-7 py-4 text-sm uppercase tracking-[0.2em] transition";

  if (state === "ready") {
    return (
      <a
        href={MENU_PDF_PATH}
        download="Truffles-Menu.pdf"
        className={cn(
          base,
          "bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] font-semibold text-[#0a0a0c] shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:brightness-110",
          className
        )}
      >
        <Download className="h-4 w-4" />
        Download Menu (PDF)
      </a>
    );
  }

  return (
    <span
      role="status"
      className={cn(base, "cursor-default border border-white/20 bg-white/5 text-zinc-300 backdrop-blur-sm", className)}
    >
      <FileClock className="h-4 w-4" />
      {state === "checking" ? "Menu PDF" : "PDF menu coming soon"}
    </span>
  );
}
