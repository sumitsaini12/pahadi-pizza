'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { BRAND_NAME, PHONE_PRIMARY } from '../constants';
import { TEL_PRIMARY, WHATSAPP_URL } from '../content';

const NAV_LINKS = [
  { name: 'Menu', href: '#menu' },
  { name: 'About', href: '#about' },
  { name: 'Chef', href: '#chef' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Reviews', href: '#reviews' },
  { name: 'Location', href: '#location' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? 'border-b border-cream/10 bg-espresso/95 py-2.5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] md:bg-espresso/85 md:backdrop-blur-xl'
          : 'bg-transparent py-4 md:py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <a href="#top" className="group flex items-center gap-3" aria-label={`${BRAND_NAME} – back to top`}>
          <span className="relative block h-11 w-11 overflow-hidden rounded-full ring-2 ring-gold/50 transition group-hover:ring-gold md:h-12 md:w-12">
            <Image src="/app-logo.png" alt="Pahadi Pizza Logo" width={48} height={48} priority className="h-full w-full object-cover" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-cream md:text-2xl">{BRAND_NAME}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="relative rounded-full px-4 py-2 text-sm font-semibold text-cream/80 transition hover:text-cream after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100"
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

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={TEL_PRIMARY}
            aria-label={`Call ${PHONE_PRIMARY}`}
            className="grid h-11 w-11 place-items-center rounded-full bg-tomato text-white shadow-lg shadow-tomato/30"
          >
            <Phone className="h-5 w-5" aria-hidden />
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 bg-cream/10 text-cream"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Tablet: nav collapses but CTAs stay visible */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="hidden h-11 w-11 place-items-center rounded-full border border-cream/20 bg-cream/10 text-cream md:grid lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-4 mt-3 overflow-hidden rounded-3xl border border-cream/10 bg-charcoal/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <ul className="grid grid-cols-2 gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3.5 font-display text-lg text-cream transition hover:bg-cream/10"
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={TEL_PRIMARY}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-tomato py-4 font-bold text-white"
            >
              <Phone className="h-5 w-5" aria-hidden />
              Call to Order
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
