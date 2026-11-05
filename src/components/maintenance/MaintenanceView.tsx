import Image from "next/image";
import { Clock, MessageCircle, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/constants";
import type { MaintenanceNotice } from "@/lib/siteStatus";

/**
 * The page visitors see while maintenance mode is on. It covers the whole screen, so the site's header and footer
 * (which belong to the pages underneath) are hidden while it shows.
 */
export function MaintenanceView({ notice }: { notice: MaintenanceNotice }) {
  return (
    <div className="theme-dark fixed inset-0 z-[9999] overflow-y-auto bg-page text-zinc-100">
      {/* the pages' own header and footer are not part of this screen */}
      <style>{"header, footer { display: none !important; }"}</style>
      <div className="aurora" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.12),transparent_60%)]" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <Image src="/images/logo.png" alt={SITE_CONFIG.name} width={768} height={528} priority className="h-auto w-40 sm:w-52" />

        <span className="mt-8 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] text-gold-light backdrop-blur-md sm:text-[11px] sm:tracking-[0.28em]">
          ✦ Rooftop Dining · F-10, Islamabad ✦
        </span>

        <h1 className="mt-6 font-serif text-4xl font-normal leading-[1.1] text-white sm:text-6xl">{notice.title}</h1>
        <span className="mt-6 block h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden="true" />
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-zinc-300 sm:text-lg">{notice.message}</p>

        {notice.eta && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-gold-light">
            <Clock className="h-4 w-4" /> Expected back: {notice.eta}
          </p>
        )}

        <div className="mt-10 w-full rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Reservations</p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {SITE_CONFIG.phones.map((p) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-sm tracking-wide text-gold-light transition-colors hover:bg-gold hover:text-[#0a0a0c]"
              >
                <Phone className="h-4 w-4" /> {p.display}
              </a>
            ))}
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm tracking-wide text-zinc-200 transition-colors hover:border-gold/60 hover:text-gold-light"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
