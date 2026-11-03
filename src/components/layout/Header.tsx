"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { NAV_LINKS, SITE_CONFIG } from "@/constants";
import { cn } from "@/utils";
import { Phone, Utensils } from "lucide-react";

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const headerRef = useRef<HTMLElement | null>(null);

  // Publish how much of the top of the screen the header covers, so sticky
  // page bars (e.g. the menu filter bar) can sit just beneath it instead of
  // being hidden behind it when it slides back in.
  useEffect(() => {
    const h = headerRef.current;
    document.documentElement.style.setProperty(
      "--header-h",
      isHidden || !isScrolled || !h ? "0px" : `${h.offsetHeight}px`
    );
  }, [isHidden, isScrolled]);
  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--header-h");
    },
    []
  );

  // Glass bar after 40px; slide away when scrolling down, return on scroll up.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setIsScrolled(latest > 40);
    setIsHidden(latest > prev && latest > 240 && !isMobileNavOpen);
  });

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="theme-dark bg-band border-b border-white/5 text-[11px] uppercase tracking-[0.2em] text-zinc-400 py-2 hidden md:block">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gold">★</span>
              <span>Rooftop Dining • F-10, Islamabad</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-gold" />
                <span>Reservations:</span>
                {SITE_CONFIG.phones.map((p, i) => (
                  <span key={p.tel} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-zinc-600">|</span>}
                    <a
                      href={`tel:${p.tel}`}
                      className="hover:text-gold transition-colors"
                    >
                      {p.display}
                    </a>
                  </span>
                ))}
              </span>
            </div>
          </div>
        </Container>
      </div>

      <motion.header
        ref={headerRef}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: isHidden ? "-110%" : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "theme-dark fixed top-0 md:top-[33px] left-0 right-0 z-50 transition-[background-color,box-shadow,padding,top,border-color,backdrop-filter] duration-500",
          isScrolled
            ? "md:top-0 bg-page/95 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3"
            : "header-top py-5"
        )}
      >
        <Container>
          <nav className="flex items-center justify-between">
            {/* Logo Brand Crest */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold/60 flex items-center justify-center bg-black/40 group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all">
                <Utensils className="w-4 h-4 text-gold" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wider text-white group-hover:text-gold-light transition-colors">
                  TRUFFLES
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-gold -mt-1 font-medium">
                  CAFE & RESTAURANT
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-300 hover:text-gold transition-colors relative py-1 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Theme switch (always visible) + CTA Reservation Button */}
            <ThemeToggle className="ml-auto mr-2 sm:mr-0 sm:ml-0" />
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/reservations">
                <Button variant="primary" size="sm" className="shadow-lg">
                  Reserve a Table
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              className="lg:hidden p-2 text-zinc-300 hover:text-gold transition-colors focus:outline-none"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 flex flex-col items-end gap-1.5">
                <span
                  className={cn(
                    "block h-0.5 bg-[#d4af37] transition-all duration-300",
                    isMobileNavOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 bg-[#d4af37] transition-all duration-300",
                    isMobileNavOpen ? "opacity-0" : "w-4"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 bg-[#d4af37] transition-all duration-300",
                    isMobileNavOpen ? "w-6 -rotate-45 -translate-y-2" : "w-5"
                  )}
                />
              </div>
            </button>
          </nav>
        </Container>

        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
      </motion.header>
    </>
  );
}
