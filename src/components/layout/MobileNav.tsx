"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { NAV_LINKS, SITE_CONFIG } from "@/constants";
import { Button } from "@/components/ui/Button";
import { Clock, MapPin, Phone, X } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const panel: Variants = {
  hidden: { x: "100%", opacity: 0.6 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: EASE, when: "beforeChildren", staggerChildren: 0.07 },
  },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.4, ease: EASE } },
};

const child: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

const subscribe = () => () => {};

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Portal target only exists in the browser.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  // Lock page scroll while the menu is open.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav"
          variants={panel}
          initial="hidden"
          animate="show"
          exit="exit"
          className="theme-dark lg:hidden fixed inset-0 z-[80] bg-page/98 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto px-6 py-8"
        >
          {/* Top Header */}
          <motion.div
            variants={child}
            className="flex items-center justify-between border-b border-white/10 pb-6"
          >
            <Image src="/images/logo.png" alt="Truffles Rooftop Restaurant" width={768} height={528} className="h-14 w-auto" />
            <motion.button
              onClick={onClose}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-6 h-6 text-gold" />
            </motion.button>
          </motion.div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-6 py-10">
            {NAV_LINKS.map((link) => (
              <motion.div key={link.href} variants={child} whileHover={{ x: 10 }}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-serif text-2xl font-light tracking-wide text-zinc-200 hover:text-gold transition-colors flex items-center justify-between group"
                >
                  <span>{link.label}</span>
                  <span className="text-sm font-sans text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    ✦
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom Actions & Info */}
          <motion.div variants={child} className="border-t border-white/10 pt-6 space-y-6">
            <Link href="/reservations" onClick={onClose} className="block">
              <Button variant="primary" size="lg" className="w-full">
                Reserve a Table
              </Button>
            </Link>

            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>
                  {SITE_CONFIG.address.venue}, {SITE_CONFIG.address.area} {SITE_CONFIG.address.city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span className="flex flex-wrap gap-x-3">
                  {SITE_CONFIG.phones.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="hover:text-white">
                      {p.display}
                    </a>
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>Dinner Service: Daily from 5:00 PM</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
