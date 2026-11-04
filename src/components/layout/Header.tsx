"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import { NAV_LINKS, SITE_CONFIG } from "@/constants";
import { cn } from "@/utils";
import { Phone } from "lucide-react";

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
            <Link href="/" className="group flex items-center" aria-label="Truffles Cafe & Restaurant, home">
              <Image
                src="/images/logo.png"
                alt="Truffles"
                width={768}
                height={528}
                priority
                className={cn(
                  "w-auto transition-all duration-500 group-hover:brightness-125 group-hover:drop-shadow-[0_0_14px_rgba(212,175,55,0.45)]",
                  isScrolled ? "h-12 sm:h-14" : "h-14 sm:h-[4.25rem]"
                )}
              />
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

            {/* CTA Reservation Button (on phones it moves right, next to the menu button) */}
            <div className="ml-auto hidden items-center gap-4 sm:ml-0 sm:flex">
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
