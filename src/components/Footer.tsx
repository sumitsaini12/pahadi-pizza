'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { BRAND_NAME, TAGLINE, ADDRESS, PHONE_PRIMARY, INSTAGRAM_URL, EMAIL_ADDRESS, WHATSAPP_NUMBER } from '../constants';
import { CREDIT, FOOTER_BLURB, WHATSAPP_GROUP_MESSAGE, TEL_PRIMARY } from '../content';

const LINKS = [
  { name: 'Our Menu', href: '#menu' },
  { name: 'Brand Story', href: '#about' },
  { name: 'Master Chef', href: '#chef' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Reviews', href: '#reviews' },
  { name: 'Location', href: '#location' },
];

export default function Footer() {
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const joinGroup = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_GROUP_MESSAGE)}`;
    try {
      window.open(url, '_blank');
      setMessage({ type: 'success', text: 'Opening WhatsApp... Please send the message to join our group!' });
    } catch {
      setMessage({ type: 'error', text: 'Unable to open WhatsApp. Please try again.' });
    }
    setTimeout(() => setMessage({ type: null, text: '' }), 5000);
  };

  return (
    <footer className="grain relative overflow-hidden bg-espresso pb-28 pt-20 text-cream md:pb-10 md:pt-24">
      <div aria-hidden className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(200,54,31,0.22),transparent_65%)]" />
      <div className="relative z-[2] mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-cream/10 pb-14 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.1fr_1.1fr]">
          <div>
            <a href="#top" className="flex items-center gap-3">
              <span className="block h-14 w-14 overflow-hidden rounded-full ring-2 ring-gold/50">
                <Image src="/app-logo.png" alt="Pahadi Pizza Logo" width={56} height={56} className="h-full w-full object-cover" />
              </span>
              <span>
                <span className="block font-display text-2xl font-semibold">{BRAND_NAME}</span>
                <span className="block text-xs uppercase tracking-[0.2em] text-gold">{TAGLINE}</span>
              </span>
            </a>
            <p className="mt-6 max-w-xs leading-relaxed text-cream/65">{FOOTER_BLURB}</p>
            <div className="mt-6 flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 transition hover:border-tomato hover:bg-tomato"
              >
                <Instagram className="h-5 w-5" aria-hidden />
              </a>
              <span aria-label="Facebook (coming soon)" role="img" className="grid h-11 w-11 cursor-not-allowed place-items-center rounded-full border border-cream/10 opacity-40">
                <Facebook className="h-5 w-5" aria-hidden />
              </span>
              <span aria-label="Twitter (coming soon)" role="img" className="grid h-11 w-11 cursor-not-allowed place-items-center rounded-full border border-cream/10 opacity-40">
                <Twitter className="h-5 w-5" aria-hidden />
              </span>
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-xl font-semibold">Quick Links</h2>
            <ul className="mt-5 space-y-3 text-cream/65">
              {LINKS.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="transition hover:text-gold-light">{l.name}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-xl font-semibold">Contact Info</h2>
            <ul className="mt-5 space-y-4 text-cream/65">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <span>{ADDRESS}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <a href={TEL_PRIMARY} className="transition hover:text-gold-light">{PHONE_PRIMARY}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <a href={`mailto:${EMAIL_ADDRESS}`} className="break-all transition hover:text-gold-light">{EMAIL_ADDRESS}</a>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-cream/10 bg-cream/[0.04] p-6">
            <h2 className="font-display text-xl font-semibold text-tomato-light">Newsletter</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">
              If you want to stay up to date with better offers and updates, please join our WhatsApp member group.
            </p>
            <button
              type="button"
              onClick={joinGroup}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/30 transition hover:brightness-110 active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Join WhatsApp group
            </button>
            <p aria-live="polite" className={`mt-3 min-h-5 text-sm font-medium ${message.type === 'error' ? 'text-tomato-light' : 'text-basil-light'}`}>
              {message.text}
            </p>
          </div>
        </div>

        <p className="pt-8 text-center text-sm text-cream/55">
          © {new Date().getFullYear()} {BRAND_NAME}. All Rights Reserved. Crafted for quality. Created by{' '}
          <a href={CREDIT.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-tomato-light transition hover:text-gold-light">
            {CREDIT.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
