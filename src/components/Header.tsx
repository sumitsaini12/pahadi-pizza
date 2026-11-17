'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Pizza,
  BookOpen,
  ChefHat,
  Images,
  Star,
  MapPin,
  Navigation,
  type LucideIcon,
} from 'lucide-react';
import { BRAND_NAME, PHONE_PRIMARY, OPENING_HOURS } from '../constants';
import { TEL_PRIMARY, WHATSAPP_URL } from '../content';
import { DIRECTIONS_URL, SECTION_IDS } from '../lib/links';
import { useActiveSection } from '../lib/useActiveSection';
import { useReleaseDeferredSections } from '../lib/useReleaseDeferredSections';

const NAV_LINKS: { name: string; href: string; icon: LucideIcon }[] = [
  { name: 'Menu', href: '#menu', icon: Pizza },
  { name: 'About', href: '#about', icon: BookOpen },
  { name: 'Chef', href: '#chef', icon: ChefHat },
  { name: 'Gallery', href: '#gallery', icon: Images },
  { name: 'Reviews', href: '#reviews', icon: Star },
  { name: 'Location', href: '#location', icon: MapPin },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  useReleaseDeferredSections();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sheet open: lock page scroll, close on Escape, keep focus inside, restore focus on close.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.querySelector<HTMLElement>('a,button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const f = sheetRef.current.querySelectorAll<HTMLElement>('a,button');
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      toggle?.focus();
    };
  }, [open]);

  const solid = scrolled || open;
  const isActive = (href: string) => active === href.slice(1);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500 ${
          solid
            ? 'border-b border-cream/10 bg-espresso/95 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] md:bg-espresso/85 md:py-2.5 md:backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent md:py-5'
        }`}
      >
        {/* Phones: one fixed 64px bar, so sticky elements below it never shift. */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-auto md:px-8">
          <a href="#top" className="group flex min-h-11 items-center gap-3" aria-label={`${BRAND_NAME} – back to top`}>
            <span className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-gold/50 transition group-hover:ring-gold md:h-12 md:w-12">
              <Image src="/app-logo.png" alt="Pahadi Pizza Logo" width={48} height={48} priority className="h-full w-full object-cover" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-cream md:text-2xl">{BRAND_NAME}</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.name}
                href={l.href}
                aria-current={isActive(l.href) ? 'true' : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition hover:text-cream after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:bg-gold after:transition-transform hover:after:scale-x-100 ${
                  isActive(l.href) ? 'text-cream after:scale-x-100' : 'text-cream/80 after:scale-x-0'
                }`}
              >
                {l.name}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:ml-auto md:flex lg:ml-0">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-2.5 text-sm font-bold text-cream transition hover:border-basil-light hover:bg-basil/30"
            >
              <MessageCircle className="h-4 w-4 text-basil-light" aria-hidden />
              WhatsApp
            </a>
            <a
              href={TEL_PRIMARY}
              className="inline-flex items-center gap-2 rounded-full bg-tomato px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-tomato/30 transition hover:bg-tomato-dark"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call Now
            </a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 items-center gap-2 rounded-full border border-cream/20 bg-cream/10 pl-3.5 pr-4 text-sm font-bold text-cream transition active:scale-95 active:bg-cream/20 lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            <span className="md:hidden">{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>

      {/* Phones and tablets: navigation in a bottom sheet, within thumb reach. */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-espresso/70"
            />
            <motion.div
              ref={sheetRef}
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto rounded-t-[1.75rem] border-t border-cream/10 bg-charcoal px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 text-cream shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.7)]"
            >
              <div aria-hidden className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-cream/25" />
              <div className="mb-3 flex items-center justify-between">
                <p className="font-display text-xl font-semibold">Where to?</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center rounded-full bg-cream/10 transition active:scale-95 active:bg-cream/20"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <nav aria-label="Mobile">
                <ul className="grid grid-cols-2 gap-2">
                  {NAV_LINKS.map(({ name, href, icon: Icon }) => {
                    const current = isActive(href);
                    return (
                      <li key={name}>
                        <a
                          href={href}
                          onClick={() => setOpen(false)}
                          aria-current={current ? 'true' : undefined}
                          className={`flex min-h-14 items-center gap-3 rounded-2xl px-4 text-base font-bold transition active:scale-[0.98] ${
                            current ? 'bg-gold text-espresso' : 'bg-cream/[0.06] text-cream active:bg-cream/15'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${current ? '' : 'text-gold'}`} aria-hidden />
                          {name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-whatsapp font-bold text-white transition active:scale-[0.98] active:brightness-90"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  WhatsApp
                </a>
                <a
                  href={TEL_PRIMARY}
                  aria-label={`Call ${PHONE_PRIMARY}`}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-tomato font-bold text-white transition active:scale-[0.98] active:bg-tomato-dark"
                >
                  <Phone className="h-5 w-5" aria-hidden />
                  Call
                </a>
              </div>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-cream/15 font-bold text-cream transition active:bg-cream/10"
              >
                <Navigation className="h-5 w-5 text-gold" aria-hidden />
                Get Directions
              </a>
              <p className="mt-3 text-center text-sm text-cream/75">{OPENING_HOURS}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
