"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG, NAV_LINKS } from "@/constants";
import { OpeningTimes } from "@/components/layout/OpeningTimes";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Clock, Coffee, MapPin, PartyPopper, Phone, Mail } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/Stagger";
export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="theme-dark bg-band text-zinc-400 border-t border-white/10 relative overflow-hidden">
      {/* Subtle gold ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-[#d4af37]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Highlights banner */}
      <div className="border-b border-white/5 py-8">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-300">
                Rooftop dining · F-10, Islamabad
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Coffee className="w-5 h-5 text-gold" />
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-300">
                Hi-Tea · 7 days · 3–6 PM
              </span>
            </div>
            <div className="flex items-center gap-3">
              <PartyPopper className="w-5 h-5 text-gold" />
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-300">
                Birthdays, proposals &amp; private events
              </span>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <Stagger className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8" stagger={0.12}>
          {/* Brand Info (4 cols) */}
          <StaggerItem className="lg:col-span-4 space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-3xl font-semibold tracking-wider text-white">
                TRUFFLES
              </h3>
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
                ROOFTOP RESTAURANT • F-10 ISLAMABAD
              </p>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400 font-light">
              Bring your family, bring your friends, and enjoy a perfect
              evening overlooking Islamabad.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              {SITE_CONFIG.socials.instagram && (
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all bg-white/5 text-zinc-400"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              )}
              {SITE_CONFIG.socials.facebook && (
              <a
                href={SITE_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all bg-white/5 text-zinc-400"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              )}
            </div>
          </StaggerItem>

          {/* Quick Links (2 cols) */}
          <StaggerItem className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-lg text-white font-normal tracking-wide border-b border-white/10 pb-2">
              Explore
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs uppercase tracking-[0.18em] text-zinc-400 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/reservations"
                  className="text-xs uppercase tracking-[0.18em] text-gold hover:underline"
                >
                  Chef&apos;s Table
                </Link>
              </li>
            </ul>
          </StaggerItem>

          {/* Hours (3 cols) */}
          <StaggerItem className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-lg text-white font-normal tracking-wide border-b border-white/10 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span>Opening Times</span>
            </h4>
            <OpeningTimes />
          </StaggerItem>

          {/* Concierge & Newsletter (3 cols) */}
          <StaggerItem className="lg:col-span-3 space-y-6">
            <h4 className="font-serif text-lg text-white font-normal tracking-wide border-b border-white/10 pb-2">
              Concierge Desk
            </h4>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  {SITE_CONFIG.address.venue}, {SITE_CONFIG.address.area}{" "}
                  {SITE_CONFIG.address.city}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Reservations
                  </span>
                  {SITE_CONFIG.phones.map((p) => (
                    <a
                      key={p.tel}
                      href={`tel:${p.tel}`}
                      className="hover:text-white transition-colors"
                    >
                      {p.display}
                    </a>
                  ))}
                </div>
              </div>
              {SITE_CONFIG.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gold shrink-0" />
                  <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2 font-medium">
                Stay in the Loop
              </p>
              <p className="text-[11px] text-zinc-400 mb-3">
                Offers, festive menus and event news from Truffles.
              </p>
              <NewsletterForm />
            </div>
          </StaggerItem>
        </Stagger>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {currentYear} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-zinc-700">•</span>
            <span>F-10, Islamabad</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
